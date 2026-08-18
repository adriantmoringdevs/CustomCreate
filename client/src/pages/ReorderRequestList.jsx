import { useState, useEffect } from "react";
import ReorderRequestsTable from "../components/tables/ReorderRequestsTable";
import RequestForm from "../components/forms/RequestForm";
import EditRequestForm from "../components/forms/EditRequestForm";
import { useAuth } from "../context/UserContext";

function ReorderRequestList() {
  const [reorderRequests, setReorderRequests] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [editRequestFormOpen, setEditRequestFormOpen] = useState(false);
  const [requestToEdit, setRequestToEdit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestFormOpen, setRequestFormOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/reorder_requests", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => setReorderRequests(data))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/materials", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => setMaterials(data))
      .finally(() => setIsLoading(false));
  }, []);

  function addRequest(newRequest) {
    setReorderRequests((prevRequests) => [...prevRequests, newRequest]);
  }

  function handleEditRequest(idx) {
    setRequestToEdit(idx);
    setEditRequestFormOpen(true);
  }

  function saveEditedRequest(request) {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/reorder_requests", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(request),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error(`Failed to update ${request.id}`);
      })
      .then((data) => {
        setReorderRequests((prevRequests) =>
          prevRequests.map((request) =>
            request.id === data.id ? data : request,
          ),
        );
      });
  }

  if (isLoading) return <div className="table-wrapper">Loading...</div>;
  if (error) return <div className="table-wrapper">{error}</div>;

  return (
    <div className="page-stack">
      <ReorderRequestsTable
        requests={reorderRequests}
        user={user}
        editRequest={handleEditRequest}
      />

      {requestFormOpen && (
        <RequestForm
          addRequest={addRequest}
          closeForm={() => {
            setRequestFormOpen(false);
          }}
          materials={materials}
        />
      )}
      <button className="btn" onClick={() => setRequestFormOpen(true)}>
        Add Reorder Request
      </button>
      {editRequestFormOpen && (
        <EditRequestForm
          saveEditedRequest={saveEditedRequest}
          closeForm={() => {
            setEditRequestFormOpen(false);
          }}
          requestToEdit={
            requestToEdit !== null && reorderRequests[requestToEdit]
          }
          materials={materials}
        />
      )}
    </div>
  );
}

export default ReorderRequestList;
