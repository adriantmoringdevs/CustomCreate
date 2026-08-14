import os
from flask import Flask, jsonify, request, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity, create_access_token, jwt_required
from flask_cors import CORS
from config import app, db, api, jwt
from models import User, Job, Material, MaterialLot, JobMaterialUsage,  ReorderRequest, LaborEntry
from schemas import UserSchema, JobSchema, MaterialSchema, MaterialLotSchema, JobMaterialUsageSchema, ReorderRequestSchema, LaborEntrySchema, OrderJobMaterialSchema, OrderInventoryMaterialSchema, UseMaterialLotSchema
from functools import wraps

CORS(app,
    origins=["http://localhost:5173"],
    supports_credentials=True)

def check_role(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.filter(User.id==current_user_id).first()
        if user.role == "EMPLOYEE":
            return {'error': 'Employee cannot create Jobs or order Materials'}, 404
        return f(*args, **kwargs)
    return decorated_function

class Data(Resource):
    def get(self):
        return jsonify({"message": "Hello from Flask, SQLAlchemy, and Postgres!"})

class Signup(Resource):
    def post(self):
        request_json = request.get_json()
        username = request_json.get('username')
        password = request_json.get('password')
        role = request_json.get('role')
        user = User(
            username=username,
            role=role
        )
        user.password_hash = password
        try:
            db.session.add(user)
            db.session.commit()
            token = create_access_token(identity=str(user.id))
            return make_response(jsonify(token=token, user=UserSchema().dump(user)), 201)
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422
        
class WhoAmI(Resource):
    def get(self):
        user_id = get_jwt_identity()
        user = User.query.filter(User.id == user_id).first()
        return User.UserSchema().dump(user), 200
    
class Login(Resource):
    def post(self):
        username = request.get_json()['username']
        password = request.get_json()['password']
        user = User.query.filter(User.username == username).first()

        if user and user.authenticate(password):
            token = create_access_token(identity=str(user.id))
            return make_response(jsonify(token=token, user=UserSchema().dump(user)), 201)

class Users(Resource):
    @jwt_required()
    def get(self):
        users = User.query.all()
        return UserSchema(many=True).dump(users), 200
 
  
# FULL CRUD on Jobs Model
class Jobs(Resource):
    @jwt_required()
    def get(self):
        jobs = Job.query.all()
        return JobSchema(many=True).dump(jobs), 200
    
    @jwt_required()
    @check_role
    def post(self):
        current_user_id = get_jwt_identity()
        
        request_json = request.get_json()
        job = Job(
            user_id = current_user_id,
            name = request_json["name"],
            customer = request_json["customer"],
            status = request_json["status"],
            payment_status = request_json["payment_status"]
        )
        try:
            db.session.add(job)
            db.session.commit()
            return JobSchema().dump(job), 201
        
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422
        
    @jwt_required()
    @check_role
    def put(self):
        request_json = request.get_json()
        job = Job.query.filter(Job.id==request_json["id"]).first()
        if not job:
            return {'error': 'Job not found.'}, 404
        
        job.name = request_json["name"]
        job.customer = request_json["customer"]
        job.status = request_json["status"]
        job.payment_status = request_json["payment_status"]

        try:
            db.session.commit()
            return JobSchema().dump(job), 200
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

    @jwt_required()
    @check_role
    def delete(self):
        request_json = request.get_json()
        job = Job.query.filter(Job.id==request_json["id"]).first()
        try:
            db.session.delete(job)
            db.session.commit()
            return {"status": "deleted"}, 200
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422
    
class JobByID(Resource):
    @jwt_required()
    def get(self, job_id):
        job = Job.query.filter(Job.id == job_id).first()
        return JobSchema().dump(job), 200

class JobMaterialUsagesByJobId(Resource):
    @jwt_required()
    def get(self, job_id):
        job_material_usages = JobMaterialUsage.query.filter(JobMaterialUsage.job_id == job_id).all()
        return JobMaterialUsageSchema(many=True).dump(job_material_usages), 200


class Materials(Resource):
    @jwt_required()
    def get(self):
        materials = Material.query.all()
        return MaterialSchema(many=True).dump(materials), 200

    @jwt_required()
    @check_role
    def post(self):
        request_json = request.get_json()
        material = Material(
            name = request_json["name"],
            sku = request_json["sku"],
            unit_measure = request_json["unit_measure"],
            distributor = request_json["distributor"],
            reorder_point = request_json["reorder_point"]
        )
        try:
            db.session.add(material)
            db.session.commit()
            return OrderJobMaterialSchema().dump(material), 201
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

    @jwt_required()
    @check_role
    def put(self):
        request_json = request.get_json()
        material = Material.query.filter(Material.id==request_json["id"]).first()
        if not material:
            return {'error': 'Material not found.'}, 404 
        material.name = request_json["name"]
        material.sku = request_json["sku"]
        material.unit_measure = request_json["unit_measure"]
        material.distributor = request_json["distributor"]
        material.reorder_point = request_json["reorder_point"]

        try:
            db.session.commit()
            return MaterialSchema().dump(material), 200
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

    @jwt_required()
    @check_role
    def delete(self):
        request_json = request.get_json()
        material = Material.query.filter(Material.id==request_json["id"]).first()
        try:
            db.session.delete(material)
            db.session.commit()
            return {"status": "deleted"}, 200
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

class MaterialTotals(Resource):
    @jwt_required()
    def get(self):
        material_totals = []


class AvailableMaterialLots(Resource):
    @jwt_required()
    def get(self):
        available_material_ids = []
        materials = Material.query.all()
        for material in materials:
            if material.is_available:
                available_material_ids.append(material.id)

        
        material_lots = MaterialLot.query.filter(MaterialLot.material_id.in_(available_material_ids)).all()
        return MaterialLotSchema(many=True).dump(material_lots), 200
             
class OrderJobMaterial(Resource):
    @jwt_required()
    @check_role
    def post(self, job_id):
        request_json = request.get_json()
        material = Material.query.filter_by(sku=request_json["sku"]).first()

        if not material:
            try:
                material = Material(
                name = request_json["name"],
                sku = request_json["sku"],
                unit_measure = request_json["unit_measure"],
                distributor = request_json["distributor"],
                reorder_point = request_json["reorder_point"]
                )
                db.session.add(material)
                db.session.flush()
            except IntegrityError:
                db.session.rollback()
                material = Material.query.filter_by(sku=request_json["sku"]).first()

        try:
            material_lot = MaterialLot(
                quantity_purchased = request_json["quantity_purchased"],
                unit_cost = request_json["unit_cost"],
                quantity_remaining = request_json["quantity_remaining"],
                material_id = material.id
            )
            db.session.add(material_lot)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()

        try:
            job_material_usage = JobMaterialUsage(
                quantity_used = request_json["quantity_used"],
                job_id = job_id,
                material_lot_id = material_lot.id
            )
            db.session.add(job_material_usage)
            db.session.flush()
        except IntegrityError:
                db.session.rollback()

        try:
            db.session.commit()
            return JobMaterialUsageSchema().dump(job_material_usage), 201
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

class OrderInventoryMaterial(Resource):
    @check_role
    @jwt_required()
    def post(self):
        request_json = request.get_json()
        material = Material.query.filter_by(sku=request_json["sku"]).first()
        if not material:
            try:
                material = Material(
                name = request_json["name"],
                sku = request_json["sku"],
                unit_measure = request_json["unit_measure"],
                distributor = request_json["distributor"],
                reorder_point = request_json["reorder_point"]
                )
                db.session.add(material)
                db.session.flush()
            except IntegrityError:
                db.session.rollback()
                material = Material.query.filter_by(sku=request_json["sku"]).first()
        try:
            material_lot = MaterialLot(
            quantity_purchased = request_json["quantity_purchased"],
            unit_cost = request_json["unit_cost"],
            quantity_remaining = request_json["quantity_remaining"],
            material_id = material.id
            )
            db.session.add(material_lot)
            db.session.flush()
        except IntegrityError:
            db.session.rollback()

        try:
            db.session.commit()
            result = {
                "material": material,
                "material_lot": material_lot
            }
            return OrderInventoryMaterialSchema().dump(result), 201
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

class UseMaterialLot(Resource):
    @jwt_required()
    def post(self, job_id):
        request_json = request.get_json()
        material_lot = MaterialLot.query.filter(MaterialLot.id==request_json["material_lot_id"]).first()
        material = Material.query.filter(Material.id==material_lot.material_id).first()
        if float(request_json["quantity_used"]) <= material_lot.quantity_remaining:
            material_lot.quantity_remaining = float(material_lot.quantity_remaining) - float(request_json["quantity_used"])
        else:
            return {'Quantity used must be smaller than or equal to Material Lot quantity remaining.'}

        job_material_usage = JobMaterialUsage(
            quantity_used = request_json["quantity_used"],
            job_id = job_id,
            material_lot_id = request_json["material_lot_id"]
        )
        try:
            db.session.add(job_material_usage)
            db.session.commit()

            return JobMaterialUsageSchema().dump(job_material_usage), 201
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

class LaborEntries(Resource):
    @jwt_required()
    def post(self):
        request_json = request.get_json()
        current_id = get_jwt_identity()
        labor_entry = LaborEntry(
            user_id = current_id,
            job_id = request_json["job_id"],
            hours = request_json["hours"],
            hourly_rate = request_json["hourly_rate"]
        )
        try:
            db.session.add(labor_entry)
            db.session.commit()
            return LaborEntrySchema().dump(labor_entry), 201
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422
        
    @jwt_required()
    def put(self):
        request_json = request.get_json()
        current_id = get_jwt_identity()
        labor_entry = LaborEntry.query.filter(LaborEntry.id==request_json["id"]).first()

        if not labor_entry:
            return {'error': 'Labor Entry not found.'}, 404
        if int(current_id) != labor_entry.user_id:
            return {'error': 'Only user who made labor entry can edit entry.'}, 403
        
        labor_entry.hours = request_json["hours"]
        labor_entry.hourly_rate = request_json["hourly_rate"]

        try:
            db.session.commit()
            return LaborEntrySchema().dump(labor_entry), 200
        
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422
        
    @jwt_required() 
    def delete(self):
        request_json = request.get_json()
        labor_entry = LaborEntry.query.get(request_json["id"])

        if not labor_entry:
            return {"errors": ["Labor entry not found"]}, 404
        try:
            db.session.delete(labor_entry)
            db.session.commit()
            return {"status": "deleted"}, 200
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

class LaborEntriesByJob(Resource):
    @jwt_required()
    def get(self, job_id):
        # request_json = request.get_json()
        labor_entries = LaborEntry.query.filter(LaborEntry.job_id==job_id).all()
        return LaborEntrySchema(many=True).dump(labor_entries), 200
     
class LaborEntryByID(Resource):
    @jwt_required()
    def get(self, labor_entry_id):
        labor_entry = LaborEntry.query.filter(LaborEntry.id==labor_entry_id).first()
        return LaborEntrySchema().dump(labor_entry), 200

# Full CRUD on Reorder Requests
class ReorderRequests(Resource):
    @jwt_required()
    def get(self):
        reorder_requests = ReorderRequest.query.all()
        return ReorderRequestSchema(many=True).dump(reorder_requests), 200

    @jwt_required()
    def post(self):
        request_json = request.get_json()
        current_id = get_jwt_identity()
        reorder_request = ReorderRequest(
            material_id = request_json["material_id"],
            user_id = current_id,
            status = request_json["status"],
            notes = request_json["notes"]
        )
        try:
            db.session.add(reorder_request)
            db.session.commit()
            return ReorderRequestSchema().dump(reorder_request), 201
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422
   
    @jwt_required() 
    def put(self):
        request_json = request.get_json()
        reorder_request = ReorderRequest.query.filter(ReorderRequest.id==request_json["id"]).first()
        if not reorder_request:
            return {'error': 'Reorder Request not found.'}, 404
        
        reorder_request.status = request_json["status"]
        reorder_request.notes = request_json["notes"]

        try:
            db.session.commit()
            return ReorderRequestSchema().dump(reorder_request), 200
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422

    @jwt_required() 
    def delete(self):
        request_json = request.get_json()
        ReorderRequest.query.filter(ReorderRequest.id==request_json["id"]).delete()
        try:
            db.session.commit()
            return {"status": "deleted"}, 200
        except IntegrityError:
            return {'errors': ['422 Unprocessable Entity']}, 422


api.add_resource(Data, '/api/data', endpoint='data')      
api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(WhoAmI, '/api/me', endpoint='me')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Users, '/api/users', endpoint='users')
api.add_resource(Jobs, '/api/jobs', endpoint='jobs')
api.add_resource(JobByID, '/api/jobs/<int:job_id>')
api.add_resource(JobMaterialUsagesByJobId, '/api/jobs/<int:job_id>/job_material_usages', endpoint='job_material_usages')
api.add_resource(Materials, '/api/materials', endpoint='materials')
api.add_resource(AvailableMaterialLots, '/api/materials/available', endpoint='available')
api.add_resource(OrderInventoryMaterial, '/api/materials/order')
api.add_resource(OrderJobMaterial, '/api/jobs/<int:job_id>/materials/order')
api.add_resource(UseMaterialLot, '/api/jobs/<int:job_id>/materials/use', endpoint='use')
api.add_resource(LaborEntries, '/api/labor_entries', endpoint='labor_entries')
api.add_resource(LaborEntriesByJob, '/api/jobs/<int:job_id>/labor_by_job', endpoint='labor_by_job')
api.add_resource(LaborEntryByID, '/api/labor_entries/<int:labor_entry_id>')
api.add_resource(ReorderRequests, '/api/reorder_requests', endpoint='reorder_requests')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
