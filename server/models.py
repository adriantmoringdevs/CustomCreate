from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import Schema, fields
from datetime import datetime, timezone

from config import db, bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    role = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda:datetime.now(timezone.utc))

    jobs = db.relationship('Job', back_populates='user')
    labor_entries = db.relationship('LaborEntry', back_populates='user')
    reorder_requests = db.relationship('ReorderRequest', back_populates='user')
    
    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')
    
    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))
    
    @validates('role')
    def validate_role(self, key, value):
        valid_roles = ["MANAGER", "EMPLOYEE"]
        if value == "":
            raise ValueError("Role must be included")
        if value in valid_roles:
            return value
        else:
            raise ValueError("Role must contain. one of two valid statuses.")
    
    def __repr__(self):
        return f'User {self.username}'
    
class UserSchema(Schema):
        id = fields.Int()
        username = fields.String(required=True)
        role = fields.String(required=True)
        created_at = fields.String()

        jobs = fields.List(fields.Nested(lambda: JobSchema(exclude=("user",))))
        # labor_entries = fields.List(fields.Nested(lambda: LaborEntrySchema(exclude=("user",))))
        reorder_requests = fields.List(fields.Nested(lambda: ReorderRequestSchema(exclude=("user",))))

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String, nullable=False)
    customer = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda:datetime.now(timezone.utc))
    status = db.Column(db.String, nullable=False)
    payment_status = db.Column(db.String, nullable=False)
    # total_job_cost = db.Column(db.Numeric(10, 2), default=0.00)

    user = db.relationship('User', back_populates='jobs')
    labor_entries = db.relationship('LaborEntry', back_populates='job', cascade="all, delete-orphan",)
    job_material_usages = db.relationship('JobMaterialUsage', back_populates='job', cascade="all, delete-orphan",)

    @property
    def labor_cost(self):
        return sum(entry.hourly_rate * entry.hours for entry in self.labor_entries)

    @property
    def material_cost(self):
        return sum(
            usage.quantity_used * usage.material_lot.unit_cost
            for usage in self.job_material_usages)

    @property
    def total_job_cost(self):
        return self.labor_cost + self.material_cost


    @validates('status')
    def validate_status(self, key, value):
        valid_statuses = ["QUOTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"]
        if value == "":
            raise ValueError("Job Status must be included")
        if value in valid_statuses:
            return value
        else:
            raise ValueError("Job Status must contain. one of four valid statuses.")
        
    @validates('payment_status')
    def validate_payment_status(self, key, value):
        valid_payment_statuses = ["UNPAID", "PARTIALLY_PAID", "PAID"]
        if value == "":
            raise ValueError("Payment Status must be included")
        if value in valid_payment_statuses:
            return value
        else:
            raise ValueError("Payment Status must contain. one of three valid statuses.")
        
    def __repr__(self):
        return f'<Name: {self.name}, Customer: {self.customer}, Created At: {self.created_at}, Status: {self.status}, Payment Status: {self.payment_status}>'
        

class JobSchema(Schema):
    id = fields.Int()
    name = fields.String(required=True)
    customer = fields.String(required=True)
    created_at = fields.String()
    status = fields.String(required=True)
    payment_status = fields.String(required=True)
    total_job_cost = fields.Decimal(places=2, as_string=True)

    user = fields.Nested(UserSchema(exclude=("jobs",)))
    labor_cost = fields.Function(lambda job: round(float(job.labor_cost), 2))
    material_cost = fields.Function(lambda job: round(float(job.material_cost), 2))
    total_job_cost = fields.Function(lambda job: round(float(job.total_job_cost), 2))

    # labor_entries = fields.List(fields.Nested(lambda: LaborEntrySchema(exclude=("job",))))
    # job_material_usages = fields.List(fields.Nested(lambda: JobMaterialUsageSchema(exclude=("job",))))

class LaborEntry(db.Model):
    __tablename__ = 'labor_entries'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'))
    hours = db.Column(db.Integer, nullable=False)
    hourly_rate = db.Column(db.Numeric(10, 2), nullable=False)

    user = db.relationship('User', back_populates="labor_entries")
    job = db.relationship('Job', back_populates="labor_entries")

    def __repr__(self):
        return f"<Hours: {self.hours}, Hourly Rate: {self.hourly_rate}>"
    
class LaborEntrySchema(Schema):
    id = fields.Int()
    hours = fields.Int(required=True)
    hourly_rate = fields.Decimal(places=2, as_string=True)

    # user = fields.Nested(UserSchema(exclude=("labor_entries", "jobs")))
    # job = fields.Nested(JobSchema(exclude=("labor_entries",)))

class JobMaterialUsage(db.Model):
    __tablename__ = 'job_material_usages'

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.id'))
    material_lot_id = db.Column(db.Integer, db.ForeignKey('material_lots.id'))
    quantity_used = db.Column(db.Numeric(20, 5))


    job = db.relationship('Job', back_populates="job_material_usages")
    material_lot = db.relationship('MaterialLot', back_populates="job_material_usages")

    def __repr__(self):
        return f"<Quantity Used: {self.quantity_used}>"
    
class JobMaterialUsageSchema(Schema):
    id = fields.Int()
    quantity_used = fields.Decimal(places=5, as_string=True)

    # job = fields.Nested(JobSchema(exclude=("job_material_usages",)))
    material_lot = fields.Nested(lambda: MaterialLotSchema(exclude=("job_material_usages",)))


class MaterialLot(db.Model):
    __tablename__ = 'material_lots'

    id = db.Column(db.Integer, primary_key=True)
    material_id = db.Column(db.Integer, db.ForeignKey("materials.id"))
    quantity_purchased = db.Column(db.Numeric(20, 5))
    unit_cost = db.Column(db.Numeric(10, 2), nullable=False)
    quantity_remaining = db.Column(db.Numeric(20, 5))
    created_at = db.Column(db.DateTime, default=lambda:datetime.now(timezone.utc))

    job_material_usages = db.relationship('JobMaterialUsage', back_populates="material_lot")
    material = db.relationship('Material', back_populates="material_lots")

class MaterialLotSchema(Schema):
    id = fields.Int()
    quantity_purchased = fields.Decimal(places=5, as_string=True)
    unit_cost = fields.Decimal(places=2, as_string=True)
    quantity_remaining = fields.Decimal(places=5, as_string=True)
    created_at = fields.String()

    job_material_usages = fields.List(fields.Nested(JobMaterialUsageSchema(exclude=("material_lot",))))
    material = fields.Nested(lambda: MaterialSchema(exclude=("material_lots",)))

class Material(db.Model):
    __tablename__ = 'materials'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    sku = db.Column(db.String(50), nullable=False)
    unit_measure = db.Column(db.String, nullable=False)
    distributor = db.Column(db.String)
    reorder_point = db.Column(db.Numeric(20, 5))

    material_lots = db.relationship('MaterialLot', back_populates="material")
    reorder_requests = db.relationship('ReorderRequest', back_populates="material")

    __table_args__ = (
        db.UniqueConstraint('sku', name='uq_material_sku'),
        )

    @validates('sku')
    def validate_status(self, key, value):
        if len(value) > 50:
            raise ValueError("SKU must be 50 characters or less")
        return value

class MaterialSchema(Schema):
    id = fields.Int()
    name = fields.Str(required=True)
    sku = fields.String(required=True)
    unit_measure = fields.Str()
    distributor = fields.Str()
    reorder_point = fields.Decimal(places=5, as_string=True)

    material_lots = fields.List(fields.Nested(MaterialLotSchema(exclude=("material",))))
    reorder_requests = fields.List(fields.Nested(lambda: ReorderRequestSchema(exclude=("material",))))

class ReorderRequest(db.Model):
    __tablename__ = 'reorder_requests'

    id = db.Column(db.Integer, primary_key=True)
    material_id = db.Column(db.Integer, db.ForeignKey("materials.id"))
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    status = db.Column(db.String, nullable=False)
    notes = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=lambda:datetime.now(timezone.utc))

    material = db.relationship('Material', back_populates="reorder_requests")
    user = db.relationship('User', back_populates="reorder_requests")

    @validates('status')
    def validate_payment_status(self, key, value):
        valid_statuses = ["PENDING", "APPROVED", "DISMISSED"]
        if value == "":
            raise ValueError("Status must be included")
        if value in valid_statuses:
            return value
        else:
            raise ValueError("Status must contain. one of three valid statuses.")

class ReorderRequestSchema(Schema):
    id = fields.Int()
    status = fields.Str(required=True)
    notes = fields.Str()
    created_at = fields.String()

    user = fields.Nested(UserSchema(exclude=("reorder_requests",)))
    material = fields.Nested(MaterialSchema(exclude=("reorder_requests",)))






















    
        
    
        
    
        







