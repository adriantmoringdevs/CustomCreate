import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserContext";

function TopBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="topbar">
      <div className="topbarWrapper">
        <span className="logo">Custom Creator</span>
        <div className="topRight">
          {user && (
            <span className="topbarWelcome">Welcome, {user.username}!</span>
          )}
          <button className="topbarLogoutBtn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default TopBar;
