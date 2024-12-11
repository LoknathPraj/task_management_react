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
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null); 

  const saveUserDetailsToLocalStorage = (userDetails: UserDetails | null) => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
    }
  };

  useEffect(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }

    const resetTimer = () => {
  
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

 
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      clearTimeout(timer as NodeJS.Timeout);
    };
  }, []);

  useEffect(() => {
    if (userDetails) {
      saveUserDetailsToLocalStorage(userDetails);
    }
  }, [userDetails]);

  return (
    <AppContext.Provider value={{ userDetails, setUserDetails }}>
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
