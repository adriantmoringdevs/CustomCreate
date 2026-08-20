import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function MaterialDetail() {
  const [material, setMaterial] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <div>
      Material Detail
      {material && <div>{material.name}</div>}
    </div>
  );
}

export default MaterialDetail;
