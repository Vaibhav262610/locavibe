import mongoose from 'mongoose';

const SavedSchema = new mongoose.Schema({
    profileId: { 
        type: String, 
        required: true, // ensures profileId is always provided
    },
    reviewId: { 
        type: String, 
        required: true, // ensures reviewId is always provided
    },
});

const Saved = mongoose.models.Saved || mongoose.model('Saved', SavedSchema);

export default Saved;
