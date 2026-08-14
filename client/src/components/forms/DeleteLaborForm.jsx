function DeleteLaborForm({ closeForm, deleteLabor, laborToDelete }) {
  if (!laborToDelete) return;
  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        <h3 className="form-title">
          Are you sure you want to delete this labor entry?
        </h3>
        <div className="form-actions">
          <button
            className="btn btn-danger"
            onClick={() => deleteLabor(laborToDelete)}
          >
            Yes
          </button>
          <button className="btn btn-secondary" onClick={() => closeForm()}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteLaborForm;
