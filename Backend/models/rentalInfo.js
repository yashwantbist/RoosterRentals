import mongoose from "mongoose";


const rentalInfo = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
    picture: [String],
    location: String,
    roomDetails: {
        bedroom: String,
        furnished: Boolean,
    },
    amenities: {
        ac: Boolean,
        wifi: Boolean,
        heat: Boolean,
        parking: Boolean,
        laundary: Boolean,
    },
    price: Number,
    tenantRequirements: {
        firstAndLast: Boolean,
        petFriendly: Boolean,
        securityDeposit: Number,
    },
    bookingAvailability: Boolean,
    commentsAndReviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref:"User"},
        comment: String,
        rating: Number
    }],
    sharing: Boolean
})

export default mongoose.model('rentalInfo', rentalInfo)


