import "../styles/DeleteConfirm.css"

function DeleteConfirm ({closeDeleteConfirm, deleteJob, jobToDelete}) {
    if(!jobToDelete) return;
    return ( 
        <div className="form-container"
        onClick={(e) => {
        if (e.target.className === "form-container") closeDeleteConfirm();
      }}>
        <div className="form">
            <h3 className="form-group">Are you sure you want to delete this job?: 
                {/* {jobToDelete ? {jobToDelete.name} : null} */}
            </h3>

            <button className="btn" onClick={() => deleteJob(jobToDelete)}>Yes</button>
            <button className="btn" onClick={() => closeDeleteConfirm()}>No</button>
            </div>
        </div>
    )
}

export default DeleteConfirm;