import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).send('Non autorisé');

    const token = authHeader.split(' ')[1]; // format "Bearer <token>"

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = payload.userId; // récupère l'ID pour la route
        next();
    } catch (err) {
        res.status(401).send('Token invalide ou expiré');
    }
}