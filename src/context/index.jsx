import { createContext, useState } from "react";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  let userData = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState({
    name: userData?.fullName,
    id: userData?.id,
    email: userData?.email,
    accessToken: userData?.accessToken,
    userType: userData?.userType,
  });
  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
