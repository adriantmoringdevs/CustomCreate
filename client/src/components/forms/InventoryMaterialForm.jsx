import { useState } from "react";

function InventoryMaterialForm({ addMaterial, closeForm }) {
  const [orderDetails, setOrderDetails] = useState({
    name: "",
    distributor: "",
    reorderPoint: "",
    sku: "",
    unitMeasure: "",
    quantityPurchased: "",
    unitCost: "",
  });
  const [error, setError] = useState(null);

  function handleSubmit(e) {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setError("");
    const quantityRemaining = orderDetails.quantityPurchased;
    const order = {
      name: orderDetails.name,
      sku: orderDetails.sku,
      unit_measure: orderDetails.unitMeasure,
      distributor: orderDetails.distributor,
      reorder_point: orderDetails.reorderPoint,
      quantity_purchased: orderDetails.quantityPurchased,
      unit_cost: orderDetails.unitCost,
      quantity_remaining: quantityRemaining,
    };
    fetch("http://localhost:5000/api/materials/stock", {
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
        throw new Error("New order post failed");
      })
      .then((data) => addMaterial(data));
    closeForm();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        <h3 className="form-title">Order Inventory Material</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Material Name"
              name="name"
              value={orderDetails.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Distributor"
              name="distributor"
              value={orderDetails.distributor}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="ReOrder Point"
              name="reorderPoint"
              value={orderDetails.reorderPoint}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="SKU#"
              name="sku"
              value={orderDetails.sku}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Unit/Measure"
              name="unitMeasure"
              value={orderDetails.unitMeasure}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              placeholder="Quantity Purchased"
              name="quantityPurchased"
              value={orderDetails.quantityPurchased}
              onChange={handleChange}
            />
          </div>
          {/* <div className="form-group">
            <input
              type="text"
              placeholder="Quantity Remaining"
              name="quantityRemaining"
              value={orderDetails.quantityRemaining}
              onChange={handleChange}
            />
          </div> */}
          <div className="form-group">
            <input
              type="text"
              placeholder="Unit Cost"
              name="unitCost"
              value={orderDetails.unitCost}
              onChange={handleChange}
            />
          </div>
          {/* <div className="form-group">
            <input
              type="text"
              placeholder="Quantity Used"
              name="quantityUsed"
              value={orderDetails.quantityUsed}
              onChange={handleChange}
            />
          </div> */}

          <button type="submit" className="btn">
            Order Material
          </button>
        </form>
      </div>
    </div>
  );
}

export default InventoryMaterialForm;
