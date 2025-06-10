"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {

        let username = null;
        const stored = localStorage.getItem("ghummakadUser");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            username = parsed.username || null;
          } catch (e) {
            console.error("Failed to parse ghummakadUser from localStorage", e);
          }
        }

        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          username: username,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const logout = () => {
    localStorage.removeItem("ghummakadUser");
    return signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
