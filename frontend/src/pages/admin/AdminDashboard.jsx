import { useEffect, useRef, useState } from "react";
import { getDashboardStats } from "../../api/admin.js";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    getDashboardStats()
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!stats || !canvasRef.current || !window.Chart) return;

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    chartRef.current = new window.Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: MONTH_LABELS,
        datasets: [
          {
            label: "Orders",
            data: stats.monthlyOrders,
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: { y: { beginAtZero: true } },
      },
    });

    return () => chartRef.current?.destroy();
  }, [stats]);

  if (loading) {
    return <p className="page-loading">Loading dashboard...</p>;
  }

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="grid">
        <div className="card">
          <h3>Total Orders</h3>
          <h2>{stats.totalOrders}</h2>
        </div>
        <div className="card">
          <h3>Total Revenue</h3>
          <h2>₹{stats.totalRevenue}</h2>
        </div>
        <div className="card">
          <h3>Pending Orders</h3>
          <h2>{stats.pendingOrders}</h2>
        </div>
        <div className="card">
          <h3>Today's Orders</h3>
          <h2>{stats.todayOrders}</h2>
        </div>
        <div className="card">
          <h3>Today's Revenue</h3>
          <h2>₹{stats.todayRevenue}</h2>
        </div>
      </div>

      <hr />

      <h2>🔥 Top Selling Products</h2>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Product</th>
            <th>Total Sold</th>
          </tr>
        </thead>
        <tbody>
          {stats.topProducts.map((p) => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.unitsSold}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2>📈 Monthly Orders</h2>
      <canvas ref={canvasRef}></canvas>
    </div>
  );
}
