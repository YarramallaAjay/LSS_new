import { useEffect, useRef, useState } from "react";
import { Chart, BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { getDashboardStats } from "../../api/admin.js";

// Register only the chart components we need (tree-shakeable)
Chart.register(BarElement, BarController, CategoryScale, LinearScale, Tooltip, Legend);

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const KPI_CARDS = [
  { key: "totalOrders", label: "Total Orders", icon: "📦" },
  { key: "totalRevenue", label: "Total Revenue", prefix: "₹" },
  { key: "pendingOrders", label: "Pending Orders", icon: "⏳" },
  { key: "todayOrders", label: "Today's Orders", icon: "📅" },
  { key: "todayRevenue", label: "Today's Revenue", prefix: "₹" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  const loadStats = () => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getDashboardStats({ signal: controller.signal })
      .then(setStats)
      .catch((err) => {
        if (err?.code !== "ERR_CANCELED") {
          console.error(err);
          setError(err.response?.data?.message || "Couldn't load dashboard stats. Please try again.");
        }
      })
      .finally(() => setLoading(false));
    return controller;
  };

  useEffect(() => {
    const controller = loadStats();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!stats || !canvasRef.current) return;

    chartRef.current?.destroy();

    chartRef.current = new Chart(canvasRef.current, {
      type: "bar",
      data: {
        labels: MONTH_LABELS,
        datasets: [{ label: "Orders", data: stats.monthlyOrders, borderWidth: 1, backgroundColor: "rgba(244,180,0,0.7)", borderColor: "#f4b400" }],
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } },
    });

    return () => chartRef.current?.destroy();
  }, [stats]);

  if (loading) {
    return <p className="text-center text-gray-500 py-12">Loading dashboard...</p>;
  }

  if (error || !stats) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 font-medium mb-4">{error || "No dashboard data available."}</p>
        <button
          type="button"
          onClick={loadStats}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
        {KPI_CARDS.map(({ key, label, prefix = "", icon = "" }) => (
          <div key={key} className="bg-white rounded-2xl shadow-sm p-5 border border-gray-100">
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-bold text-gray-800">
              {prefix}{icon}{stats[key]}
            </p>
          </div>
        ))}
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Top products */}
      <h2 className="text-lg font-bold mb-4">🔥 Top Selling Products</h2>
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Product</th>
              <th className="text-left px-5 py-3 font-semibold text-gray-600">Total Sold</th>
            </tr>
          </thead>
          <tbody>
            {stats.topProducts.map((p) => (
              <tr key={p.name} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">{p.name}</td>
                <td className="px-5 py-3 font-semibold">{p.unitsSold}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-6 border-gray-200" />

      {/* Chart */}
      <h2 className="text-lg font-bold mb-4">📈 Monthly Orders</h2>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}
