function DeleteConfirm({ closeDeleteConfirm, deleteJob, jobToDelete }) {
  if (!jobToDelete) return;
  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeDeleteConfirm();
      }}
    >
      <div className="form">
        <h3 className="form-title">Are you sure you want to delete this job?</h3>

        <div className="form-actions">
          <button className="btn btn-danger" onClick={() => deleteJob(jobToDelete)}>
            Yes
          </button>
          <button className="btn btn-secondary" onClick={() => closeDeleteConfirm()}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirm;
