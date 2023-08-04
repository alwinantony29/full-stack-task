import express from "express";
const Router = express.Router()
import multer from 'multer'
import path from 'path'
import PdfModel from "../../database/pdf/index.js";
import { verifyToken } from "../../middleware/index.js";
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

Router.get("/:pdfID", (req, res) => {

    console.log(req.params.pdfID);
    console.log("get api")
    res.send("hai bro")

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