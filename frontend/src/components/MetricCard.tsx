import React from "react";

type Props = {
  label: string;
  value: string | number;
};

const MetricCard = ({ label, value }: Props) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

export default MetricCard;