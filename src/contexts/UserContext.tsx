
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { mockUserProfile, mockGroups, mockEvents } from "@/data/mockData";
import { toast } from "@/components/ui/use-toast";

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
  socialLinks: {
    instagram: string;
    twitter: string;
    website: string;
  };
  settings: {
    privacy: string;
    notifications: boolean;
    theme: string;
  };
  friends: string[];
  groups: string[];
  events: string[];
  imageUrl?: string; // Added for compatibility with existing components
}

interface AuthSession {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  user: {
    id: string;
    app_metadata: Record<string, any>;
    user_metadata: Record<string, any>;
    aud: string;
    email?: string;
  };
}

interface UserContextType {
  user: UserProfile | null;
  session: AuthSession | null;
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
  currentUser: { id: string };
  isGroupMember: (groupId: string | number) => boolean;
  isGroupAdmin: (groupId: string | number) => boolean;
  createGroup: (groupId: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);

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
    socialLinks: mockUserProfile.socialLinks,
    settings: mockUserProfile.settings,
    friends: ["2", "3"],
    groups: ["1", "4"],
    events: ["1", "3"],
    imageUrl: mockUserProfile.avatar // Add imageUrl for compatibility
  };

  useEffect(() => {
    async function getSession() {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Error fetching session:", error.message);
          setUser(mockUser); // For development, use mock data
          setLoading(false);
          return;
        }

        if (data?.session) {
          setSession(data.session as AuthSession);
          
          // Fetch user profile from Supabase
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", data.session.user.id)
            .single();

          if (profileError || !profileData) {
            console.log("No profile found, using mock data for development");
            setUser(mockUser); // For development, use mock data
          } else {
            // Convert Supabase profile to our UserProfile format
            const userProfile: UserProfile = {
              id: profileData.id,
              name: profileData.name || "",
              username: profileData.username || "",
              email: data.session.user.email || "",
              avatar: profileData.imageurl || "", // Note the lowercase 'url' from DB
              imageUrl: profileData.imageurl || "", // For compatibility
              coverPhoto: "",
              bio: profileData.bio || "",
              location: profileData.location || "",
              pronouns: profileData.pronouns || "",
              identities: [profileData.identity || ""].filter(Boolean),
              interests: profileData.interests || [],
              joinDate: profileData.created_at || new Date().toISOString(),
              badges: [],
              socialLinks: profileData.sociallinks || { instagram: "", twitter: "", website: "" },
              settings: { privacy: "public", notifications: true, theme: "light" },
              friends: (profileData.friends > 0) ? ["2", "3"] : [],
              groups: (profileData.groups > 0) ? ["1", "4"] : [],
              events: (profileData.events > 0) ? ["1", "3"] : []
            };
            setUser(userProfile);
          }
        } else {
          // No session found, use mock data for development
          setUser(mockUser);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(mockUser); // For development, use mock data
      } finally {
        setLoading(false);
      }
    }

    getSession();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession as AuthSession | null);
        
        if (event === "SIGNED_IN" && newSession) {
          // Fetch user profile from Supabase
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", newSession.user.id)
            .single();

          if (profileError || !profileData) {
            console.log("No profile found or error:", profileError?.message);
            setUser(mockUser); // For development, use mock data
          } else {
            // Convert Supabase profile to our UserProfile format
            const userProfile: UserProfile = {
              id: profileData.id,
              name: profileData.name || "",
              username: profileData.username || "",
              email: newSession.user.email || "",
              avatar: profileData.imageurl || "", // Note the lowercase 'url' from DB
              imageUrl: profileData.imageurl || "", // For compatibility
              coverPhoto: "",
              bio: profileData.bio || "",
              location: profileData.location || "",
              pronouns: profileData.pronouns || "",
              identities: [profileData.identity || ""].filter(Boolean),
              interests: profileData.interests || [],
              joinDate: profileData.created_at || new Date().toISOString(),
              badges: [],
              socialLinks: profileData.sociallinks || { instagram: "", twitter: "", website: "" },
              settings: { privacy: "public", notifications: true, theme: "light" },
              friends: (profileData.friends > 0) ? ["2", "3"] : [],
              groups: (profileData.groups > 0) ? ["1", "4"] : [],
              events: (profileData.events > 0) ? ["1", "3"] : []
            };
            setUser(userProfile);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
