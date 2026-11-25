import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: String, basePrice: Number, description: String, isActive: { type: Boolean, default: true }, media: Array
});
export default mongoose.models.Package || mongoose.model('Package', schema);
