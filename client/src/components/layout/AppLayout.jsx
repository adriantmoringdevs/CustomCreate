import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "./layout.css";

function AppLayout() {
    return (
        <div className="appShell">
            <TopBar />
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