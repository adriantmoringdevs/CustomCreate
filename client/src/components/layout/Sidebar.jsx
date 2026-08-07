import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/UserContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/jobs", label: "Jobs" },
  { to: "/materials", label: "Inventory" },
  { to: "/reorder-requests", label: "Reorder Requests" },
  { to: "/staff", label: "Staff" },
];

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebarWrapper">
        <h3 className="sidebarTitle">CustomCreator</h3>
        <ul className="sidebarList">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  "sidebarListItem" + (isActive ? "active" : "")
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
