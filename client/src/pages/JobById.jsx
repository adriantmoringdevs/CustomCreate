import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AvailableLotsTable from "../components/tables/AvailableLotsTable.jsx";
import JobMaterialsTable from "../components/tables/JobMaterialsTable.jsx";
import JobMaterialsForm from "../components/forms/JobMaterialsForm.jsx";
import LaborTable from "../components/tables/LaborTable.jsx";
import LaborForm from "../components/forms/LaborForm.jsx";

function JobById() {
  const [jobMaterialUsages, setJobMaterialUsage] = useState([]);
  const [availableLots, setAvailableLots] = useState([]);
  const [laborEntries, setLaborEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [materialsFormOpen, setMaterialsFormOpen] = useState(false);
  const [laborFormOpen, setLaborFormOpen] = useState(false);
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api${location.pathname}/labor_by_job`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setLaborEntries(data);
      })
      .finally(() => setIsLoading(false));
  }, [location.pathname]);

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
  }, [jobMaterialUsages]);

  function addUsage(newUse) {
    setJobMaterialUsage((prevUses) => [...prevUses, newUse]);
  }

  function addLaborEntry(newEntry) {
    setLaborEntries((prevEntries) => [...prevEntries, newEntry]);
  }

  return (
    <div>
      <LaborTable laborEntries={laborEntries} />
      <JobMaterialsTable materials={jobMaterialUsages} />
      <div>
        <AvailableLotsTable
          lots={availableLots}
          addUsage={addUsage}
          location={location}
        />
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
      <div>
        <button className="btn" onClick={() => setLaborFormOpen(true)}>
          Log New Labor Entry
        </button>
        {laborFormOpen && (
          <LaborForm
            closeForm={() => {
              setLaborFormOpen(false);
            }}
            location={location}
            addLaborEntry={addLaborEntry}
          />
        )}
      </div>
    </div>
  );
}

export default JobById;
