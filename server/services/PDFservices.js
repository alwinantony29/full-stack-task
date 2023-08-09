import PdfModel from "../database/pdf/index.js";
import { PDFDocument } from "pdf-lib";
import fs from 'fs';
import path from 'path';
import mongoose from "mongoose";

export async function getPdfPath(pdfID) {

    if (!mongoose.Types.ObjectId.isValid(pdfID)) {
        return null
    }
    try {
        const result = await PdfModel.findById(pdfID);
        if (!result) {
            return null;
        }
        const filePath = path.join('uploads', result.fileName);

        if (fs.existsSync(filePath)) {
            return filePath;
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function manipulatePdf(pdfID, selectedPages) {
    try {
        const filePath = await getPdfPath(pdfID);

        if (!filePath) return null;

        // Saving the new PDF to a buffer
        const pdfBuffer = fs.readFileSync(filePath);
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        const newPdfDoc = await PDFDocument.create();

        // Looping through the selected pages and copying them to the new PDF
        for (const pageNum of selectedPages) {
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]);
            newPdfDoc.addPage(copiedPage);
        }

        const pdfBytes = await newPdfDoc.save();
        return pdfBytes;

    } catch (error) {
        console.log(error);
        throw error;
    }
}