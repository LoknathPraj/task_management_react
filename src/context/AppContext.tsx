import React, { createContext, useState, useEffect, ReactNode } from "react";
interface UserDetails {
  token: string;
  userId: string;
  user: {
    _id: string;
    email: string;
    password: string;
    name: string;
    status: string;
    role: number;
    __v: number;
  };
}

interface AppContextType {
  userDetails: UserDetails | null;
  setUserDetails: React.Dispatch<React.SetStateAction<UserDetails | null>>;
}
const AppContext = createContext<AppContextType | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

function AppProvider({ children }: AppProviderProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);

  if (userDetails) {
    localStorage.setItem("userDetails", JSON.stringify(userDetails));
  }

  useEffect(() => {
    onPageLoad();
  }, []);

  const onPageLoad = async () => {
    setUserDetails(JSON.parse(localStorage.getItem("userDetails") || "null"));
  };

  return (
    <AppContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
