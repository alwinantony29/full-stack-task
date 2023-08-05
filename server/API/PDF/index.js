import express from "express";
const Router = express.Router()
import multer from 'multer'
import path from 'path'
import PdfModel from "../../database/pdf/index.js";
import { verifyToken } from "../../middleware/index.js";
import fs from 'fs'

// Configuring Multer to handle file uploads
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(file.originalname);
        const originalFilenameWithoutExtension = path.parse(file.originalname).name;
        const customFilename = originalFilenameWithoutExtension + '-' + uniqueSuffix + extension;
        cb(null, customFilename);
    },
})
const upload = multer({ storage });

Router.get("/", (req, res) => {
    res.send("hi")
})

Router.get("/:pdfID", async (req, res) => {

    const pdfID = req.params.pdfID
    console.log("pdf id from params : ", pdfID);
    try {
        const result = await PdfModel.findById(pdfID)
        console.log("result from db : ", result)
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
            res.status(404).json({ error: 'PDF file not found.' });
        }
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
    console.log("file nd");
    console.log(req.file);
    const { originalname, filename } = req.file
    try {
        const file = new PdfModel({ originalName: originalname, fileName: filename, userID: req.user._id })
        await file.save()
        res.json({ message: 'PDF file uploaded successfully.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error : ' + err.message })
    }
})

export default Router