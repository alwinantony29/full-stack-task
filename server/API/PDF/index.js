import express from "express";
const Router = express.Router()
import path from 'path'
import PdfModel from "../../database/pdf/index.js";
import { upload, verifyToken } from "../../middleware/index.js";
import fs from 'fs'
import { PDFDocument, rgb } from "pdf-lib";
import { Readable } from 'stream'


Router.get("/",verifyToken, async(req, res) => {
    try{
            const result= await PdfModel.find({userID:req.user._id})
            res.json({result})

    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal server error : ' + error.message })
    }
})

Router.get("/:pdfID", async (req, res) => {

    const pdfID = req.params.pdfID
    console.log("pdf id from params : ", pdfID);
    try {
        const result = await PdfModel.findById(pdfID)
        console.log("result from db : ", result)
        if (!result) {
            return res.status(404).json({ message: " File not found !" })
        }
        const filePath = path.join('uploads', result.fileName);
        // Checking if the file exists or not
        if (fs.existsSync(filePath)) {
            console.log("file found");
            // setting the appropriate Content-Type for PDF
            res.setHeader('Content-Type', 'application/blob');
            // Streaming the file to the response
            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
        } else {
            res.status(404).json({ message: 'PDF file not found.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error : ' + error.message })
    }
})
Router.post("/:pdfID", async (req, res) => {
    const selectedPages = req.body.selectedPages;
    if (!selectedPages.length > 0) {
        return res.status(400).json({ message: "Select atleast one page" })
    }
    const pdfID = req.params.pdfID
    console.log(selectedPages, pdfID);
    try {
        const result = await PdfModel.findById(pdfID)
        console.log("result from db : ", result)
        if (!result) {
            return res.status(404).json({ message: " File not found !" })
        }
        // Loading the uploaded PDF file
        const pdfBuffer = fs.readFileSync('uploads/' + result.fileName);
        const pdfDoc = await PDFDocument.load(pdfBuffer);

        // Creating a new PDF document to store selected pages
        const newPdfDoc = await PDFDocument.create();

        // Looping through the selected pages and copying them to the new PDF
        for (const pageNum of selectedPages) {
            const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageNum - 1]); // pageNum - 1 to get the zero-based index
            newPdfDoc.addPage(copiedPage);
        }

        // Saving the new PDF to a buffer
        const pdfBytes = await newPdfDoc.save();

        // Set the content type of the response to 'application/pdf'
        res.setHeader('Content-Type', 'application/pdf');

        // Set the filename for the response (optional)
        res.setHeader('Content-Disposition', 'attachment; filename="new-' + result.fileName + '"');

        // Createing a custom Readable stream and pushing the pdfBytes data in chunks manually
        const pdfStream = new Readable();
        pdfStream._read = () => { };
        pdfStream.push(pdfBytes);
        pdfStream.push(null); // Signal the end of the stream
        pdfStream.pipe(res);

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
    console.log(req.file);
    const { originalname, filename } = req.file
    try {
        const file = new PdfModel({ originalName: originalname, fileName: filename, userID: req.user._id })
        await file.save()
        console.log("saved",file);
        res.json({ message: 'PDF file uploaded successfully.',file });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error : ' + err.message })
    }
})

export default Router