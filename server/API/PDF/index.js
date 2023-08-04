import express from "express";
const Router=express.Router()
import multer from 'multer'

// Configuring Multer to handle file uploads
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

Router.get("/:pdfID",(req,res)=>{

    console.log(req.params.pdfID);
    console.log("get api")
    res.send("hai bro")
    
})
// 
Router.post("/",upload.single('pdfFile'),(req,res)=>{
    if (req.file) {
        console.log("file nd");
        console.log(req.file);
    }
    res.send("hai bro")
    console.log("post api")

})

export default Router