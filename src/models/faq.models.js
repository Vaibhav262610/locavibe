import mongoose from "mongoose";

const FAQSchema = new mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true }, // 🔗 Reference Event
    question: { type: String, required: true },
    answer: { type: String, required: true }
});

export default mongoose.models.FAQ || mongoose.model("FAQ", FAQSchema);
