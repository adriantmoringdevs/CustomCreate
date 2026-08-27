import { useState, useEffect } from "react";
import MaterialsTable from "../components/tables/MaterialsTable";
import InventoryMaterialForm from "../components/forms/InventoryMaterialForm";

function MaterialList() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [materialsFormOpen, setMaterialsFormOpen] = useState(false);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   fetch("http://localhost:5000/api/materials", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("Invalid token");
  //       return res.json();
  //     })
  //     .then((data) => setMaterials(data))
  //     .finally(() => setIsLoading(false));
  // }, []);

  // function addMaterial(newMaterial) {
  //   setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
  // }

  function refreshMaterials() {
    const token = localStorage.getItem("token");
    setIsLoading(true);
    return fetch("http://localhost:5000/api/materials", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json();
      })
      .then((data) => setMaterials(data))
      .finally(() => setIsLoading(false));
  }

  useEffect(() => {
    refreshMaterials();
  }, []);

  return (
    <div className="page-stack">
      <div className="page-actions">
        <button className="btn" onClick={() => setMaterialsFormOpen(true)}>
          Order Inventory Material
        </button>
      </div>
      {materials && <MaterialsTable materials={materials} />}
      {materialsFormOpen && (
        <InventoryMaterialForm
          closeForm={() => {
            setMaterialsFormOpen(false);
          }}
          refreshMaterials={refreshMaterials}
        />
      )}
    </div>
  );
}

export default MaterialList;
