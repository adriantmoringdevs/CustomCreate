import { BsFillPencilFill } from "react-icons/bs"

function ReorderRequestsTable({ requests, user, editRequest }) {

  return (
    <div className="table-wrapper">
      <h1>Reorder Requests Table</h1>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" className="expand">
              Material
            </th>
            <th scope="col" className="expand">
              SKU #
            </th>
            <th scope="col">Created By</th>
            <th scope="col">Status</th>
            <th scope="col">Notes</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
            {requests.map((request, idx) => (
                <tr key={idx}>
                    <th scope="row">{request.material.name}</th>
                    <td>{request.material.sku}</td>
                    <td>{user.username}</td>
                    <td>{request.status}</td>
                    <td>{request.notes}</td>
                    <td>
                      <span className="actions">
                        <BsFillPencilFill className="edit-btn"
                        onClick={() => editRequest(idx)}
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

export default ReorderRequestsTable;
