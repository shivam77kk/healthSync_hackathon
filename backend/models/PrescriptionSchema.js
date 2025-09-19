import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'voice', 'mixed'],
        default: 'text'
    },
    // Voice prescription specific fields
    audioUrl: {
        type: String,
        required: function() { return this.type === 'voice' || this.type === 'mixed'; }
    },
    transcript: {
        type: String,
        required: function() { return this.type === 'voice' || this.type === 'mixed'; }
    },
    transcriptionConfidence: {
        type: Number,
        min: 0,
        max: 1
    },
    // Traditional prescription fields
    medications: [{ 
        name: { type: String, required: true },
        dosage: { type: String, required: true },
        frequency: { type: String, required: true },
        duration: { type: String, required: true },
        instructions: { type: String },
        route: { type: String } // oral, topical, etc.
    }],
    diagnosis: {
        type: String,
        trim: true
    },
    symptoms: {
        type: String,
        trim: true
    },
    recommendations: [String],
    notes: { 
        type: String,
        trim: true
    },
    // Status and delivery
    status: {
        type: String,
        enum: ['draft', 'sent', 'received', 'acknowledged'],
        default: 'draft'
    },
    priority: {
        type: String,
        enum: ['low', 'normal', 'high', 'urgent'],
        default: 'normal'
    },
    expiresAt: {
        type: Date
    },
    acknowledgedAt: {
        type: Date
    },
    // Metadata
    audioMetadata: {
        duration: Number, // in seconds
        format: String,
        size: Number // in bytes
    }
}, { timestamps: true });

// Indexes for better query performance
prescriptionSchema.index({ patient: 1, createdAt: -1 });
prescriptionSchema.index({ doctor: 1, createdAt: -1 });
prescriptionSchema.index({ status: 1 });
prescriptionSchema.index({ type: 1 });
prescriptionSchema.index({ priority: 1, createdAt: -1 });

// Virtual for prescription ID display
prescriptionSchema.virtual('prescriptionId').get(function() {
    return `RX-${this._id.toString().slice(-6).toUpperCase()}`;
});

// Method to check if prescription is expired
prescriptionSchema.methods.isExpired = function() {
    return this.expiresAt && new Date() > this.expiresAt;
};

// Method to acknowledge prescription
prescriptionSchema.methods.acknowledge = function() {
    this.status = 'acknowledged';
    this.acknowledgedAt = new Date();
    return this.save();
};

// Ensure virtual fields are serialized
prescriptionSchema.set('toJSON', {
    virtuals: true
});

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
