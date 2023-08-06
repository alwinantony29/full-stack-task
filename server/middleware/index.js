import jwt from "jsonwebtoken";
import multer from 'multer'
import path from 'path'

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(token.split(' ')[1], process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            console.log("token verification error: ", token);
            return res.status(401).json({ message: 'Invalid token' });
        }
        // Saving the decoded information to the request object
        req.user = decoded;
        next();
    })
}

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


export {verifyToken,upload}