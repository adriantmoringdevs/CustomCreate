import "./JobForm.css";
import { useState } from "react";

function AssignMaterialForm({ closeForm, lot, addUsage, location }) {
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState(null);

  const pathParts = location.pathname.split("/");
  const jobID = pathParts[pathParts.length - 1];

  function handleSubmit(e) {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setError("");
    const use = {
      quantity_used: quantity,
      material_lot_id: lot.id,
      job_id: jobID,
    };
    fetch(`http://localhost:5000/api${location.pathname}/materials/use`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(use),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("New Usage post failed");
      })
      .then((data) => addUsage(data));
    closeForm();
  }

  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        Assign Material to Job Quantity Remaining:
        {lot.quantity_remaining}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="number"
              min="0"
              max={lot.quantity_remaining}
              step="0.00001"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
          <button type="submit" className="btn">
            Submit Material Use
          </button>
        </form>
      </div>
    </div>
  );
}

export default AssignMaterialForm;
