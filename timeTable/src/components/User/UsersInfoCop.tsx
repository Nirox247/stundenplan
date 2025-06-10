import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import ColorPalets from '../ColorPalets';

interface UserData {
  id: string;
  name: string;
  email: string;
  role?: string;
  Info?: {
    ip?: string;
    ipv6?: string;
    country?: string;
    region?: string;
    city?: string;
  }
}

function UsersInfo () {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [Username, setUserName] = useState("");

  const changeName = () => {
    setUserName(name ?? "");

  };

  const auth = getAuth();
  const db = getFirestore();



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const userDoc = await getDocs(collection(db, 'users'));
        const currentUserDoc = userDoc.docs.find(doc => doc.id === firebaseUser.uid);
        const currentUserData = currentUserDoc?.data() as UserData | undefined;
        setRole(currentUserData?.role || null);

        if (currentUserData?.role === 'admin') {
          const allUsersSnapshot = await getDocs(collection(db, 'users'));
          const allUsers = allUsersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as Omit<UserData, 'id'>),
          }));
          setUsers(allUsers);
        }
      } else {
        setRole(null);
        setUsers([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db]);

  if (loading) return <p style={{ color: ColorPalets.textSecondary }}>Lade Daten...</p>;
  if (!user) return <p style={{ color: ColorPalets.danger }}>Bitte einloggen</p>;
  if (role !== 'admin') return <p style={{ color: ColorPalets.warning }}>Kein Zugriff — du bist kein Admin.</p>;

  return (
    <div
      style={{
        background: ColorPalets.backgroundLight,
        color: ColorPalets.textPrimary,
        borderRadius: "1rem",
        padding: "2rem",
        boxShadow: `0 4px 24px 0 ${ColorPalets.primaryDark}22`
      }}
    >
      <h2 style={{ color: ColorPalets.primaryDark, marginBottom: "1rem" }}>Alle Nutzer (Admin-Bereich)</h2>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "1.5rem",
        justifyContent: "center"
      }}>
        {users.map(u => (
          <div
            key={u.id}
            style={{
              background: ColorPalets.primaryLighter,
              color: ColorPalets.textPrimary,
              borderRadius: "0.75rem",
              minWidth: "230px",
              maxWidth: "380px",
              marginBottom: "0.5rem",
              padding: "1.2rem 1.5rem",
              boxShadow: `0 2px 12px 0 ${ColorPalets.primaryDark}22`,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start"
            }}
          >
            <div style={{ fontWeight: "bold", color: ColorPalets.textPrimary, fontSize: "1.1rem", marginBottom: "0.5rem" }}>
              {u.email}
            </div>
            <div>
                <p>{u.name}</p>
                <p>IP: {u.Info?.ip}</p>
                <p>IPv6: {u.Info?.ipv6}</p>
                <p>{u.Info?.country}-{u.Info?.region}-{u.Info?.city}</p>
              <span style={{ color: ColorPalets.textPrimary }}>ID:</span> {u.id}
            </div>
            <div>
              <span style={{ color: ColorPalets.textSecondary }}>Rolle:</span>{" "}
              <span style={{ color: u.role === "admin" ? ColorPalets.success : ColorPalets.textPrimary }}>
                {u.role || 'keine'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersInfo;