import { Schema, model, models } from 'mongoose';

const EmployeeSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  department: { 
    type: String, 
    required: true,
    enum: ['HR', 'Finance', 'Sales', 'IT', 'Admin']
  },
  position: { type: String, required: true },
  salary: { type: Number, required: true },
  joiningDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['Active', 'On Leave', 'Resigned'], default: 'Active' },
  role: { type: String, enum: ['admin', 'manager', 'employee'], default: 'employee' },
  permissions: { type: [String], default: [] },
}, { timestamps: true });

const Employee = models.Employee || model('Employee', EmployeeSchema);
export default Employee;
