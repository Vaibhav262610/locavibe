import mongoose from 'mongoose';

const SavedSchema = new mongoose.Schema({
    profileId: { type: String, required: true },
    ReviewId: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Saved || mongoose.model('Saved', SavedSchema);