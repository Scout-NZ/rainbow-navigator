import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockUserProfile } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";
import { Session, User } from "@supabase/supabase-js";

// Define a more comprehensive SocialLinks type
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
  imageUrl?: string; // Added for compatibility with existing components
  identity?: string; // Added for compatibility with existing components
  gender?: string; // Added for compatibility with existing components
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
  
  // For backward compatibility with existing components
  userProfile: UserProfile | null;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  currentUser: { id: string };
  isGroupMember: (groupId: string | number) => boolean;
  isGroupAdmin: (groupId: string | number) => boolean;
  createGroup: (groupId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Create default social links object
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
  const [authListenersInitialized, setAuthListenersInitialized] = useState(false);

  // Mock user for development
  const mockUser: UserProfile = {
    id: String(mockUserProfile.id),
    name: mockUserProfile.name,
    username: mockUserProfile.username,
    email: mockUserProfile.email || "",
    avatar: mockUserProfile.avatar,
    coverPhoto: mockUserProfile.coverPhoto,
    bio: mockUserProfile.bio,
    location: mockUserProfile.location,
    pronouns: mockUserProfile.pronouns,
    identities: mockUserProfile.identities,
    interests: mockUserProfile.interests,
    joinDate: mockUserProfile.joinDate,
    badges: mockUserProfile.badges,
    socialLinks: {
      ...defaultSocialLinks,
      instagram: mockUserProfile.socialLinks?.instagram || "",
      twitter: mockUserProfile.socialLinks?.twitter || "",
      website: mockUserProfile.socialLinks?.website || ""
    },
    settings: mockUserProfile.settings,
    friends: ["2", "3"],
    groups: ["1", "4"],
    events: ["1", "3"],
    imageUrl: mockUserProfile.avatar, // Add imageUrl for compatibility
    identity: mockUserProfile.identities[0] || "", // Add identity for compatibility
    gender: "Non-Binary" // Default gender
  };

  // Helper function to fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (profileError) {
        console.log("No profile found, creating one...");
        // If no profile exists, create one
        const userEmail = session?.user?.email || "";
        await supabase.from("profiles").insert({
          id: userId,
          name: userEmail.split('@')[0],
          username: userEmail.split('@')[0],
          sociallinks: defaultSocialLinks
        });
        
        // Fetch the newly created profile
        const { data: newProfile, error: newProfileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
          
        if (newProfileError || !newProfile) {
          console.error("Failed to fetch newly created profile:", newProfileError);
          setUser(mockUser); // Fallback to mock user
          return;
        }
        
        profileData = newProfile;
      }

      if (profileData) {
        // Parse sociallinks from JSON if it exists
        let socialLinks = defaultSocialLinks;
        if (profileData.sociallinks) {
          try {
            const parsedLinks = typeof profileData.sociallinks === 'object' 
              ? profileData.sociallinks 
              : JSON.parse(profileData.sociallinks as string);
            
            socialLinks = {
              ...defaultSocialLinks,
              ...parsedLinks
            };
          } catch (e) {
            console.error("Error parsing social links:", e);
          }
        }

        // Convert Supabase profile to our UserProfile format
        const userProfile: UserProfile = {
          id: profileData.id,
          name: profileData.name || "",
          username: profileData.username || "",
          email: session?.user?.email || "",
          avatar: profileData.imageurl || "", // Note the lowercase 'url' from DB
          imageUrl: profileData.imageurl || "", // For compatibility
          coverPhoto: "",
          bio: profileData.bio || "",
          location: profileData.location || "",
          pronouns: profileData.pronouns || "",
          identities: [profileData.identity || ""].filter(Boolean),
          identity: profileData.identity || "", // For compatibility
          gender: profileData.gender || "", // For compatibility
          interests: profileData.interests || [],
          joinDate: profileData.created_at || new Date().toISOString(),
          badges: [],
          socialLinks: socialLinks,
          settings: { privacy: "public", notifications: true, theme: "light" },
          friends: profileData.friends > 0 ? ["2", "3"] : [],
          groups: profileData.groups > 0 ? ["1", "4"] : [],
          events: profileData.events > 0 ? ["1", "3"] : []
        };
        
        setUser(userProfile);
      } else {
        // No profile found after attempted creation, use mock data
        setUser(mockUser);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setUser(mockUser); // Fallback to mock user
    }
  };

  useEffect(() => {
    // First, set up the auth listeners
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log("Auth state changed:", event, newSession?.user?.id);
        setSession(newSession);
        
        if (event === "SIGNED_IN" && newSession) {
          await fetchUserProfile(newSession.user.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );
    
    setAuthListenersInitialized(true);

    // Then check if there's an existing session
    async function getSession() {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error.message);
          setUser(null);
          setLoading(false);
          return;
        }

        if (data?.session) {
          setSession(data.session);
          await fetchUserProfile(data.session.user.id);
        } else {
          // No session found
          setUser(null);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (authListenersInitialized) {
      getSession();
    }

    // Clean up the auth listener on unmount
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [authListenersInitialized]);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      console.error("Error signing out:", error);
      toast({
        title: "Error signing out",
        variant: "destructive",
      });
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    try {
      // In a real app, update the profile in Supabase
      // For now, just update the local state
      setUser({ ...user, ...updates });
      
      toast({
        title: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error updating profile",
        variant: "destructive",
      });
    }
  };

  // Legacy alias for updateProfile
  const updateUserProfile = updateProfile;

  const joinGroup = async (groupId: string) => {
    if (!user) return;
    
    try {
      // In a real app, update the groups in Supabase
      // For now, just update the local state
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
      // In a real app, update the groups in Supabase
      // For now, just update the local state
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
      // In a real app, update the events in Supabase
      // For now, just update the local state
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
      // In a real app, update the events in Supabase
      // For now, just update the local state
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
      // In a real app, update the friends in Supabase
      // For now, just update the local state
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
      // In a real app, update the friends in Supabase
      // For now, just update the local state
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
  
  // Compatibility methods
  const isGroupMember = (groupId: string | number) => {
    if (!user) return false;
    return user.groups.includes(String(groupId));
  };
  
  const isGroupAdmin = (groupId: string | number) => {
    // For now, just return true for the groups the user is in
    return isGroupMember(groupId);
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
    
    // For backward compatibility
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
