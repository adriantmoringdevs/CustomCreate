import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [materials, setMaterials] = useState([]);
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
        if (!res.ok) throw new Error("Failed to load materials:");
        return res.json();
      })
      .then((data) => setMaterials(data))
      .catch((err) => {
        console.error("Error loading dashobard materials:", err);
        setError("Couldn't load materials");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const activeJobs = jobs.filter(
    (job) => job.status === "QUOTED" || job.status === "IN_PROGRESS",
  );

  const lowMaterials = materials.filter(
    (material) => material.low_stock === true,
  );

  console.log(lowMaterials);
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
                {job.client_name && (
                  <p className="job-card-client">{job.client_name}</p>
                )}
                {job.due_date && (
                  <p className="job-card-due">Due: {job.due_date}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div>
        {lowMaterials.length !== 0 && (
          lowMaterials.map((material) => (
            <div 
            key={material.id}>
              Low Material Alerts
              <div className="low-material-card-body">
                <p className="low-material-card-name">Name: {material.name}</p>
                <p className="low-material-sku">SKU #: {material.sku}</p>
                <p className="low-material-reorder-point">Reorder Point: {material.reorder_point}</p>
                <p className="low-material-total_quantity">Total Quantity: {material.total_quantity}</p>
              </div>
              </div>
          ))
        ) }
      </div>
    </div>
  );
}

export default Dashboard;
