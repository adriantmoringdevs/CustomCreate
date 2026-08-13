import "./JobMaterialsTable.css";
import {
  BsFillTrashFill,
  BsFillPencilFill,
  BsArrowRightSquareFill,
} from "react-icons/bs";
// import { useAuth } from "../context/UserContext";


function LaborTable({ laborEntries }) {
    console.log(laborEntries)
  // const { user } = useAuth();
  return (
    <div className="table-wrapper">
      <h1>Labor Entries</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="expand">
              Logged by
            </th>
            <th scope="col" className="expand">
              Hours
            </th>
            <th scope="col">Hourly Rate</th>
            {/* <th scope="col">Unit/Measure</th>
            <th scope="col">Distributor</th> */}
          </tr>
        </thead>
        <tbody>
          {laborEntries.map((entry, idx) => (
            <tr key={idx}>
              <th scope="row">{entry.user.username}</th>
              <td>{entry.hours}</td>
              <td>{entry.hourly_rate}</td>
              {/* <td>{material.material_lot.material.unit_measure}</td>
              <td>{material.material_lot.material.distributor}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LaborTable;
