import { Schema, model, models } from 'mongoose';

const DepartmentSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  head: { type: String },
  employeeCount: { type: Number, default: 0 },
}, { timestamps: true });

const Department = models.Department || model('Department', DepartmentSchema);
export default Department;
