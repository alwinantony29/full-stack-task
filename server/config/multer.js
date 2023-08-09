import multer from "multer"
import path from 'path'

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

const fileFilter = (req, file, cb) => {
    // Specify which file types are allowed
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 25, // Limit file size to 25 MB
    },
});
export { upload }