const mongoose = require('mongoose')

const verifySchema = new mongoose.Schema({
    email: {type: String, unique: true},
    verificationCode: {type: String, unique: true},
});

const VerifyModel = mongoose.model('Verification',verifySchema)

module.exports= VerifyModel