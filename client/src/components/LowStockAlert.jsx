import { Report } from "@material-ui/icons";
import "../styles/widgetSm.css";
import { BsArrowRightSquareFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function LowStockAlert({ lowMaterials }) {
  const navigate = useNavigate();

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">
        Low Stock Alert
        <Report className="widgetSmTitleIcon" />
      </span>

      <table className="widgetSmTable">
        <thead>
          <tr>
            <th>Material</th>
            <th>SKU</th>
            <th className="widgetSmTableActionHeader">Reorder</th>
          </tr>
        </thead>
        <tbody>
          {lowMaterials.map((material) => (
            <tr className="widgetSmTableRow" key={material.id}>
              <td className="widgetSmName">{material.name}</td>
              <td className="widgetSmSKU">{material.sku}</td>
              <td className="widgetSmTableAction">
                <button
                  className="nav-btn"
                  onClick={() => navigate(`/materials/${material.id}`)}
                  aria-label={`Reorder ${material.name}`}
                >
                  <BsArrowRightSquareFill />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LowStockAlert;