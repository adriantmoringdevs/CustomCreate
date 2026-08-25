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
      <ul className="widgetSmList">
        <div>
          {lowMaterials.map((material) => (
            <li className="widgetSmListItem" key={material.id}>
              <div className="widgetSmName">{material.name}</div>
              <div className="widgetSmSKU">SKU #: {material.sku}</div>
              <BsArrowRightSquareFill
                className="nav-btn"
                onClick={() => navigate(`/materials/${material.id}`)}
              />
            </li>
          ))}
        </div>
      </ul>
    </div>
  );
}

export default LowStockAlert;
