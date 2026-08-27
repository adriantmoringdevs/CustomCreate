import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import ReorderMaterialForm from "../components/forms/ReorderMaterialForm";

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

  return (
    <div>
      Material Name: 
      {material && (
        <div>
        <div>{material.name}</div>

      <div>Last Purchased:  
        <span>
          {convertTime(material.last_purchased)}
        </span>
      </div>
      <div>Current Stock Across Lots: 
        <span>{material.total_quantity}</span>
      </div>
      <div>
        Reorder Point: 
        <span>{material.reorder_point}</span>
      </div>
      <div>
        Distributor: 
        <span>
        {material.distributor}
        </span>
      </div>
      <div>Average Price per Unit: 
        <span>${material.avg_price} per {material.unit_measure}</span>
      </div>

      <button onClick={() => setReorderFormOpen(true)}>Reorder {material.name}</button>
      {reorderFormOpen && (
        <ReorderMaterialForm
        closeForm={() => setReorderFormOpen(false)} 
        location = {location}
        material={material}/>
      )}
      </div>
      )}

    </div>
  );
}

export default MaterialDetail;
