import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/UserContext";

import {
  LineStyle,
  PermIdentity,
  Storefront,
  WorkOutline,
  Report,
} from "@material-ui/icons";

function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebarWrapper">
        <h3 className="sidebarTitle">CustomCreator</h3>
        <ul className="sidebarList">
          <NavLink
            to="/"
            className={({ isActive }) =>
              "sidebarListItem" + (isActive ? " active" : "")
            }
          >
            <LineStyle className="sidebarIcon" />
            <li key="/">Dashboard</li>
          </NavLink>
          <NavLink
            to="/jobs"
            className={({ isActive }) =>
              "sidebarListItem" + (isActive ? " active" : "")
            }
          >
            <WorkOutline className="sidebarIcon" />
            <li key="/jobs">Jobs</li>
          </NavLink>
          <NavLink
            to="/materials"
            className={({ isActive }) =>
              "sidebarListItem" + (isActive ? " active" : "")
            }
          >
            <Storefront className="sidebarIcon" />
            <li key="/materials">Materials</li>
          </NavLink>
          <NavLink
            to="/reorder-requests"
            className={({ isActive }) =>
              "sidebarListItem" + (isActive ? " active" : "")
            }
          >
            <Report className="sidebarIcon" />
            <li key="/reorder-requests">Reorder-Requests</li>
          </NavLink>
          <NavLink
            to="/staff"
            className={({ isActive }) =>
              "sidebarListItem" + (isActive ? " active" : "")
            }
          >
            <PermIdentity className="sidebarIcon" />
            <li key="/staff">Staff</li>
          </NavLink>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
