import React from "react";

interface UserProfileCardProps {
  name: string;
  role: string;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ name, role }) => {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col items-center">
      <div className="w-24 h-24 rounded-full bg-gray-300 mb-4" />
      <p className="font-semibold">{name}</p>
      <p className="text-sm text-gray-500">{role}</p>
      <button className="mt-2 px-4 py-1 border rounded text-sm">View</button>
    </div>
  );
};

export default UserProfileCard;
