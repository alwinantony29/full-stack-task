import express from "express";
const Router=express.Router()

Router.get("/:pdfID",(req,res)=>{

    console.log(req.params.pdfID);
    console.log("get api")
    res.send("hai bro")
    
})

Router.post("/",(req,res)=>{
    
    res.send("hai bro")
    console.log("post api")

})

export default Router