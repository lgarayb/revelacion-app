import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  packageId: String, clientInfo: Object, eventDate: Date, totalAmount: Number, advanceAmount: Number, paymentStatus: String, paymentProvider: String, paymentIntentId: String
});
export default mongoose.models.Booking || mongoose.model('Booking', schema);
