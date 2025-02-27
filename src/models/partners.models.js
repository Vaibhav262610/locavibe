import mongoose from "mongoose";

const PartnerSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // 🔗 Reference Event
    name: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, required: true },
});

export default mongoose.models.Partners || mongoose.model("Partners", PartnerSchema);
