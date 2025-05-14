import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";

const ProfileTab: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetchWithToken("/me/profile");
      setProfile(res);
      setFullName(res.full_name || "");
    };
    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    await fetchWithToken("/me/profile", "POST", { full_name: fullName });
    alert("Profile updated");
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">Your Profile</h3>
      <p>
        <strong>UUID:</strong> {profile?.id}
      </p>
      <p>
        <strong>Role:</strong> {profile?.role}
      </p>
      <p>
        <strong>Team:</strong> {profile?.team_id}
      </p>
      <div className="mt-4">
        <label className="block mb-2">Full Name</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="border px-2 py-1 rounded w-full"
        />
        <button
          onClick={handleUpdate}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default ProfileTab;
