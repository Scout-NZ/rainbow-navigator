import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Session, User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';

interface SocialLinks {
  instagram: string;
  twitter: string;
  website: string;
  facebook: string;
  spotify: string;
  tiktok: string;
  linkedin: string;
}

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  location: string;
  pronouns: string;
  identities: string[];
  interests: string[];
  joinDate: string;
  badges: string[];
  socialLinks: SocialLinks;
  settings: {
    privacy: string;
    notifications: boolean;
    theme: string;
  };
  friends: string[];
  groups: string[];
  events: string[];
  imageUrl?: string;
  identity?: string;
  gender?: string;
}

interface UserContextType {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;
  attendEvent: (eventId: string) => Promise<void>;
  cancelEventAttendance: (eventId: string) => Promise<void>;
  addFriend: (friendId: string) => Promise<void>;
  removeFriend: (friendId: string) => Promise<void>;
  isFriend: (userId: string) => boolean;
  isInGroup: (groupId: string) => boolean;
  isAttendingEvent: (eventId: string) => boolean;
  
  userProfile: UserProfile | null;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  currentUser: { id: string };
  isGroupMember: (groupId: string | number) => boolean;
  isGroupAdmin: (groupId: string | number) => boolean;
  createGroup: (groupId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultSocialLinks: SocialLinks = {
  instagram: "",
  twitter: "",
  website: "",
  facebook: "",
  spotify: "",
  tiktok: "",
  linkedin: ""
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Map a raw profiles row from Supabase into the app's UserProfile shape
  const mapRowToProfile = (row: any, email: string): UserProfile => {
    let socialLinks = defaultSocialLinks;
    if (row.sociallinks) {
      try {
        const parsedLinks = typeof row.sociallinks === 'object'
          ? row.sociallinks as Record<string, unknown>
          : JSON.parse(row.sociallinks as string);

        socialLinks = {
          ...defaultSocialLinks,
          ...(parsedLinks as Partial<SocialLinks>)
        };
      } catch (e) {
        console.error("Error parsing social links:", e);
      }
    }

    return {
      id: row.id,
      name: row.name || "",
      username: row.username || "",
      email,
      avatar: row.imageurl || "",
      imageUrl: row.imageurl || "",
      coverPhoto: "",
      bio: row.bio || "",
      location: row.location || "",
      pronouns: row.pronouns || "",
      identities: [row.identity || ""].filter(Boolean),
      identity: row.identity || "",
      gender: row.gender || "",
      interests: row.interests || [],
      joinDate: row.created_at || new Date().toISOString(),
      badges: [],
      socialLinks,
      settings: { privacy: "public", notifications: true, theme: "light" },
      friends: [],
      groups: [],
      events: []
    };
  };

  const fetchUserProfile = async (userId: string, sessionUser?: User | null) => {
    console.log("Fetching user profile for:", userId);
    const email = sessionUser?.email || session?.user?.email || "";

    try {
      // maybeSingle distinguishes "no row yet" (null) from real errors
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUser(mapRowToProfile(data, email));
        setLoading(false);
        return;
      }

      // No row yet: the DB trigger creates it on signup, so this is rare
      // (e.g. accounts predating the trigger). Create it, then re-read.
      console.log("No profile row found; creating one...");
      const userName = email.split('@')[0] || "user";

      const { error: insertError } = await supabase.from("profiles").insert({
        id: userId,
        name: userName,
        username: userName,
      });

      // Ignore duplicate-key errors (trigger may have won the race)
      if (insertError && insertError.code !== "23505") {
        throw insertError;
      }

      const { data: newProfile, error: refetchError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (refetchError) throw refetchError;
      if (!newProfile) throw new Error("Profile could not be created");

      setUser(mapRowToProfile(newProfile, email));
      setLoading(false);
    } catch (error) {
      // Never substitute a fake identity: surface the failure honestly.
      console.error("Error in fetchUserProfile:", error);
      setUser(null);
      setLoading(false);
      toast({
        title: "Couldn't load your profile",
        description: "Please check your connection and refresh the page.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    console.log("UserProvider mounted");
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        
        if (event === "SIGNED_IN" && newSession) {
          setSession(newSession);
          setTimeout(() => {
            fetchUserProfile(newSession.user.id, newSession.user);
          }, 0);
        } else if (event === "SIGNED_OUT") {
          setSession(null);
          setUser(null);
          setLoading(false);
        } else if (event === "TOKEN_REFRESHED" && newSession) {
          setSession(newSession);
        }
      }
    );

    async function getSession() {
      try {
        console.log("Checking for existing session");
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error.message);
          setUser(null);
          setLoading(false);
          return;
        }

        if (data?.session) {
          console.log("Found existing session:", data.session.user.id);
          setSession(data.session);
          await fetchUserProfile(data.session.user.id, data.session.user);
        } else {
          console.log("No session found");
          setUser(null);
          setLoading(false);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
        setLoading(false);
      }
    }

    getSession();

    return () => {
      console.log("UserProvider unmounting");
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out successfully",
      });
      
      // Respect the deployment base path (e.g. /rainbow-navigator on GitHub Pages)
      window.location.href = (import.meta.env.VITE_BASE_PATH || "") + "/auth";
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !session) {
      toast({
        title: "Error updating profile",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    try {
      console.log("Updating profile with:", updates);
      
      if (updates.imageUrl && updates.imageUrl.startsWith('blob:')) {
        try {
          const response = await fetch(updates.imageUrl);
          const blob = await response.blob();
          
          const fileName = `${user.id}/${uuidv4()}`;
          const fileExt = blob.type.split('/')[1] || 'jpg';
          const filePath = `${fileName}.${fileExt}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(filePath, blob, {
              cacheControl: '3600',
              upsert: true,
            });
          
          if (uploadError) {
            throw new Error(`Error uploading image: ${uploadError.message}`);
          }
          
          const { data: { publicUrl } } = supabase.storage
            .from('profiles')
            .getPublicUrl(filePath);
            
          console.log("Image uploaded successfully:", publicUrl);
          
          updates.imageUrl = publicUrl;
        } catch (error) {
          console.error("Error processing profile image:", error);
          toast({
            title: "Error updating profile image",
            description: "There was an error uploading your profile image",
            variant: "destructive",
          });
        }
      }
      
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      
      const supabaseUpdates: Record<string, any> = {};
      
      if (updates.name !== undefined) supabaseUpdates.name = updates.name;
      if (updates.username !== undefined) supabaseUpdates.username = updates.username;
      if (updates.bio !== undefined) supabaseUpdates.bio = updates.bio;
      if (updates.location !== undefined) supabaseUpdates.location = updates.location;
      if (updates.pronouns !== undefined) supabaseUpdates.pronouns = updates.pronouns;
      if (updates.identity !== undefined) supabaseUpdates.identity = updates.identity;
      if (updates.gender !== undefined) supabaseUpdates.gender = updates.gender;
      if (updates.interests !== undefined) supabaseUpdates.interests = updates.interests;
      if (updates.imageUrl !== undefined) supabaseUpdates.imageurl = updates.imageUrl;
      
      if (updates.socialLinks) {
        supabaseUpdates.sociallinks = updates.socialLinks;
      }
      
      console.log("Sending to Supabase:", supabaseUpdates);
      
      const { error } = await supabase
        .from("profiles")
        .update(supabaseUpdates)
        .eq("id", user.id);
      
      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      toast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        description: "Your changes couldn't be saved. Please try again.",
        variant: "destructive",
      });
      
      fetchUserProfile(user.id);
    }
  };

  const updateUserProfile = updateProfile;

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const updatedGroups = [...user.groups, groupId];
      setUser({ ...user, groups: updatedGroups });
      
      toast({
        title: "Joined group successfully",
      });
    } catch (error) {
      console.error("Error joining group:", error);
      toast({
        title: "Error joining group",
        variant: "destructive",
      });
    }
  };

  const leaveGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      const updatedGroups = user.groups.filter(g => g !== groupId);
      setUser({ ...user, groups: updatedGroups });
      
      toast({
        title: "Left group successfully",
      });
    } catch (error) {
      console.error("Error leaving group:", error);
      toast({
        title: "Error leaving group",
        variant: "destructive",
      });
    }
  };

  const attendEvent = async (eventId: string) => {
    if (!user) return;
    
    try {
      const updatedEvents = [...user.events, eventId];
      setUser({ ...user, events: updatedEvents });
      
      toast({
        title: "Attending event successfully",
      });
    } catch (error) {
      console.error("Error attending event:", error);
      toast({
        title: "Error attending event",
        variant: "destructive",
      });
    }
  };

  const cancelEventAttendance = async (eventId: string) => {
    if (!user) return;
    
    try {
      const updatedEvents = user.events.filter(e => e !== eventId);
      setUser({ ...user, events: updatedEvents });
      
      toast({
        title: "Canceled event attendance successfully",
      });
    } catch (error) {
      console.error("Error canceling event attendance:", error);
      toast({
        title: "Error canceling event attendance",
        variant: "destructive",
      });
    }
  };

  const addFriend = async (friendId: string) => {
    if (!user) return;
    
    try {
      const updatedFriends = [...user.friends, friendId];
      setUser({ ...user, friends: updatedFriends });
      
      toast({
        title: "Added friend successfully",
      });
    } catch (error) {
      console.error("Error adding friend:", error);
      toast({
        title: "Error adding friend",
        variant: "destructive",
      });
    }
  };

  const removeFriend = async (friendId: string) => {
    if (!user) return;
    
    try {
      const updatedFriends = user.friends.filter(f => f !== friendId);
      setUser({ ...user, friends: updatedFriends });
      
      toast({
        title: "Removed friend successfully",
      });
    } catch (error) {
      console.error("Error removing friend:", error);
      toast({
        title: "Error removing friend",
        variant: "destructive",
      });
    }
  };

  const isFriend = (userId: string) => {
    if (!user) return false;
    return user.friends.includes(userId);
  };

  const isInGroup = (groupId: string) => {
    if (!user) return false;
    return user.groups.includes(groupId);
  };

  const isAttendingEvent = (eventId: string) => {
    if (!user) return false;
    return user.events.includes(eventId);
  };
  
  const isGroupMember = (groupId: string | number) => {
    if (!user) return false;
    return user.groups.includes(String(groupId));
  };
  
  const isGroupAdmin = (_groupId: string | number) => {
    // Admin roles aren't implemented yet; membership must never imply admin.
    return false;
  };
  
  const createGroup = async (groupId: string) => {
    await joinGroup(groupId);
    toast({
      title: "Group created!",
      description: "You are now the admin of this group.",
    });
  };

  const value = {
    user,
    session,
    loading,
    signOut,
    updateProfile,
    joinGroup,
    leaveGroup,
    attendEvent,
    cancelEventAttendance,
    addFriend,
    removeFriend,
    isFriend,
    isInGroup,
    isAttendingEvent,
    
    userProfile: user,
    updateUserProfile,
    currentUser: { id: user?.id || "1" },
    isGroupMember,
    isGroupAdmin,
    createGroup
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
