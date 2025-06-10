import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // User-Typ importieren
import type { User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // doc und getDoc importieren

// Erweitere den User-Typ um customClaims
interface CustomUser extends User {
  customClaims?: {
    role?: string; // Angenommen, du speicherst die Rolle als "role" Claim
    // ... andere Claims, falls vorhanden (z.B. admin: boolean)
  };
}

interface PermissionsContextType {
  role: string | null;
  name: string | null;
  loading: boolean;
  isAdmin: boolean; // Füge isAdmin hinzu, falls du einen spezifischen Admin-Claim hast
  user: CustomUser | null; // Optional: den aktuellen Firebase-Benutzer zur Verfügung stellen
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(
  undefined
);

interface PermissionsProviderProps {
  children: ReactNode;
}

export const PermissionsProvider: React.FC<PermissionsProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<CustomUser | null>(null); // Speichere den CustomUser hier
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // Neuer State für isAdmin
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const db = getFirestore();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Beginne das Laden, wenn der Auth-Status sich ändert
      if (firebaseUser) {
        let currentRole: string | null = null;
        let currentName: string | null = null;
        let currentIsAdmin: boolean = false;
        let claims: any = undefined;

        try {
          // --- 1. Custom Claims für die Rolle abrufen (sicher!) ---
          // forceRefresh = true ist wichtig, um die neuesten Claims zu erhalten
          const idTokenResult = await firebaseUser.getIdTokenResult(true);
          claims = idTokenResult.claims;

          currentRole = (claims.role as string) || null; // Annahme: Rolle ist im "role"-Claim
          currentIsAdmin = (claims.admin === true) || false; // Annahme: Admin-Status ist im "admin"-Claim

          // --- 2. Spezifische Benutzerdaten aus Firestore laden (für Name oder andere Profilinfos) ---
          // NUR das eigene Dokument laden, keine ganze Sammlung!
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnapshot = await getDoc(userDocRef);

          if (userDocSnapshot.exists()) {
            const userDataFromFirestore = userDocSnapshot.data() as
              | { name?: string } // Hier nur das, was nicht über Claims kommt
              | undefined;
            currentName = userDataFromFirestore?.name || null;
          } else {
            console.log('Benutzerdokument nicht gefunden für UID:', firebaseUser.uid);
            // setRole und setName werden hier nicht benötigt, da sie von Claims/Default kommen
          }

        } catch (error) {
          console.error('Fehler beim Laden der Benutzerdaten (Claims/Firestore):', error);
          // Setze alles auf null/false bei Fehlern
          currentRole = null;
          currentName = null;
          currentIsAdmin = false;
        } finally {
          // States aktualisieren
          setUser({ ...firebaseUser, customClaims: claims as any }); // Setze den Benutzer mit den Claims
          setRole(currentRole);
          setName(currentName);
          setIsAdmin(currentIsAdmin);
          setLoading(false); // Laden beendet
        }
      } else {
        // Benutzer ist abgemeldet
        setUser(null);
        setRole(null);
        setName(null);
        setIsAdmin(false);
        setLoading(false); // Laden beendet
      }
    });

    return () => unsubscribe();
  }, []); // Keine Abhängigkeiten, nur einmal beim Mounten ausführen

  const contextValue: PermissionsContextType = {
    user,
    role,
    name,
    loading,
    isAdmin,
  };

  return (
    <PermissionsContext.Provider value={contextValue}>
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error(
      'usePermissions muss innerhalb eines PermissionsProvider verwendet werden'
    );
  }
  return context;
};