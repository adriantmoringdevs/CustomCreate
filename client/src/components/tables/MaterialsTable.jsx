import { useNavigate } from "react-router-dom";
import { 
  BsArrowRightSquareFill
} from "react-icons/bs";

function MaterialsTable({ materials }) {
  const navigate = useNavigate();

  return (
    <div className="table-wrapper">
      <h1>Inventory</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="expand">
              Name
            </th>
            <th scope="col" className="expand">
              Total Quantity Available
            </th>
            <th scope="col">SKU #</th>
            <th scope="col">Unit/Measure</th>
            <th scope="col">Distributor</th>
            <th scope="col">Reorder Point</th>
            <th scope="col">To Material Details</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material, idx) => (
            <tr key={idx}>
              <th scope="row">{material.name}</th>
              <td>{material.total_quantity}</td>
              <td>{material.sku}</td>
              <td>{material.unit_measure}</td>
              <td>{material.distributor}</td>
              <td>{material.reorder_point}</td>
              <td>
                <span>
                  <BsArrowRightSquareFill onClick={() => navigate(`/materials/${material.id}`)} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaterialsTable;
