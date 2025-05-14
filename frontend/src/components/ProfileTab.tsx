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
    if (!profile) return;

    await fetchWithToken("/me/profile", "POST", {
      full_name: fullName,
      team_id: profile.team_id,
      role: profile.role,
    });

    alert("Profile updated");
  };

  return (
    <div>
      <h3 className="h5 fw-bold mb-3">Your Profile</h3>

      <div className="mb-2">
        <strong>UUID:</strong> <span>{profile?.id}</span>
      </div>
      <div className="mb-2">
        <strong>Role:</strong> <span className="text-capitalize">{profile?.role}</span>
      </div>
      <div className="mb-4">
        <strong>Team:</strong> <span>{profile?.team_id}</span>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleUpdate();
        }}
        className="row g-2 align-items-center"
      >
        <div className="col-sm-8">
          <label htmlFor="fullName" className="form-label">
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="form-control"
            placeholder="Enter your name"
          />
        </div>
        <div className="col-sm-4 d-flex align-items-end">
          <button type="submit" className="btn btn-primary w-100">
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileTab;
