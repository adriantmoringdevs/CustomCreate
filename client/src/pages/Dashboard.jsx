import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LowStockAlert from "../components/LowStockAlert";
import "../styles/Dashboard.css";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/jobs", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load jobs");
        return res.json();
      })
      .then((data) => setJobs(data))
      .catch((err) => {
        console.error("Error loading dashboard jobs:", err);
        setError("Couldn't load jobs.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/materials", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load materials");
        return res.json();
      })
      .then((data) => setMaterials(data))
      .catch((err) => {
        console.error("Error loading dashboard materials", err);
        setError("Couldn't load materials");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/reorder_requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load request amount");
        return res.json();
      })
      .then((data) => setRequests(data))
      .catch((err) => {
        console.error("Error loading Request Amount", err);
        setError("Couldn't load Request Amount");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeJobs = jobs.filter(
    (job) => job.status === "QUOTED" || job.status === "IN_PROGRESS",
  );

  const lowMaterials = materials.filter(
    (material) => material.low_stock === true,
  );

  const pendingRequests = requests.filter(
    (request) => request.status === "PENDING",
  );

  if (isLoading) return <div className="dashboard-container">Loading...</div>;
  if (error) return <div className="dashboard-container">{error}</div>;

  return (
    <div className="dashboard-container">
      <h1>Active Jobs</h1>

      {activeJobs.length === 0 ? (
        <p>No active jobs right now.</p>
      ) : (
        <div className="job-card-grid">
          {activeJobs.map((job) => (
            <div
              key={job.id}
              className={`job-card job-card-${job.status.toLowerCase().replace("_", "-")}`}
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="job-card-header">
                <span className="job-card-name">{job.name}</span>
                <span
                  className={`badge badge-${job.status.toLowerCase().replace("_", "-")}`}
                >
                  {job.status.replace("_", " ")}
                </span>
              </div>
              <div className="job-card-body">
                {job.customer && (
                  <p className="job-card-client">{job.customer}</p>
                )}
                {/* {job.due_date && (
                  <p className="job-card-due">Due: {job.due_date}</p>
                )} */}
              </div>
            </div>
          ))}
        </div>
      )}

      {lowMaterials.length !== 0 && (
        <LowStockAlert lowMaterials={lowMaterials} />
      )}
      <div>
        Reorder Requests Waiting:
        {requests ? pendingRequests.length : 0}
      </div>
    </div>
  );
}

export default Dashboard;
