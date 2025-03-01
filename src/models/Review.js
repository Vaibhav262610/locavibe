import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    group: { type: String },
    reviewText: { type: String, required: true },
    titleText: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
