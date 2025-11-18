import jwt from "jsonwebtoken";


export default function authMiddleware(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send("Non autorisé");
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
        next();
    } catch (err) {
        res.status(401).send("Token invalide ou expiré");
    }
}


//Optionnel pour quand user pas encore log
export function authMiddlewareOptional(req, res, next) {
    const token = req.cookies.token;
    if (!token) {
        req.userId = null;
        return next();     
    }
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId;
    } catch (err) {
        req.userId = null; 
    }
    next();
}
