import { useState } from "react";
import Dropdown from "../DropdownContainer/Dropdown/Dropdown";
import DropdownItem from "../DropdownContainer/DropdownItem/DropdownItem";

function RequestForm({ closeForm, addRequest, materials }) {
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [material, setMaterial] = useState("");
  const [error, setError] = useState(null);

  const statuses = ["PENDING", "COMPLETED", "DISMISSED"];

  function handleSubmit(e) {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setError("");
    const request = {
      material_id: material.id,
      status: status,
      notes: notes,
    };
    fetch("http://localhost:5000/api/reorder_requests", {
      method: "POST",
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
        throw new Error("New request post failed");
      })
      .then((data) => addRequest(data));
    closeForm();
  }

  function handleStatusChange(status) {
    setStatus(status);
  }

  function handleMaterialChange(material) {
    setMaterial(material);
  }

  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        <h3 className="form-title">Create New Reorder Request</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <Dropdown
              buttonText={material.name || "Select a Material"}
              content={
                <>
                  {materials.map((material, id) => (
                    <DropdownItem
                      key={id}
                      onClick={() => handleMaterialChange(material)}
                    >
                      {`${material.name} SKU#: ${material.sku}`}
                    </DropdownItem>
                  ))}
                </>
              }
            />
          </div>

          <div className="form-group">
            <Dropdown
              buttonText={status || "Select a status"}
              content={
                <>
                  {statuses.map((status, id) => (
                    <DropdownItem
                      key={id}
                      onClick={() => handleStatusChange(status)}
                    >
                      {`${status}`}
                    </DropdownItem>
                  ))}
                </>
              }
            />
          </div>

          <div className="form-group">
            <label for="form-notes">Notes:</label>
            <textarea
              id="form-notes"
              name="notes"
              cols="40"
              placeholder="Enter your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn">
            Save Reorder Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default RequestForm;
