import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    age: {
        type: Number,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    mode: {
        type: String,
        enum: ["online", "offline", "both"],
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    followers: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        followedAt: {
            type: Date,
            default: Date.now
        }
    }],
    cautiooCount: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

doctorSchema.virtual('followersCount').get(function() {
    return this.followers.length;
});

doctorSchema.set('toJSON', {
    virtuals: true
});

const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
