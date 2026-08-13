import { useState, useEffect } from 'react'
import "./JobForm.css";

function EditLaborForm({saveEditedLabor, closeForm, laborToEdit}) {
    const [hours, setHours] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [error, setError] = useState("");

    console.log(laborToEdit)

    useEffect(() => {
        setHours(laborToEdit["hours"]);
        setHourlyRate(laborToEdit["hourly_rate"])
    }, [laborToEdit]);

    function handleSubmit(e) {
        e.preventDefault();
        laborToEdit.hours = hours;
        laborToEdit.hourly_rate = hourlyRate;
        saveEditedLabor(laborToEdit);
        console.log(laborToEdit)
        closeForm();
    }
    return (
        <div className="form-container"
      onClick={(e) => {
        if (e.target.className === "form-container") closeForm();
      }}>
        <div className="form">
            Edit Labor Form
            <form onSubmit={handleSubmit}>
                <div className='form-group'>
                    <input
                    type="text"
                    placeholder="Hours"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    />
                </div>
                <div className='form-group'>
                    <input
                    type="text"
                    placeholder="Hourly Rate"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    />
                </div>
                <button type="submit" className='btn'>
                    Save Labor Entry
                </button>
            </form>
        </div>     
        </div>
    )
}

export default EditLaborForm;