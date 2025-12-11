import mongoose from 'mongoose';

const FoodPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const FoodPreference = mongoose.model('FoodPreference', FoodPreferenceSchema);
export default FoodPreference;