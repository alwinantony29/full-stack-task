import express from "express";
const Router = express.Router()
import PdfModel from "../../database/pdf/index.js";
import { verifyToken } from "../../middleware/index.js";
import fs from 'fs'
import { Readable } from 'stream'
import { getPdfPath, manipulatePdf } from "../../services/PDFservices.js";
import multer from "multer";
import { upload } from "../../config/multer.js";


Router.get("/", verifyToken, async (req, res) => {
    try {
        const result = await PdfModel.find({ userID: req.user._id })
        res.json({ result })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error : ' + error.message })
    }
})

Router.post("/", verifyToken, upload.single('pdfFile'), async (req, res) => {
    if (!req.file) {
        console.log("No PDF file uploaded.");
        return res.status(400).json({ message: 'No PDF file uploaded.' });
    }
    const { originalname, filename } = req.file
    try {
        const file = new PdfModel({ originalName: originalname, fileName: filename, userID: req.user._id })
        await file.save()
        res.json({ message: 'PDF file uploaded successfully.', file });
    } catch (error) {
        console.log(error);
        if (error instanceof multer.MulterError) {
            return res.status(400).json({ message: 'File upload error: ' + error.message });
        }
        res.status(500).json({ message: 'Internal server error : ' + err.message })
    }
})

Router.get("/:pdfID", verifyToken, async (req, res) => {

    const pdfID = req.params.pdfID

    try {
        const filePath = await getPdfPath(pdfID)
        // Checking if the file exists or not
        if (!filePath) {
            return res.status(404).json({ message: "File not found!" });
        }
        // setting the appropriate Content-Type for PDF
        res.setHeader('Content-Type', 'application/blob');

        // Streaming the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error : ' + error.message })
    }
})

Router.post("/:pdfID", verifyToken, async (req, res) => {

    const pdfID = req.params.pdfID
    const selectedPages = req.body.selectedPages;

    if (selectedPages.length < 1) {
        return res.status(400).json({ message: "Select atleast one page" })
    }
    try {

        const pdfBytes = await manipulatePdf(pdfID, selectedPages);
        if (!pdfBytes) {
            return res.status(404).json({ message: "File not found!" });
        }
        res.setHeader('Content-Type', 'application/pdf');

        // Creating a custom Readable stream and pushing the pdfBytes data in chunks manually
        const pdfStream = new Readable();
        pdfStream._read = () => { };
        pdfStream.push(pdfBytes);
        pdfStream.push(null); // Signals the end of the stream
        pdfStream.pipe(res);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error : ' + error.message })
    }
})


export default Router