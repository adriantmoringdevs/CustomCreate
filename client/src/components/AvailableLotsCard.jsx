function AvailableLotsCard({lot}) {
    console.log(lot)
    return (
        <div>
            <ul>
                <li>Material Name: {lot.material.name}</li>
                <li>Unit/Measure: {lot.material.unit_measure}</li>
                <li>Material Lot Quanity Remaining: {lot.quantity_remaining}</li>
            </ul>


        </div>
    )
}

export default AvailableLotsCard;