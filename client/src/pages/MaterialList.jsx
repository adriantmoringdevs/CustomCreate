import { useState, useEffect } from "react";
import MaterialsTable from "../components/tables/MaterialsTable";
import InventoryMaterialForm from "../components/forms/InventoryMaterialForm";

function MaterialList() {
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [materialsFormOpen, setMaterialsFormOpen] = useState(false);

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
  }, [materials]);

  function addMaterial(newMaterial) {
    console.log(newMaterial);
    setMaterials((prevMaterials) => [...prevMaterials, newMaterial]);
  }

  return (
    <div className="page-stack">
      {materials && <MaterialsTable materials={materials} />}
      <button className="btn" onClick={() => setMaterialsFormOpen(true)}>
        Order Inventory Material
      </button>
      {materialsFormOpen && (
        <InventoryMaterialForm
          closeForm={() => {
            setMaterialsFormOpen(false);
          }}
          addMaterial={addMaterial}
        />
      )}
    </div>
  );
}

export default MaterialList;
