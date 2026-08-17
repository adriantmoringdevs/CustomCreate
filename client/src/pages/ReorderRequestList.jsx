import { useState, useEffect } from 'react'
import ReorderRequestsTable from '../components/tables/ReorderRequestsTable';
import RequestForm from '../components/forms/RequestForm';
import { useAuth } from "../context/UserContext";


function ReorderRequestList() {
  const [reorderRequests, setReorderRequests] = useState([])
  const [materials, setMaterials] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requestFormOpen, setRequestFormOpen] = useState(false)
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
    }, [])

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
    }, [])

    function addRequest(newRequest) {
      setReorderRequests((prevRequests) => [...prevRequests, newRequest]);
    }

    if (isLoading) return <div className='table-wrapper'>Loading...</div>
    if (error) return <div className='table-wrapper'>{error}</div>;

  return (
    <div className='page-stack'>
      <ReorderRequestsTable 
      requests={reorderRequests}
      />

      {requestFormOpen && (
        <RequestForm
        addRequest={addRequest} closeForm={() => {
          setRequestFormOpen(false)
        }}
        materials={materials}
        />
      )}
      <button className='btn' onClick={() => setRequestFormOpen(true)}>Add Reorder Request</button>
    </div>
    );
}

export default ReorderRequestList;
