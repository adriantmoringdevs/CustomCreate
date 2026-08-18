import { useState, useEffect } from "react";
import Dropdown from "../DropdownContainer/Dropdown/Dropdown";
import DropdownItem from "../DropdownContainer/DropdownItem/DropdownItem";

function EditRequestForm({
  requestToEdit,
  closeForm,
  saveEditedRequest,
  materials,
}) {
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [material, setMaterial] = useState("");
  const [error, setError] = useState(null);

  const statuses = ["PENDING", "COMPLETED", "DISMISSED"];

  useEffect(() => {
    setStatus(requestToEdit["status"]);
    setNotes(requestToEdit["notes"]);
    setMaterial(requestToEdit["material"]);
  }, [requestToEdit]);

  function handleStatusChange(status) {
    setStatus(status);
  }

  // function handleMaterialChange(material) {
  //   setMaterial(material);
  // }

  function handleSubmit(e) {
    e.preventDefault();
    requestToEdit.status = status;
    requestToEdit.notes = notes;
    // requestToEdit.material_id = material.id;
    saveEditedRequest(requestToEdit);
    closeForm();
  }

  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        <h3 className="form-title">Edit Reorder Request for {material.name} SKU #{material.sku}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">

            {/* <Dropdown
              buttonText={material.name || "Select a Material"}
              content={
                <>
                  {materials.map((material, id) => (
                    <DropdownItem
                      key={id}
                      onClick={() => handleMaterialChange(material)}
                    >
                      {`${material.name} SKU#: ${material.sku}`}
                    </DropdownItem>
                  ))}
                </>
              }
            /> */}
          </div>

          <div className="form-group">
            <Dropdown
              buttonText={status || "Select a status"}
              content={
                <>
                  {statuses.map((status, id) => (
                    <DropdownItem
                      key={id}
                      onClick={() => handleStatusChange(status)}
                    >
                      {`${status}`}
                    </DropdownItem>
                  ))}
                </>
              }
            />
          </div>

          <div className="form-group">
            <label for="form-notes">Notes:</label>
            <textarea
              id="form-notes"
              name="notes"
              cols="40"
              placeholder="Enter your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn">
            Save Reorder Request
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditRequestForm;
