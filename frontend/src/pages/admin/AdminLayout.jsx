import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AdminLayout() {
  const { logout, username } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="logo">🍬 Lalitha Surya Sweets</div>

        <nav>
          <NavLink to="/admin/dashboard">📊 Dashboard</NavLink>
          <NavLink to="/admin/orders">📦 Orders</NavLink>
          <NavLink to="/admin/products">🍬 Products</NavLink>
          <NavLink to="/admin/customers">👤 Customers</NavLink>
        </nav>

        <button type="button" className="sidebar-link logout-btn" onClick={handleLogout}>
          🚪 Logout
        </button>
      </aside>

      <main className="main-content">
        <div className="topbar">
          <span>Admin Panel{username ? ` — ${username}` : ""}</span>
        </div>

        <section className="page">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
