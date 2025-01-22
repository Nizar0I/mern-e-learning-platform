const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  courseId: { type: Schema.Types.ObjectId, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'USD' },
  status: { type: String, enum: ['pending', 'paid', 'cancelled'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);
