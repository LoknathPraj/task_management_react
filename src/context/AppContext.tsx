import React, { createContext, useEffect, useState } from "react";

const AppContext: any = createContext(undefined);
function AppProvider({ children }: any) {
  const [userDetails, setUserDetails] = useState<any>("");

  useEffect(() => {
    onPageLoad();
  }, []);

  const onPageLoad = async () => {};

  return (
    <AppContext.Provider
      value={{
        userDetails: userDetails,
        setUserDetails: setUserDetails,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export { AppProvider, AppContext };
