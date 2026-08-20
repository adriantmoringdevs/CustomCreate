from sqlalchemy.orm import validates
from sqlalchemy.ext.hybrid import hybrid_property
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
    

class Job(db.Model):
    __tablename__ = 'jobs'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    name = db.Column(db.String, nullable=False)
    customer = db.Column(db.String, nullable=False)
    created_at = db.Column(db.DateTime, default=lambda:datetime.now(timezone.utc))
    status = db.Column(db.String, nullable=False)
    payment_status = db.Column(db.String, nullable=False)

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

    @property
    def total_quantity(self):
        return sum(lot.quantity_remaining or 0 for lot in self.material_lots)

    @property
    def is_available(self):
        return self.total_quantity > 0

    @property
    def low_stock(self):
        if self.reorder_point is None:
            return False
        return self.total_quantity < self.reorder_point

    @property
    def last_purchased(self):
        last_date_object = max(self.material_lots, key=lambda lot: lot.created_at, default=None)
        return last_date_object.created_at if last_date_object else None

    @validates('sku')
    def validate_status(self, key, value):
        if len(value) > 50:
            raise ValueError("SKU must be 50 characters or less")
        return value

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
        valid_statuses = ["PENDING", "COMPLETED", "DISMISSED"]
        if value == "": 
            raise ValueError("Status must be included")
        if value in valid_statuses:
            return value
        else:
            raise ValueError("Status must contain. one of three valid statuses.")




















    
        
    
        
    
        







