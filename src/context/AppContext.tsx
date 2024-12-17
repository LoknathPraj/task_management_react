import React, { createContext, useState, useEffect, useRef, ReactNode } from "react";
import { showNotification } from "../components/Toast";
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

const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

function AppProvider({ children }: AppProviderProps) {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const saveUserDetailsToLocalStorage = (userDetails: UserDetails | null) => {
    if (userDetails) {
      localStorage.setItem("userDetails", JSON.stringify(userDetails));
      localStorage.setItem("lastActivityTime", Date.now().toString());
    }
  };

  const clearUserDetailsFromLocalStorage = () => {
    setUserDetails(null);
    localStorage.removeItem("userDetails");
    localStorage.removeItem("lastActivityTime");
    showNotification("info", "Session expired. Please log in again.");
  };

  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    localStorage.setItem("lastActivityTime", Date.now().toString()); // Update last activity time
    timerRef.current = setTimeout(clearUserDetailsFromLocalStorage, INACTIVITY_TIMEOUT);
  };

  const checkInactivityOnLoad = () => {
    const lastActivityTime = localStorage.getItem("lastActivityTime");
    if (lastActivityTime) {
      const elapsedTime = Date.now() - parseInt(lastActivityTime, 10);
      if (elapsedTime > INACTIVITY_TIMEOUT) {
        clearUserDetailsFromLocalStorage();
      }
    }
  };

  useEffect(() => {

    checkInactivityOnLoad();
    const storedUserDetails = localStorage.getItem("userDetails");
    if (storedUserDetails) {
      setUserDetails(JSON.parse(storedUserDetails));
    }
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      if (timerRef.current) clearTimeout(timerRef.current);
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
