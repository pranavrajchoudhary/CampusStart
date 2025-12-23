import React, { createContext, useContext, useState, useEffect } from "react";
import API from "../api/axiosConfig";

const UserContext = createContext();

 
const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,  
    _id: user._id || user.id,  
  };
};

export const UserProvider = ({ children }) => {
  
  const storedUser = localStorage.getItem("userInfo")
    ? normalizeUser(JSON.parse(localStorage.getItem("userInfo")))
    : null;

  const [user, setUser] = useState(storedUser);
  const [loading, setLoading] = useState(true);

   
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const { data } = await API.get("/profile/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const normalizedUser = normalizeUser(data.user);
      setUser(normalizedUser);
      localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
    } catch (err) {
      console.error("Error fetching current user:", err);
      setUser(null);
      localStorage.removeItem("userInfo");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

 
  const login = async (email, password) => {
    try {
      const { data } = await API.post("/auth/login", { email, password });

      const normalizedUser = normalizeUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
      setUser(normalizedUser);

      return true;
    } catch (err) {
      console.error("Login failed:", err.response?.data?.message || err.message);
      return false;
    }
  };

 
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children} 
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
