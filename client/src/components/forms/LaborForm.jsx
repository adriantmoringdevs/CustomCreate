import { useState } from "react";
import "./JobForm.css";
// import { useAuth } from "../context/UserContext";

function LaborForm({ closeForm, location, addLaborEntry }) {
  const [hours, setHours] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [error, setError] = useState("");
  // const { user } = useAuth();

  const pathParts = location.pathname.split("/");
  const jobID = pathParts[pathParts.length - 1];

  function handleSubmit(e) {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setError("");
    const laborLog = {
      job_id: jobID,
      hours: hours,
      hourly_rate: hourlyRate,
    };
    fetch("http://localhost:5000/api/labor_entries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(laborLog),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("New Labor Log post failed");
      })
      .then((data) => {
        addLaborEntry(data);
        closeForm();
      })
      .catch((err) => setError(err.message));
  }

  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        LaborForm
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Hours"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Hourly Rate"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            Save Labor Entry
          </button>
        </form>
      </div>
    </div>
  );
}

export default LaborForm;
