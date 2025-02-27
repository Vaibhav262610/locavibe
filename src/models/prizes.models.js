import mongoose from "mongoose";

const PrizesSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // 🔗 Reference Event
    title: { type: String, required: true },
    amount: { type: String, required: true },
    winners: { type: String, required: true },
    description: { type: String, required: true },
});

export default mongoose.models.Prizes || mongoose.model("Prizes", PrizesSchema);
