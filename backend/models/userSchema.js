import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: false, 
        validate: {
            validator: function (value) {
                return value ? value.length >= 8 : true;
            },
            message: 'Password must be at least 8 characters long'
        },
        select: false
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'Age cannot be negative'],
        max: [150, 'Age is invalid']
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        trim: true,
        default: 'Other'
    },
    profileImage: {
        type: String,
        default: ''
    },
    refreshToken: {
        type: String
    },
    bloodGroup: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        required: true
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true
    },
    following: [{
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }],
    likedCautioos: [{
        cautioo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cautioo',
            required: true
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;