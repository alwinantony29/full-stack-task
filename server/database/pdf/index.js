import mongoose from "mongoose";

const pdfSchema = new mongoose.Schema({
    fileName: { type: String, required: true },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "Users" },
})

export const PdfModel = mongoose.model("pdf", pdfSchema)


