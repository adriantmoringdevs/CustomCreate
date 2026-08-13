import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AvailableLotsTable from "../components/tables/AvailableLotsTable.jsx";
import JobMaterialsTable from "../components/tables/JobMaterialsTable.jsx";
import JobMaterialsForm from "../components/forms/JobMaterialsForm.jsx";
import LaborTable from "../components/tables/LaborTable.jsx";
import LaborForm from "../components/forms/LaborForm.jsx";
import EditLaborForm from "../components/forms/EditLaborForm.jsx";

function JobById() {
  const [jobMaterialUsages, setJobMaterialUsage] = useState([]);
  const [availableLots, setAvailableLots] = useState([]);
  const [laborEntries, setLaborEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [materialsFormOpen, setMaterialsFormOpen] = useState(false);
  const [laborFormOpen, setLaborFormOpen] = useState(false);
  const [laborToEdit, setLaborToEdit] = useState(null);
  const [editLaborFormOpen, setEditLaborFormOpen] = useState(false);
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

  function handleEditLabor(idx) {
    setLaborToEdit(idx);
    setEditLaborFormOpen(true);
  }

  function saveEditedLabor(entry) {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/labor_entries", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(entry),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`Failed to update entry ${entry.id}`);
      })
      .then((data) => {
        setLaborEntries((prevEntries) =>
          prevEntries.map((entry) => (entry.id === data.id ? data : entry)),
        );
      });
  }

  return (
    <div>
      <LaborTable laborEntries={laborEntries} editLabor={handleEditLabor} />
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
      <div>
        {editLaborFormOpen && (
          <EditLaborForm
            saveEditedLabor={saveEditedLabor}
            closeForm={() => {
              setEditLaborFormOpen(false);
            }}
            laborToEdit={laborToEdit !== null && laborEntries[laborToEdit]}
          />
        )}
      </div>
    </div>
  );
}

export default JobById;
