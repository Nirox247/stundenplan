import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

const AdminPage = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    const usersSnapshot = await getDocs(collection(db, "users"));
    const userList = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    setUsers(userList);
  };

  const updateRole = async (userId: string, role: string) => {
    await updateDoc(doc(db, "users", userId), { role });
    fetchUsers(); // Refresh
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Rollenverwaltung</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th>Email</th>
            <th>Aktuelle Rolle</th>
            <th>Ändern zu</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => updateRole(user.id, e.target.value)}
                  className="border p-1"
                >
                  <option value="user">user</option>
                  <option value="teacher">teacher</option>
                  <option value="manager">manager</option>
                  <option value="admin">admin</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
