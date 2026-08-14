import { useState, useEffect } from 'react'
import MaterialsTable from '../components/tables/MaterialsTable'


function MaterialList() {
    const [ materials, setMaterials ] = useState([]);
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
         const token = localStorage.getItem("token");
         fetch("http://localhost:5000/api/materials", {
            headers: { Authorization: `Bearer ${token}`},
         })
         .then((res) => {
            if (!res.ok) throw new Error("Invalid token");
            return res.json();
         })
         .then((data) => setMaterials(data))
         .finally(() => setIsLoading(false))
    }, [])

    return (
        <div className="page-stack">
            {materials &&
            <MaterialsTable materials={materials} />
            }
        </div>
    )
}

export default MaterialList