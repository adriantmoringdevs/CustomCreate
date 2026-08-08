function JobMaterialUsageCard({materialUse}) {
    return (
        <div>
            <ul>
            <li>Name: {materialUse.material_lot.material.name}</li>
            <li>Quantity Used: {materialUse.quantity_used}</li>
            <li>SKU #: {materialUse.material_lot.material.sku}</li>
            <li>Unit/Measure: {materialUse.material_lot.material.unit_measure}</li>
            <li>Distributor: {materialUse.material_lot.material.distributor}</li>
            </ul>
        </div>
    )
}
export default JobMaterialUsageCard;