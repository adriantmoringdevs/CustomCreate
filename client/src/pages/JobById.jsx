import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import AvailableLotsTable from "../components/tables/AvailableLotsTable.jsx";
import JobMaterialsTable from "../components/tables/JobMaterialsTable.jsx";
import JobMaterialsForm from "../components/forms/JobMaterialsForm.jsx";
import LaborTable from "../components/tables/LaborTable.jsx";
import LaborForm from "../components/forms/LaborForm.jsx";
import EditLaborForm from "../components/forms/EditLaborForm.jsx";
import DeleteLaborForm from "../components/forms/DeleteLaborForm.jsx";

function JobById() {
  const [job, setJob] = useState(null);
  const [jobMaterialUsages, setJobMaterialUsage] = useState([]);
  const [availableLots, setAvailableLots] = useState([]);
  const [laborEntries, setLaborEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [materialsFormOpen, setMaterialsFormOpen] = useState(false);
  const [laborFormOpen, setLaborFormOpen] = useState(false);
  const [laborToEdit, setLaborToEdit] = useState(null);
  const [editLaborFormOpen, setEditLaborFormOpen] = useState(false);
  const [laborToDelete, setLaborToDelete] = useState(null);
  const [deleteLaborFormOpen, setDeleteLaborFormOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api${location.pathname}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => {
        setJob(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

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

  function handleDeleteLaborSelect(idx) {
    setLaborToDelete(idx);
    setDeleteLaborFormOpen(true);
  }

  function handleDeleteLabor(entryToDelete) {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/labor_entries", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(entryToDelete),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Labor Entry deletion failed");
      })
      .then(() => {
        setLaborEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id != entryToDelete.id),
        );
      })
      .catch((err) => {
        console.error("Error deleting Entry:", err);
      });
  }

  return (
    <div className="page-stack">
      {job && (
        <div className="job-header">
          <h1>Job Details</h1>
          <div className="job-header-meta">
            <span>
              <span className="job-header-label">Job</span> {job.name}
            </span>
            <span>
              <span className="job-header-label">Customer</span> {job.customer}
            </span>
          </div>
        </div>
      )}
      <LaborTable
        laborEntries={laborEntries}
        editLabor={handleEditLabor}
        deleteLabor={handleDeleteLaborSelect}
      />
      <JobMaterialsTable materials={jobMaterialUsages} />
      <AvailableLotsTable
        lots={availableLots}
        addUsage={addUsage}
        location={location}
      />
      <div className="page-actions">
        <button className="btn" onClick={() => setMaterialsFormOpen(true)}>
          Order New Job Materials
        </button>
        <button className="btn" onClick={() => setLaborFormOpen(true)}>
          Log New Labor Entry
        </button>
      </div>

      {materialsFormOpen && (
        <JobMaterialsForm
          closeForm={() => {
            setMaterialsFormOpen(false);
          }}
          addUsage={addUsage}
          location={location}
        />
      )}
      {laborFormOpen && (
        <LaborForm
          closeForm={() => {
            setLaborFormOpen(false);
          }}
          location={location}
          addLaborEntry={addLaborEntry}
        />
      )}
      {editLaborFormOpen && (
        <EditLaborForm
          saveEditedLabor={saveEditedLabor}
          closeForm={() => {
            setEditLaborFormOpen(false);
          }}
          laborToEdit={laborToEdit !== null && laborEntries[laborToEdit]}
        />
      )}
      {deleteLaborFormOpen && (
        <DeleteLaborForm
          deleteLabor={handleDeleteLabor}
          laborToDelete={laborToDelete !== null && laborEntries[laborToDelete]}
          closeForm={() => {
            setDeleteLaborFormOpen(false);
          }}
        />
      )}
    </div>
  );
}

export default JobById;
