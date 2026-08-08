import "./JobMaterialsTable.css"

function JobMaterialsTable({materials}) {
    return (
        <div className="table-wrapper">
        <h1>Job Materials</h1>
        <table className="table">
    
        <thead>
          <tr>
            <th scope="col" className="expand">
              Name
            </th>
            <th scope="col" className="expand">
              Quantity Used:
            </th>
            <th scope="col">SKU #</th>
            <th scope="col">Unit/Measure</th>
            <th scope="col">Distributor</th>
          </tr>
        </thead>
        <tbody>
          {materials.map((material, idx) => (
            <tr key={idx}>
              <th scope="row">{material.material_lot.material.name}</th>
              <td>{material.quantity_used}</td>
              <td>{material.material_lot.material.sku}</td>
              <td>{material.material_lot.material.unit_measure}</td>
              <td>{material.material_lot.material.distributor}</td>
            </tr>
          ))}
        </tbody>
        </table>
        </div>
    )
}

export default JobMaterialsTable;