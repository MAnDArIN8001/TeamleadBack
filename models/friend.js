import mongoose from 'mongoose';

const FriendSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    avatarUrl: String,   
}, {
    timestamps: true,
});

export default mongoose.model('friend', FriendSchema);