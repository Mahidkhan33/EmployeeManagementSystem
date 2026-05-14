import { Schema, model, models } from 'mongoose';

const SalaryRecordSchema = new Schema({
  employeeId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  employeeName: { type: String, required: true },
  amount: { type: Number, required: true },
  paymentDate: { type: Date, default: Date.now },
  month: { type: String, required: true }, // e.g., "May 2026"
  method: { type: String, default: 'Bank Transfer' },
  status: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Paid' }
}, { timestamps: true });

const SalaryRecord = models.SalaryRecord || model('SalaryRecord', SalaryRecordSchema);
export default SalaryRecord;
