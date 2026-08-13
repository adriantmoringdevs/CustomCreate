import "./AvailableLotsTable.css";
import { BsClipboardCheckFill } from "react-icons/bs";
import { useState } from "react";
import AssignMaterialForm from "../forms/AssignMaterialForm";

function AvailableLotsTable({ lots, addUsage, location }) {
  const [assignOpen, setAssignOpen] = useState(false);
  const [lotToAssign, setLotToAssign] = useState(null);

  function handleAssignLot(idx) {
        setLotToAssign(idx);
    setAssignOpen(true);
  }

  return (
    <div className="table-wrapper">
      <h1>Available Lots</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="expand">
              Assign Lot to Job
            </th>
            <th scope="col" className="expand">
              Material Name
            </th>
            <th scope="col" className="expand">
              Unit/Measure
            </th>
            <th scope="col">Quantity Remaining</th>
          </tr>
        </thead>
        <tbody>
          {lots.map((lot, idx) => (
            <tr key={idx}>
              <td>
              <BsClipboardCheckFill
                onClick={() => handleAssignLot(idx)}
              />
              </td>
              <th scope="row">{lot.material.name}</th>
              <td>{lot.material.unit_measure}</td>
              <td>{lot.quantity_remaining}</td>
            </tr>
            
          ))}
        </tbody>
      </table>
      {assignOpen && (
        <AssignMaterialForm
          closeForm={() => {
            setAssignOpen(false);
          }}
          lot={lotToAssign !== null && lots[lotToAssign]}
          addUsage={addUsage}
          location={location}
        />
      )}
    </div>
  );
}

export default AvailableLotsTable;
