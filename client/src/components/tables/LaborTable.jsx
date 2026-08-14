import {
  BsFillTrashFill,
  BsFillPencilFill,
} from "react-icons/bs";
// import { useAuth } from "../context/UserContext";


function LaborTable({ laborEntries, editLabor, deleteLabor }) {

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
            <th scope="col" className="actions-col">
              Actions
            </th>

          </tr>
        </thead>
        <tbody>
          {laborEntries.map((entry, idx) => (
            <tr key={idx}>
              <th scope="row">{entry.user.username}</th>
              <td>{entry.hours}</td>
              <td>{entry.hourly_rate}</td>
              <td>
                <span className="actions">
                  <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => editLabor(idx)}
                    />
                    <BsFillTrashFill className="delete-btn"
                    onClick={() => deleteLabor(idx)}
                    />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default LaborTable;
