import mongoose from 'mongoose';

const cautiooSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    description: {
        type: String,
        required: false,
        trim: true,
        maxlength: 500
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        default: ''
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        likedAt: {
            type: Date,
            default: Date.now
        }
    }],
    views: {
        type: Number,
        default: 0
    },
    duration: {
        type: Number, 
        required: false
    },
    tags: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

cautiooSchema.index({ doctor: 1, createdAt: -1 });
cautiooSchema.index({ createdAt: -1 });
cautiooSchema.index({ 'likes.user': 1 });

cautiooSchema.virtual('likesCount').get(function() {
    return this.likes.length;
});

cautiooSchema.set('toJSON', {
    virtuals: true
});

const Cautioo = mongoose.model('Cautioo', cautiooSchema);

export default Cautioo;
