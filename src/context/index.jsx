import { createContext, useState } from "react";
export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  let userData = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState({
    name: userData?.fullName,
    phone: userData?.phone,
    address: userData?.address,
    id: userData?.id,
    email: userData?.email,
    accessToken: userData?.accessToken,
    userType: userData?.userType,
    avatar: userData?.avatar ? userData?.avatar : null,
  });
  const value = { user, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
