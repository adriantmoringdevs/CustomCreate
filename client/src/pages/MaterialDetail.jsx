import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ReorderMaterialForm from "../components/forms/ReorderMaterialForm";
import "../styles/MaterialDetail.css";

function MaterialDetail() {
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reorderFormOpen, setReorderFormOpen] = useState(false);
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
        setMaterial(data);
      })
      .finally(() => setIsLoading(false));
  }, []);

  function convertTime(rawTime) {
    const fixedString = rawTime
      .replace(" ", "T")
      .replace(/(\d{2}):(\d{6})$/, ".$1$2");
    const dateObj = new Date(fixedString);
    return dateObj.toLocaleString();
  }

  const isLowStock =
    material && material.total_quantity <= material.reorder_point;

  if (isLoading) {
    return <div className="material-detail-loading">Loading material…</div>;
  }

  if (!material) {
    return <div className="material-detail-error">Material not found.</div>;
  }

  return (
    <div className="material-detail">
      <header className="material-detail-header">
        <span className="material-eyebrow">Material</span>
        <h1>{material.name}</h1>
        <button
          className="reorder-button"
          onClick={() => setReorderFormOpen(true)}
        >
          Reorder {material.name}
        </button>
      </header>

      <section className="material-stats">
        <div className="stat-card">
          <span className="stat-label">Current Stock</span>
          <span className="stat-value">{material.total_quantity}</span>
          <span className="stat-unit">{material.unit_measure}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg. Price / Unit</span>
          <span className="stat-value">${material.avg_price}</span>
          <span className="stat-unit">per {material.unit_measure}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Last Purchased</span>
          <span className="stat-value stat-value--date">
            {convertTime(material.last_purchased)}
          </span>
        </div>
      </section>

      <section className="material-attributes">
        <h2>Details</h2>
        <dl>
          <dt>SKU</dt>
          <dd>{material.sku}</dd>

          <dt>Unit of Measure</dt>
          <dd>{material.unit_measure}</dd>

          <dt>Reorder Point</dt>
          <dd>{material.reorder_point}</dd>

          <dt>Distributor</dt>
          <dd>{material.distributor}</dd>
        </dl>
      </section>

      {reorderFormOpen && (
        <ReorderMaterialForm
          closeForm={() => setReorderFormOpen(false)}
          location={location}
          material={material}
        />
      )}
    </div>
  );
}

export default MaterialDetail;
