import express from "express";
import { UserModel } from "../../database/user/index.js";
import jwt from "jsonwebtoken";
const Router = express.Router()


Router.post("/signin", async (req, res) => {
    try {
        const { email } = req.body.credentials
        let user = await UserModel.findOne({ email });
        if (user) {
            console.log("user found");
        } else {
            const { firstName, lastName } = req.body.credentials
            console.log("no user found, creating new user!");
            user = new UserModel({ email, firstName, lastName })
            await user.save()
        }
        const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_KEY);
        res.json({ token, user })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Internal server error : ' + err.message })
    }
})

export default Router
