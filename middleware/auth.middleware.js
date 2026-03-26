const AuthMiddleware = (req, res, next) => {
    console.log('Hello from Auth Middleware')
    next();
}

module.exports = AuthMiddleware;