import { useEffect, useState } from "react";
import { getAdminCustomers } from "../../api/admin.js";

const thClass = "text-left px-4 py-3 font-semibold text-gray-600 text-sm";
const tdClass = "px-4 py-3 text-sm";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    getAdminCustomers({ signal: controller.signal })
      .then(setCustomers)
      .catch((err) => { if (err?.code !== "ERR_CANCELED") setError("Failed to load customers."); })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  if (loading) return <p className="text-center text-gray-500 py-10">Loading customers...</p>;
  if (error) return <p className="text-center text-red-600 py-10">{error}</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-5">Customers</h2>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className={thClass}>Name</th>
              <th className={thClass}>Email</th>
              <th className={thClass}>Phone</th>
              <th className={thClass}>Address</th>
              <th className={thClass}>State</th>
              <th className={thClass}>Pincode</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className={`${tdClass} font-medium`}>{c.name}</td>
                <td className={tdClass}>{c.email}</td>
                <td className={tdClass}>{c.phone}</td>
                <td className={`${tdClass} max-w-[180px] truncate`}>{c.address}</td>
                <td className={tdClass}>{c.state}</td>
                <td className={tdClass}>{c.pincode}</td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-400">No customers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
