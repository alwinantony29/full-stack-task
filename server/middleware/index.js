import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']
    if (!token) {
        return res.status(401).json({ message: 'Seems like you are not logged In' });
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




export { verifyToken }