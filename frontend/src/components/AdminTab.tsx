import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";

const AdminTab: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetchWithToken("/admin/getall");
      setUsers(res.users);
    };
    fetchUsers();
  }, []);

  const fetchDetail = async (uuid: string) => {
    const res = await fetchWithToken(`/admin/${uuid}`);
    setSelected(res);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">Team Users</h3>
      <ul className="mb-4">
        {users.map((u) => (
          <li key={u.id}>
            <button
              onClick={() => fetchDetail(u.id)}
              className="text-blue-600 underline"
            >
              {u.full_name || u.id}
            </button>
          </li>
        ))}
      </ul>
      {selected && (
        <div>
          <h4 className="font-semibold">Selected User:</h4>
          <pre className="bg-gray-100 p-2 rounded text-sm">
            {JSON.stringify(selected, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default AdminTab;
