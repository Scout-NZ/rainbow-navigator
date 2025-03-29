
import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUserProfile } from '@/data/mockData';

type UserContextType = {
  currentUser: { id: string; name: string };
  joinedGroups: string[];
  adminGroups: string[];
  joinGroup: (groupId: string) => void;
  leaveGroup: (groupId: string) => void;
  isGroupMember: (groupId: string) => boolean;
  isGroupAdmin: (groupId: string) => boolean;
  createGroup: (groupId: string) => void;
  // Add profile management
  userProfile: typeof mockUserProfile;
  updateUserProfile: (updatedProfile: Partial<typeof mockUserProfile>) => void;
};

const defaultUserContext: UserContextType = {
  currentUser: { id: mockUserProfile.id, name: mockUserProfile.name },
  joinedGroups: [],
  adminGroups: [],
  joinGroup: () => {},
  leaveGroup: () => {},
  isGroupMember: () => false,
  isGroupAdmin: () => false,
  createGroup: () => {},
  // Add default profile
  userProfile: mockUserProfile,
  updateUserProfile: () => {},
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [joinedGroups, setJoinedGroups] = useState<string[]>([]);
  const [adminGroups, setAdminGroups] = useState<string[]>([]);
  const currentUser = { id: mockUserProfile.id, name: mockUserProfile.name };
  
  // Add user profile state
  const [userProfile, setUserProfile] = useState(mockUserProfile);

  // Load initial joined groups from mockData
  useEffect(() => {
    import('@/data/mockData').then(({ mockGroups }) => {
      const userJoinedGroups = mockGroups
        .filter(group => group.members.includes(currentUser.id))
        .map(group => group.id);
      
      const userAdminGroups = mockGroups
        .filter(group => group.admins.includes(currentUser.id))
        .map(group => group.id);
      
      setJoinedGroups(userJoinedGroups);
      setAdminGroups(userAdminGroups);
    });
  }, [currentUser.id]);

  // Load profile from localStorage on initial load
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing saved profile:', error);
      }
    }
  }, []);

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

  // Add profile update function
  const updateUserProfile = (updatedProfile: Partial<typeof mockUserProfile>) => {
    const newProfile = { ...userProfile, ...updatedProfile };
    setUserProfile(newProfile);
    
    // Save to localStorage for persistence
    localStorage.setItem('userProfile', JSON.stringify(newProfile));
  };

  return (
    <UserContext.Provider
      value={{
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
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
