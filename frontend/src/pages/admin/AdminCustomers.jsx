import { useEffect, useState } from "react";
import { getAdminCustomers } from "../../api/admin.js";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAdminCustomers()
      .then(setCustomers)
      .catch(() => setError("Failed to load customers."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="page-loading">Loading customers...</p>;
  if (error) return <p className="page-error">{error}</p>;

  return (
    <div>
      <h2>Customers</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
            <th>State</th>
            <th>Pincode</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.phone}</td>
              <td>{c.address}</td>
              <td>{c.state}</td>
              <td>{c.pincode}</td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: "center" }}>
                No customers yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
