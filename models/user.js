import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    avatarUrl: String,
    friends: [],
    groups: [],
    isAuth: false,   
}, {
    timestamps: true,

});

export default mongoose.model('user', UserSchema);