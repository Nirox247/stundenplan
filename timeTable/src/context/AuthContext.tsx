import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

type Role = "user" | "teacher" | "manager" | "admin";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const docRef = doc(db, "users", firebaseUser.uid); // ✅ korrekt: "users"
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            const userRole = data.role as Role | undefined;
            setRole(userRole ?? "user"); // Fallback: "user"
          } else {
            setRole("user"); // Benutzer ist registriert, aber kein Rollen-Eintrag vorhanden
          }
        } catch (error) {
          console.error("Fehler beim Abrufen der Benutzerrolle:", error);
          setRole("user"); // Fallback bei Fehler
        }
      } else {
        setRole(null); // Kein Nutzer eingeloggt
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
