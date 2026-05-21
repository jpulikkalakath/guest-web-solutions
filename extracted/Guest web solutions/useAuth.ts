import { useState, useEffect, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

const ADMIN_EMAIL = "jpulikkalakath@gmail.com";

export interface AppUser {
  uid: string;
  email: string | null;
  name: string | null;
  role: "user" | "admin";
}

function isAdminEmail(email: string | null): boolean {
  return email?.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase();
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userDoc = await getDoc(doc(db, "users", fbUser.uid));
        const data = userDoc.exists() ? userDoc.data() : {};

        // Force admin role for the admin email
        const role = isAdminEmail(fbUser.email) ? "admin" : ((data.role as "user" | "admin") || "user");

        setUser({
          uid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName || data.name || null,
          role,
        });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    console.log("[Auth] Signed in:", cred.user.email, "UID:", cred.user.uid);
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const role = isAdminEmail(email) ? "admin" : "user";
    await setDoc(doc(db, "users", cred.user.uid), {
      name, email, role, createdAt: new Date().toISOString(),
    });
  }, []);

  const googleSignIn = useCallback(async () => {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userRef = doc(db, "users", cred.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      const role = isAdminEmail(cred.user.email) ? "admin" : "user";
      await setDoc(userRef, {
        name: cred.user.displayName,
        email: cred.user.email,
        role,
        createdAt: new Date().toISOString(),
      });
    } else {
      // Update role to admin if this is the admin email
      const data = snap.data();
      if (isAdminEmail(cred.user.email) && data.role !== "admin") {
        await setDoc(userRef, { ...data, role: "admin" }, { merge: true });
      }
    }
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    await sendPasswordResetEmail(auth, email);
    console.log("[Auth] Password reset email sent to:", email);
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut(auth);
    setUser(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    login,
    signup,
    googleSignIn,
    forgotPassword,
    logout,
  };
}
