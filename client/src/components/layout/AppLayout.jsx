import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
// import Topbar from "./Topbar";
import "./layout.css";

function AppLayout() {
    return (
        <div className="appShell">
            {/* <Topbar /> */}
            <div className="appBody">
                <Sidebar />
                <main className="appContent">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AppLayout;