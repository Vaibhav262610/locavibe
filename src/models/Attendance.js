import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
    studentId: { type: String, required: true, unique: true },
    attended: { type: Boolean, default: false },
    generatedAt: { type: Date, default: Date.now }, // ✅ Stores the generation time
});

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);