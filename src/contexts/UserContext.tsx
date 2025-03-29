
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUserProfile } from '@/data/mockData';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

type UserProfile = {
  id: string;
  name: string;
  username?: string;
  bio?: string;
  location?: string;
  identity?: string;
  pronouns?: string;
  gender?: string;
  interests: string[];
  imageUrl?: string;
  friends: number;
  groups: number;
  events: number;
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    spotify?: string;
    tiktok?: string;
    linkedin?: string;
  };
};

type UserContextType = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  currentUser: { id: string; name: string };
  joinedGroups: string[];
  adminGroups: string[];
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  isGroupMember: (groupId: string) => boolean;
  isGroupAdmin: (groupId: string) => boolean;
  createGroup: (groupId: string) => void;
  userProfile: UserProfile;
  updateUserProfile: (updatedProfile: Partial<UserProfile>) => Promise<void>;
  signOut: () => Promise<void>;
};

const defaultUserContext: UserContextType = {
  loading: true,
  session: null,
  user: null,
  currentUser: { id: mockUserProfile.id, name: mockUserProfile.name },
  joinedGroups: [],
  adminGroups: [],
  joinGroup: () => {},
  leaveGroup: () => {},
  isGroupMember: () => false,
  isGroupAdmin: () => false,
  createGroup: () => {},
  userProfile: mockUserProfile,
  updateUserProfile: async () => {},
  signOut: async () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [adminGroups, setAdminGroups] = useState<string[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(mockUserProfile);
  const [profileError, setProfileError] = useState<string | null>(null);
  const { toast } = useToast();

  // Set up auth state listener and check for existing session
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Don't fetch profile here - will be done in another effect
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile when user changes
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        // If not logged in, use mock data for demo purposes
        setUserProfile(mockUserProfile);
        setProfileError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setProfileError(null);

      try {
        console.log('Fetching profile for user:', user.id);
        
        // First, check if the profile exists
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            console.log('Profile not found, creating new profile for user:', user.id);
            
            // Profile doesn't exist, create one
            const newProfile = {
              id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              username: user.email?.split('@')[0],
              interests: [],
              friends: 0,
              groups: 0,
              events: 0,
            };
            
            const { error: insertError } = await supabase
              .from('profiles')
              .insert([newProfile]);
              
            if (insertError) {
              console.error('Error creating profile:', insertError);
              throw insertError;
            }
            
            setUserProfile({
              ...mockUserProfile,
              ...newProfile,
              id: user.id,
            });
          } else {
            console.error('Error fetching user profile:', error);
            throw error;
          }
        } else if (data) {
          // Transform the social links from JSON to our expected format
          const socialLinksData = data.sociallinks as Json;
          let parsedSocialLinks: UserProfile['socialLinks'] = {};
          
          if (socialLinksData && typeof socialLinksData === 'object') {
            parsedSocialLinks = {
              instagram: (socialLinksData as any).instagram,
              facebook: (socialLinksData as any).facebook,
              twitter: (socialLinksData as any).twitter,
              spotify: (socialLinksData as any).spotify,
              tiktok: (socialLinksData as any).tiktok,
              linkedin: (socialLinksData as any).linkedin,
            };
          }
          
          const profileData: UserProfile = {
            id: data.id,
            name: data.name || user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            username: data.username,
            bio: data.bio,
            location: data.location,
            identity: data.identity,
            pronouns: data.pronouns,
            gender: data.gender,
            interests: data.interests || [],
            imageUrl: data.imageurl, // Changed to match database column name
            friends: data.friends || 0,
            groups: data.groups || 0,
            events: data.events || 0,
            socialLinks: parsedSocialLinks,
          };
          
          setUserProfile(profileData);
        }
      } catch (error: any) {
        console.error('Failed to fetch profile:', error);
        setProfileError('Failed to load user profile');
        toast({
          title: 'Error',
          description: 'Failed to load user profile.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, toast]);

  // Load initial joined groups from mockData
  useEffect(() => {
    import('@/data/mockData').then(({ mockGroups }) => {
      const userJoinedGroups = mockGroups
        .filter(group => group.members.includes(userProfile.id))
        .map(group => group.id);
      
      const userAdminGroups = mockGroups
        .filter(group => group.admins.includes(userProfile.id))
        .map(group => group.id);
      
      setJoinedGroups(userJoinedGroups);
      setAdminGroups(userAdminGroups);
    });
  }, [userProfile.id]);

  const currentUser = { 
    id: user?.id || mockUserProfile.id,
    name: userProfile.name || user?.user_metadata?.name || user?.email?.split('@')[0] || 'User',
  };

  const joinGroup = (groupId: string) => {
    if (!joinedGroups.includes(groupId)) {
      setJoinedGroups([...joinedGroups, groupId]);
      
      // In a real app, we would update the backend here
      import('@/data/mockData').then(({ mockGroups }) => {
        const groupIndex = mockGroups.findIndex(g => g.id === groupId);
        if (groupIndex !== -1) {
          if (!mockGroups[groupIndex].members.includes(currentUser.id)) {
            mockGroups[groupIndex].members.push(currentUser.id);
            mockGroups[groupIndex].memberCount += 1;
          }
        }
      });
    }
  };

  const leaveGroup = (groupId: string) => {
    setJoinedGroups(joinedGroups.filter(id => id !== groupId));
    
    // In a real app, we would update the backend here
    import('@/data/mockData').then(({ mockGroups }) => {
      const groupIndex = mockGroups.findIndex(g => g.id === groupId);
      if (groupIndex !== -1) {
        mockGroups[groupIndex].members = mockGroups[groupIndex].members.filter(id => id !== currentUser.id);
        mockGroups[groupIndex].memberCount = Math.max(0, mockGroups[groupIndex].memberCount - 1);
      }
    });
  };

  const createGroup = (groupId: string) => {
    joinGroup(groupId);
    setAdminGroups([...adminGroups, groupId]);
    
    // In a real app, we would update the backend here
    import('@/data/mockData').then(({ mockGroups }) => {
      const groupIndex = mockGroups.findIndex(g => g.id === groupId);
      if (groupIndex !== -1 && !mockGroups[groupIndex].admins.includes(currentUser.id)) {
        mockGroups[groupIndex].admins.push(currentUser.id);
      }
    });
  };

  const isGroupMember = (groupId: string) => joinedGroups.includes(groupId);
  const isGroupAdmin = (groupId: string) => adminGroups.includes(groupId);

  // Update profile function that saves to Supabase
  const updateUserProfile = async (updatedProfile: Partial<UserProfile>) => {
    const newProfile = { ...userProfile, ...updatedProfile };
    setUserProfile(newProfile);
    
    // Save to localStorage for persistence in demo mode
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
    
    // If authenticated, update the profile in Supabase
    if (user) {
      try {
        // Convert our socialLinks object to the format expected by the database
        const socialLinks = newProfile.socialLinks || {};
        
        const { error } = await supabase
          .from('profiles')
          .update({
            name: newProfile.name,
            username: newProfile.username,
            bio: newProfile.bio,
            location: newProfile.location,
            identity: newProfile.identity,
            pronouns: newProfile.pronouns,
            gender: newProfile.gender,
            interests: newProfile.interests,
            imageurl: newProfile.imageUrl, // Changed to match database column name
            sociallinks: socialLinks, // Changed to match database column name
          })
          .eq('id', user.id);

        if (error) {
          console.error('Error updating profile:', error);
          toast({
            title: 'Error',
            description: 'Failed to update profile.',
            variant: 'destructive',
          });
          throw error;
        }

        toast({
          title: 'Profile updated',
          description: 'Your profile has been successfully updated.',
        });
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
      toast({
        title: 'Error',
        description: 'Failed to sign out.',
        variant: 'destructive',
      });
    } else {
      // Reset to demo data when logged out
      setUserProfile(mockUserProfile);
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    }
  };

  return (
    <UserContext.Provider
      value={{
        loading,
        session,
        user,
        currentUser,
        joinedGroups,
        adminGroups,
        joinGroup,
        leaveGroup,
        isGroupMember,
        isGroupAdmin,
        createGroup,
        userProfile,
        updateUserProfile,
        signOut,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
