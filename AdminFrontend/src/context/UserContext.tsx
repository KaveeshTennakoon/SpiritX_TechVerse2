import React, { createContext, useContext, useState } from 'react';

interface UserContextType {
  user: {
    name: string;
    email: string;
  };
  updateUser: (data: { name: string; email: string }) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState({
    name: 'John Admin',
    email: 'john@spirit11.com',
  });

  const updateUser = (data: { name: string; email: string }) => {
    setUser(data);
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}