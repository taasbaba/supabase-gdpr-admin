import React, { useEffect, useState } from "react";
import { fetchWithToken } from "../lib/apiClient";

const TokenTab: React.FC = () => {
  const [payload, setPayload] = useState<any>(null);

  useEffect(() => {
    const fetchTokenInfo = async () => {
      const res = await fetchWithToken("/me/full-token");
      setPayload(res);
    };
    fetchTokenInfo();
  }, []);

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-2">Decoded Token Payload</h3>
      <pre className="bg-gray-100 p-4 rounded text-sm">
        {JSON.stringify(payload, null, 2)}
      </pre>
    </div>
  );
};

export default TokenTab;
