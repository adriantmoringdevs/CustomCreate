import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ReorderMaterialForm({ closeForm, location, material }) {
  const [quantityPurchased, setQuantityPurchased] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function handleSubmit(e) {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setError("");
    const quantityRemaining = quantityPurchased;
    const order = {
      quantity_purchased: quantityPurchased,
      unit_cost: unitCost,
      quantity_remaining: quantityRemaining,
    };
    fetch(`http://localhost:5000/api${location.pathname}/reorder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(order),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Reorder post failed");
      })
      .then(closeForm())
      .then(navigate("/materials"));
  }

  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        <h3 className="form-title">
          Reorder Inventory Material {material.name}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Quantity Purchased</label>
            <div className="form-group">
              <input
                type="text"
                placeholder="Quantity Purchased"
                value={quantityPurchased}
                onChange={(e) => setQuantityPurchased(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Unit Cost</label>
            <div className="form-group">
              <input
                type="text"
                placeholder="Unit Cost"
                value={unitCost}
                onChange={(e) => setUnitCost(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn">
            Reorder Material
          </button>
        </form>
      </div>
    </div>
  );
}

export default ReorderMaterialForm;
