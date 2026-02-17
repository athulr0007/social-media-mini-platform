import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const login = (data) => {
    const normalizedUser = {
      _id: data._id,
      username: data.username,     // REQUIRED, primary identity
      name: data.name,             // display name
      email: data.email,
      avatar: data.avatar || null,
      bio: data.bio || "",
      isAdmin: data.isAdmin || false,
      isBanned: data.isBanned || false,
      token: data.token
    };

    setUser(normalizedUser);
    localStorage.setItem("user", JSON.stringify(normalizedUser));
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
