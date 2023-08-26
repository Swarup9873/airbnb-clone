const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
    place: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'Place'},
    user: {type:mongoose.Schema.Types.ObjectId, required:true, ref:'User'},
    checkIn: {type:Date, required: true},
    checkOut: {type:Date, required: true},
    numberOfGuests: {type:Number, required: true},
    price: Number
})

const BookingModel = mongoose.model('Booking', bookingSchema)

module.exports= BookingModel;