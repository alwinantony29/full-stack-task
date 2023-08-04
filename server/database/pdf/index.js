import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
})

const PdfModel = mongoose.model("pdf", pdfSchema)
export default PdfModel

