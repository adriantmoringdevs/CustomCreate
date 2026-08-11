import { useState, useEffect } from "react";
import Dropdown from "../DropdownContainer/Dropdown/Dropdown";
import DropdownItem from "../DropdownContainer/DropdownItem/DropdownItem";
import "./JobForm.css";

function EditJobForm({ saveEditedJob, closeForm, jobToEdit }) {
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState(null);

  const statuses = ["QUOTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  const paymentStatuses = ["UNPAID", "PARTIALLY_PAID", "PAID"];

    useEffect(() => {
    setName(jobToEdit["name"]);
    setCustomer(jobToEdit["customer"]);
    setStatus(jobToEdit["status"]);
    setPaymentStatus(jobToEdit["payment_status"]);
  }, [jobToEdit]);


  function handleStatusChange(status) {
    setStatus(status);
  }

  function handlePaymentStatusChange(paymentStatus) {
    setPaymentStatus(paymentStatus);
  }

  function handleSubmit (e) {
    e.preventDefault();
    jobToEdit.name = name;
    jobToEdit.customer = customer;
    jobToEdit.status = status;
    jobToEdit.paymentStatus = paymentStatus;
    saveEditedJob(jobToEdit);
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
        Edit Job
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Item Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Customer</label>
            <div className="form-group">
              <input
                type="text"
                placeholder="Item Name"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
              />
            </div>
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
                    >{`${status}`}</DropdownItem>
                  ))}
                </>
              }
            />
          </div>

          <div className="form-group">
            <Dropdown
              buttonText={paymentStatus || "Select a Payment status"}
              content={
                <>
                  {paymentStatuses.map((paymentStatus, id) => (
                    <DropdownItem
                      key={id}
                      onClick={() => handlePaymentStatusChange(paymentStatus)}
                    >{`${paymentStatus}`}</DropdownItem>
                  ))}
                </>
              }
            />
          </div>

          <button type="submit" className="btn">
            Save Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditJobForm;