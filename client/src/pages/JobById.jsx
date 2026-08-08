import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import JobMaterialUsageCard from '../components/JobMaterialUsageCard';
import AvailableLotsCard from '../components/AvailableLotsCard';

function JobById() {
    const [jobMaterialUsages, setJobMaterialUsage] = useState([]);
    const [availableLots, setAvailableLots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
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
    })
    .finally(() => setIsLoading(false))
    }, [])

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:5000/api/materials/available", {
            headers: {Authorization: `Bearer ${token}`},
        })
        .then((res) => {
                    if (!res.ok) throw new Error("Invalid token");
                    return res.json()
        })
            .then((data) => {
            setAvailableLots(data)
            })
    .finally(() => setIsLoading(false))
    }, [])




  return <div>
    Materials Used: 
    {jobMaterialUsages && 
    jobMaterialUsages.map((materialUse, idx) => (
       <JobMaterialUsageCard key={idx} materialUse={materialUse}/>
    ))}
    <div>
        Available Lots:
        {availableLots &&
        availableLots.map((lot, idx) => (
            <AvailableLotsCard key={idx} lot={lot} />
        ))}
    </div>
        </div>;

}

export default JobById;
