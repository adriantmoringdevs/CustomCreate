import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AvailableLotsTable from "../components/tables/AvailableLotsTable.jsx";
import JobMaterialsTable from "../components/tables/JobMaterialsTable.jsx";
import JobMaterialsForm from "../components/forms/JobMaterialsForm.jsx";

function JobById() {
  const [jobMaterialUsages, setJobMaterialUsage] = useState([]);
  const [availableLots, setAvailableLots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [materialsFormOpen, setMaterialsFormOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api${location.pathname}/job_material_usages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setJobMaterialUsage(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/materials/available", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setAvailableLots(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function addUsage(newUse) {
    setJobMaterialUsage((prevUses) => [...prevUses, newUse]);
  }

  return (
    <div>
      <JobMaterialsTable materials={jobMaterialUsages} />
      <div>
        <AvailableLotsTable lots={availableLots} />
      </div>
      <div>
        <button className="btn" onClick={() => setMaterialsFormOpen(true)}>
          Order New Job Materials
        </button>
        {materialsFormOpen && (
          <JobMaterialsForm
            closeForm={() => {
              setMaterialsFormOpen(false);
            }}
            addUsage={addUsage}
            location={location}
          />
        )}
      </div>
    </div>
  );
}

export default JobById;
