import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    imageUrl: { type: String, required: true },
    rating: { type: Number, required: true },
    reviews: { type: Number, required: true },
    description: { type: String, required: true },
    categories: [{ type: String, required: true }],
    priceRange: { type: String, required: true },
    openingHours: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Restaurant || mongoose.model('Restaurant', RestaurantSchema);