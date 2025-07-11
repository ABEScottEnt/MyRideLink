// OLD AUTHCONTEXT
// import React, { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(() => {
//     const saved = localStorage.getItem("user");
//     return saved ? JSON.parse(saved) : null;
//   });
//   const [loading, setLoading] = useState(true);

//   // Configure axios defaults
//   axios.defaults.baseURL =
//     process.env.REACT_APP_API_URL || "http://localhost:3000/api/v1";
//   axios.defaults.withCredentials = true;

//   // Add request interceptor to include auth token
//   useEffect(() => {
//     const requestInterceptor = axios.interceptors.request.use(
//       (config) => {
//         const token = localStorage.getItem("accessToken");
//         if (token) {
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error) => {
//         return Promise.reject(error);
//       }
//     );

//     const responseInterceptor = axios.interceptors.response.use(
//       (response) => response,
//       async (error) => {
//         if (error.response?.status === 401) {
//           // Token expired, try to refresh
//           try {
//             const refreshToken = localStorage.getItem("refreshToken");
//             if (refreshToken) {
//               const response = await axios.post("/auth/refresh-token", {
//                 refreshToken,
//               });
//               localStorage.setItem("accessToken", response.data.data.token);
//               error.config.headers.Authorization = `Bearer ${response.data.data.token}`;
//               return axios(error.config);
//             }
//           } catch (refreshError) {
//             // Refresh failed, logout user
//             setUser(null);
//             localStorage.removeItem("accessToken");
//             localStorage.removeItem("refreshToken");
//           }
//         }
//         return Promise.reject(error);
//       }
//     );

//     return () => {
//       axios.interceptors.request.eject(requestInterceptor);
//       axios.interceptors.response.eject(responseInterceptor);
//     };
//   }, []);

//   // Check if user is already authenticated on app load
//   useEffect(() => {
//     checkAuthStatus();
//   }, []);

//   const checkAuthStatus = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       const response = await axios.get("/auth/me");
//       setUser(response.data.user);
//     } catch (error) {
//       // User is not authenticated
//       setUser(null);
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const login = (email, password) => {
//     // Demo: accept any email/password
//     const fakeUser = { email };
//     setUser(fakeUser);
//     localStorage.setItem("user", JSON.stringify(fakeUser));
//     return true;
//   };

//   const register = (email, password, firstName, lastName) => {
//     // Demo: accept any registration
//     const fakeUser = { email, firstName, lastName };
//     setUser(fakeUser);
//     localStorage.setItem("user", JSON.stringify(fakeUser));
//     return true;
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   const value = {
//     user,
//     isAuthenticated: !!user,
//     loading,
//     login,
//     register,
//     logout,
//     checkAuthStatus,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };
