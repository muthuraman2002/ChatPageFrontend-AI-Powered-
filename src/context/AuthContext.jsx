import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { storeJWT } from "../utils/auth";

const AuthContext = createContext();
const baseURL = import.meta.env.VITE_API_SERVER_IP;
export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create Axios instance
  const axiosInstance = axios.create({
    baseURL: baseURL, // Change to your backend URL
    withCredentials: true,
  });

  // Attach token from localStorage
  axiosInstance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Fetch user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/users/me"); // Replace with your endpoint
        setUser(res.data);
      } catch (err) {
        setUser(null); // Not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    const res = await axiosInstance.post('/login', credentials);

    const data = await res.data;

storeJWT(data.token)
    setUser(data.data);
    return res
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, axiosInstance, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
