import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUserType = localStorage.getItem('userType');
    if (savedUser && savedUserType) {
      setCurrentUser(JSON.parse(savedUser));
      setUserType(savedUserType);
    }
    setLoading(false);
  }, []);

  const login = async (userData, type) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userData.email, password: userData.password, userType: type }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Login failed");
    }
    const user = await res.json();
    setCurrentUser(user);
    setUserType(type);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("userType", type);
    // Store JWT token
    if (user.token) localStorage.setItem("token", user.token);
    return user;
  };

  const register = async (userData, type) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        address: userData.address,
        contact: userData.contact || "",
        userType: type,
      }),
    });
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Registration failed");
    }
    const user = await res.json();
    setCurrentUser(user);
    setUserType(type);
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("userType", type);
    if (user.token) localStorage.setItem("token", user.token);
    return user;
  };

  const logout = () => {
    setCurrentUser(null);
    setUserType(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    return Promise.resolve();
  };

  const value = { currentUser, userType, login, register, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
