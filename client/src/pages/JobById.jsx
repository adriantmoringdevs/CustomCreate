import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import JobMaterialUsageCard from '../components/JobMaterialUsageCard';

function JobById() {
    const [jobMaterialUsages, setJobMaterialUsage] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`http://localhost:5000/api${location.pathname}/job_material_usages`, {
            headers: {Authorization: `Bearer ${token}`},
    })
    .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
        return res.json()
    })
    .then((data) => {
        setJobMaterialUsage(data)
        console.log(jobMaterialUsages)
    })
    .finally(() => setIsLoading(false))
    }, [])


  return <div>
    {jobMaterialUsages && 
    jobMaterialUsages.map((materialUse, idx) => (
       <JobMaterialUsageCard materialUsage={materialUse}/>
    ))}
        </div>;

}

export default JobById;
