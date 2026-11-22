import jwt from "jsonwebtoken";
import { User } from '../models/user.model.js';

const isAuthenticated = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            })
        }
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if(!decode){
            return res.status(401).json({
                message:"Invalid token",
                success:false
            })
        };
        req.id = decode.userId;
        const user = await User.findById(req.id).select('+tokenVersion');
        if (!user || (decode.tokenVersion || 0) !== (user.tokenVersion || 0)) {
            return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
        }
        req.role = user.role;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Session expired. Please sign in again.' });
    }
}
export default isAuthenticated;
