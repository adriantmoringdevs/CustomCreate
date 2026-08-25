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

  function convertTime(rawTime) {
    const fixedString = rawTime
      .replace(" ", "T")
      .replace(/(\d{2}):(\d{6})$/, ".$1$2");
    const dateObj = new Date(fixedString);
    return dateObj.toLocaleString();
  }

  return (
    <div>
      Material Detail
      {material && (
        <div>
        <div>{material.name}</div>

      <div>Last Purchased 
        <span>
          {convertTime(material.last_purchased)}
        </span>
      </div>
      <div>Current Stock
        <span>{material.total_quantity}</span>
      </div>
      <div>
        Reorder Point
        <span>{material.reorder_point}</span>
      </div>
      <div>
        Distributor
        <span>
        {material.distributor}
        </span>
      </div>
      <div>Average Price
        <span>{material.avg_price}</span>
      </div>
      </div>
      )}

    </div>
  );
}

export default MaterialDetail;
