import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';

function LogoutBtn() {

      const [user, setUser] = useState<User | null>(null);
      const auth = getAuth();
    
        const handleLogout = async () => {
        await signOut(auth);
      };
      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
        });
        return () => unsubscribe();
      }, [auth]);

      return (
        <div>
            <button className='bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded'
            onClick={handleLogout}>Logout from {user?.email}</button>
        </div>
      );
}
export default LogoutBtn;