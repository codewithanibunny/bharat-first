"use client";

import { useState, useEffect } from "react";
import { Users, Loader2, Trash2, Shield } from "lucide-react";
import { THEMES } from "@/constants/theme";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
}

export default function UsersAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        fetchUsers();
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating role");
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (res.ok) {
        fetchUsers();
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    }
  };

  return (
    <div className="max-w-6xl">
      <div className="flex justify-between items-center mb-8 border-b border-[#2E2E2E] pb-4">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white flex items-center">
          <Users size={28} className="mr-3 text-[#FF6B00]" /> Operatives
        </h1>
      </div>

      <div className="bg-[#1A1A1A] border border-[#2E2E2E] rounded p-6">
        {loading ? (
          <div className="flex justify-center p-12 text-gray-500"><Loader2 className="animate-spin" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-widest text-gray-500 border-b border-[#2E2E2E]">
                  <th className="pb-3 px-4">Name / Email</th>
                  <th className="pb-3 px-4">Role</th>
                  <th className="pb-3 px-4">Joined Date</th>
                  <th className="pb-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2E2E2E]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-[#202020] transition-colors group">
                    <td className="py-4 px-4">
                      <div className="font-bold text-white mb-1">{user.name || "Unknown Operative"}</div>
                      <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center">
                        <Shield size={14} className="mr-2 text-[#FF6B00]" />
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-[#0D0D0D] border border-[#2E2E2E] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#FF6B00] uppercase font-bold"
                        >
                          <option value="GUEST">GUEST</option>
                          <option value="EDITOR">EDITOR</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-gray-400 font-mono">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded hover:bg-[#2E2E2E]"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-gray-500 font-mono text-xs uppercase">
                      NO OPERATIVES FOUND.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
