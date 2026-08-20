from marshmallow import Schema, fields

class UserSchema(Schema):  
    id = fields.Int()
    username = fields.String(required=True)
    role = fields.String(required=True)
    created_at = fields.String()

    # jobs = fields.List(fields.Nested(lambda: JobSchema(exclude=("user",))))
    labor_entries = fields.List(fields.Nested(lambda: LaborEntrySchema(exclude=("user",))))
    # reorder_requests = fields.List(fields.Nested(lambda: ReorderRequestSchema(exclude=("user",))))

class JobSchema(Schema):
    id = fields.Int()
    name = fields.String(required=True)
    customer = fields.String(required=True)
    created_at = fields.String()
    status = fields.String(required=True)
    payment_status = fields.String(required=True)
    total_job_cost = fields.Decimal(places=2, as_string=True)

    # user = fields.Nested(UserSchema(exclude=("jobs",)))
    labor_cost = fields.Function(lambda job: round(float(job.labor_cost), 2))
    material_cost = fields.Function(lambda job: round(float(job.material_cost), 2))
    total_job_cost = fields.Function(lambda job: round(float(job.total_job_cost), 2))

    # labor_entries = fields.List(fields.Nested(lambda: LaborEntrySchema(exclude=("job",))))
    # job_material_usages = fields.List(fields.Nested(lambda: JobMaterialUsageSchema(exclude=("job",))))

class LaborEntrySchema(Schema):
    id = fields.Int()
    hours = fields.Int(required=True)
    hourly_rate = fields.Decimal(places=2, as_string=True)

    user = fields.Nested(UserSchema(exclude=("labor_entries",)))
    # job = fields.Nested(JobSchema(exclude=("labor_entries",)))
    
class JobMaterialUsageSchema(Schema):
    id = fields.Int()
    quantity_used = fields.Decimal(places=5, as_string=True)

    # # job = fields.Nested(JobSchema(exclude=("job_material_usages",)))
    material_lot = fields.Nested(lambda: MaterialLotSchema(exclude=("job_material_usages",)))

class MaterialLotSchema(Schema):
    id = fields.Int()
    quantity_purchased = fields.Decimal(places=5, as_string=True)
    unit_cost = fields.Decimal(places=2, as_string=True)
    quantity_remaining = fields.Decimal(places=5, as_string=True)
    created_at = fields.String()

    job_material_usages = fields.List(fields.Nested(JobMaterialUsageSchema(exclude=("material_lot",))))
    material = fields.Nested(lambda: MaterialSchema(exclude=("material_lots",)))

class MaterialSchema(Schema):
    id = fields.Int()
    name = fields.Str(required=True)
    sku = fields.String(required=True)
    unit_measure = fields.Str()
    distributor = fields.Str()
    reorder_point = fields.Decimal(places=5, as_string=True)

    material_lots = fields.List(fields.Nested(MaterialLotSchema(exclude=("material",))))
    reorder_requests = fields.List(fields.Nested(lambda: ReorderRequestSchema(exclude=("material",))))
    low_stock = fields.Function(lambda material: material.low_stock)
    is_available = fields.Function(lambda material: str(material.is_available))
    total_quantity = fields.Function(lambda material: str(material.total_quantity))
    last_purchased = fields.Function(lambda material: str(material.last_purchased))

class ReorderRequestSchema(Schema):
    id = fields.Int()
    status = fields.Str(required=True)
    notes = fields.Str()
    created_at = fields.String()

    # user = fields.Nested(UserSchema(exclude=("reorder_requests",)))
    material = fields.Nested(MaterialSchema(exclude=("reorder_requests",)))

class OrderJobMaterialSchema(Schema):
    material = fields.Nested(MaterialSchema)
    material_lot = fields.Nested(MaterialLotSchema)
    job_material_usage = fields.Nested(JobMaterialUsageSchema)

class OrderInventoryMaterialSchema(Schema):
    material = fields.Nested(MaterialSchema)
    material_lot = fields.Nested(MaterialLotSchema)

class UseMaterialLotSchema(Schema):
    job_material_usage = fields.Nested(JobMaterialUsageSchema)
    material_lot = fields.Nested(MaterialLotSchema)
    material = fields.Nested(MaterialSchema)





