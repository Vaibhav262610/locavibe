import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    about: { type: String, required: true },
    participants: { type: String, required: true },
    minTeamSize: { type: String, required: true },
    maxTeamSize: { type: String, required: true },
    status: { type: String, required: true },
    location: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    faqs: [{ type: mongoose.Schema.Types.ObjectId, ref: "FAQ" }],
    partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Partners" }],
    prizes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Prizes" }],
    // partners: [{ type: mongoose.Schema.Types.ObjectId, ref: "Partners" }]
});

export default mongoose.models.Event || mongoose.model("Event", EventSchema);
