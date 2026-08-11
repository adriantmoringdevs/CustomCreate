import { useState } from "react";
import Dropdown from "../DropdownContainer/Dropdown/Dropdown";
import DropdownItem from "../DropdownContainer/DropdownItem/DropdownItem";
import "./JobForm.css";

function NewJobForm({ addJob, closeForm }) {
  const [name, setName] = useState("");
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [error, setError] = useState(null);

  const statuses = ["QUOTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"];
  const paymentStatuses = ["UNPAID", "PARTIALLY_PAID", "PAID"];

  function handleSubmit(e) {
    const token = localStorage.getItem("token");
    e.preventDefault();
    setError("");
    const job = {
      name: name,
      customer: customer,
      status: status,
      payment_status: paymentStatus,
    };
    fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(job),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("New job post failed");
      })
      .then((data) => addJob(data));
    closeForm();
  }

  function handleStatusChange(status) {
    setStatus(status);
  }

  function handlePaymentStatusChange(paymentStatus) {
    setPaymentStatus(paymentStatus);
  }

  return (
    <div
      className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}
    >
      <div className="form">
        Create New Job
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

export default NewJobForm;
