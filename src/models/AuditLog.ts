import { Schema, model, models } from 'mongoose';

const AuditLogSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'Employee', required: true },
  userEmail: { type: String, required: true },
  action: { type: String, required: true },
  details: { type: String },
  ipAddress: { type: String },
  timestamp: { type: Date, default: Date.now },
}, { timestamps: true });

const AuditLog = models.AuditLog || model('AuditLog', AuditLogSchema);
export default AuditLog;
