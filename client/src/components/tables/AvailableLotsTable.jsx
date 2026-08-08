import "./AvailableLotsTable.css"

function AvailableLotsTable({lots}) {
    return (
        <div className="table-wrapper">
        <h1>Available Lots</h1>
        <table className="table">
        <thead>
          <tr>
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
              <th scope="row">{lot.material.name}</th>
              <td>{lot.material.unit_measure}</td>
              <td>{lot.quantity_remaining}</td>
              </tr>
          ))}
        </tbody>
        </table>
        </div>
    )
}

export default AvailableLotsTable;