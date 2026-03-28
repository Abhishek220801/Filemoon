const jwt = require('jsonwebtoken');

const AuthMiddleware = (req, res, next) => {
    try {
        const {authorization} = req.headers;
    
        if(!authorization)
            return res.status(401).json({message: 'Invalid request'})
        
        const [type, token] = authorization.split(" ");
    
        if(type !== 'Bearer')
            return res.status(401).json({message: 'Invalid request'})
    
        const user = jwt.verify(token, process.env.JWT_SECRET);
        req.user = user;
        
        next();

    } catch (err) {
        res.status(401).json({message: 'Invalid request'});
    }
}

module.exports = AuthMiddleware;