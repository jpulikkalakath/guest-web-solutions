import { useCallback } from "react";
import {
  collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc, Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message?: string;
  status: "new" | "read" | "archived";
  createdAt?: string;
}

export interface PaymentRecord {
  id?: string;
  userId: string;
  userEmail: string;
  planName: string;
  amount: string;
  paymentMethod: string;
  status: "pending" | "completed" | "failed" | "refunded";
  bankReference?: string;
  createdAt?: string;
}

export interface UserRecord {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  createdAt?: string;
}

export function useFirestore() {
  const submitContact = useCallback(async (data: { name: string; email: string; phone?: string; service?: string; message?: string }) => {
    console.log("[Firestore] Submitting contact:", data);
    try {
      const docRef = await addDoc(collection(db, "contactSubmissions"), {
        ...data, status: "new", createdAt: Timestamp.now(),
      });
      console.log("[Firestore] Contact saved with ID:", docRef.id);
      return docRef;
    } catch (err) {
      console.error("[Firestore] Contact submit FAILED:", err);
      throw err;
    }
  }, []);

  const createPayment = useCallback(async (data: { userId: string; userEmail: string; planName: string; amount: string; paymentMethod: string; bankReference?: string }) => {
    console.log("[Firestore] Creating payment:", data);
    try {
      const docRef = await addDoc(collection(db, "payments"), {
        ...data, status: "pending", createdAt: Timestamp.now(),
      });
      console.log("[Firestore] Payment saved with ID:", docRef.id);
      return docRef;
    } catch (err) {
      console.error("[Firestore] Payment create FAILED:", err);
      throw err;
    }
  }, []);

  const getContacts = useCallback(async (): Promise<ContactSubmission[]> => {
    console.log("[Firestore] Fetching contacts...");
    try {
      const snap = await getDocs(query(collection(db, "contactSubmissions"), orderBy("createdAt", "desc")));
      console.log("[Firestore] Contacts fetched:", snap.docs.length, "records");
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id, name: data.name || "", email: data.email || "", phone: data.phone || "",
          service: data.service || "", message: data.message || "", status: data.status || "new",
          createdAt: data.createdAt?.toDate?.().toISOString() || "",
        };
      });
    } catch (err) {
      console.error("[Firestore] Get contacts FAILED:", err);
      throw err;
    }
  }, []);

  const getPayments = useCallback(async (): Promise<PaymentRecord[]> => {
    console.log("[Firestore] Fetching payments...");
    try {
      const snap = await getDocs(query(collection(db, "payments"), orderBy("createdAt", "desc")));
      console.log("[Firestore] Payments fetched:", snap.docs.length, "records");
      return snap.docs.map(d => {
        const data = d.data();
        return {
          id: d.id, userId: data.userId || "", userEmail: data.userEmail || "", planName: data.planName || "",
          amount: data.amount || "", paymentMethod: data.paymentMethod || "", status: data.status || "pending",
          bankReference: data.bankReference || "", createdAt: data.createdAt?.toDate?.().toISOString() || "",
        };
      });
    } catch (err) {
      console.error("[Firestore] Get payments FAILED:", err);
      throw err;
    }
  }, []);

  const getUsers = useCallback(async (): Promise<UserRecord[]> => {
    console.log("[Firestore] Fetching users...");
    try {
      const snap = await getDocs(collection(db, "users"));
      console.log("[Firestore] Users fetched:", snap.docs.length, "records");
      return snap.docs.map(d => ({
        id: d.id, name: d.data().name || "", email: d.data().email || "",
        role: d.data().role || "user", createdAt: d.data().createdAt || "",
      }));
    } catch (err) {
      console.error("[Firestore] Get users FAILED:", err);
      throw err;
    }
  }, []);

  const updateContactStatus = useCallback(async (id: string, status: string) => {
    await updateDoc(doc(db, "contactSubmissions", id), { status });
  }, []);

  const updatePaymentStatus = useCallback(async (id: string, status: string) => {
    await updateDoc(doc(db, "payments", id), { status });
  }, []);

  const deleteContact = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "contactSubmissions", id));
  }, []);

  const deletePayment = useCallback(async (id: string) => {
    await deleteDoc(doc(db, "payments", id));
  }, []);

  return { submitContact, createPayment, getContacts, getPayments, getUsers, updateContactStatus, updatePaymentStatus, deleteContact, deletePayment };
}
