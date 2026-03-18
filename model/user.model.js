const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    fullName: {
        type: String,
        trim: true,
        required: true,
        lowercase: true,
    },
    mobile: {
        type: String,
        trim: true,
        required: true,
        match: [
            '/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/',
            'Invalid Email Address'
        ]
    },
    password: {
        type: String,
        trim: true,
        
    }
}, {timestamps: true})

const userModel = model('User', userSchema);

module.exports = userModel;