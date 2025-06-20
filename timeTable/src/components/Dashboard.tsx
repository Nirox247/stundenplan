import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsersFromFirestore } from '../firebase';
import ColorPalets from './ColorPalets'; 
import copy from './scripts/Copy'
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const Dashboard: React.FC = () => {
  const { user, role } = useAuth();
  const [users, setUsers] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const Copy = <span className="material-symbols-outlined"
  style={{ fontSize: '1.1rem', verticalAlign: 'middle', marginLeft: '0' }}
  > content_copy</span>

  useEffect(() => {
    console.log("Aktueller Benutzer:", user);
    console.log("Rolle:", role);

    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsersFromFirestore();
        console.log("Fetched users:", fetchedUsers);

        if (Array.isArray(fetchedUsers)) {
          setUsers(fetchedUsers);
        } else {
          console.warn("Erwartetes Array von Benutzern, aber erhalten:", fetchedUsers);
          setUsers([]);
        }
      } catch (error) {
        console.error("Fehler beim Laden der Benutzer:", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Lade Benutzerdaten...</p>;
  if (!user) return <p>Du bist nicht angemeldet.</p>;
  if (!role) return <p>Keine Rolle zugewiesen.</p>;

  return (
    <div className='w-10/12 mx-auto my-8 border-2 border rounded-xl'
    style={{ 
      backgroundColor: ColorPalets.bgMainDark,
       color: ColorPalets.textSecondary,
       borderColor: ColorPalets.primaryLight,

       padding: '1rem' }}>
      <h1>Dashboard ({role})</h1>
      
      {Array.isArray(users) && users.length > 0 ? (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" >
          {users.map((u) => (
            <div 
            style={{
              backgroundColor: ColorPalets.primary,
              color: ColorPalets.textSecondary,
              borderColor: ColorPalets.primaryLight,
            }}
            className="w-10/12 mx-auto my-8 border-2 border rounded-lg p-5">
              <li key={u.id}>
                <p>{u.name}</p>
                <p  className='hover:cursor-pointer'
                  onClick={() => {
                  copy({ text: u.email });
                }
              
              }>{u.email} {Copy}</p>
                <hr 
                style={{
                  backgroundColor: ColorPalets.bgMainLight,
                  color: ColorPalets.textPrimary,
                  borderColor: ColorPalets.primaryLighter,
                }}
                className="w-10/12 mx-auto my-8 border-t-2 "/>
                
                <ul>
                  <li>Role: {u.role}</li>
                  <li  className='hover:cursor-pointer'
                  onClick={() => {
                  copy({ text: u.Info?.ip });
                }
              
              }>IP: {u.Info?.ip} {Copy}</li>
                  <li  className='hover:cursor-pointer'
                  onClick={() => {
                  copy({ text: u.Info?.ipv6 });
                }
              
              }>IPv6: {u.Info?.ipv6}{Copy}</li>
                  <li>{u.Info?.country}-{u.Info?.region}-{u.Info?.city}</li>
                  <li  className='hover:cursor-pointer'
                  onClick={() => {
                  copy({ text: u.id });
                }
              
              }>
                    id: {u.id}
                    {Copy}
                  </li>
                </ul>
                
              </li>
            </div>
          ))}
        </ul>
        
      ) : (
        <p>Keine Benutzer gefunden.</p>
      )}
    </div>
  );
};

export default Dashboard;
