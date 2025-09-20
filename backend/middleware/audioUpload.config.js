import multer from 'multer';

const storage = multer.memoryStorage();

export const audioUpload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit for audio files
    },
    fileFilter: (req, file, cb) => {
        // Allow audio files
        const allowedAudioTypes = [
            'audio/mpeg',     // MP3
            'audio/wav',      // WAV
            'audio/webm',     // WebM
            'audio/ogg',      // OGG
            'audio/mp4',      // M4A
            'audio/aac',      // AAC
            'audio/flac',     // FLAC
            'audio/x-wav',    // WAV alternative
            'audio/x-mpeg'    // MP3 alternative
        ];
        
        if (allowedAudioTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid audio format. Allowed formats: ${allowedAudioTypes.join(', ')}`), false);
        }
    }
});

// Middleware specifically for voice prescription uploads
export const voicePrescriptionUpload = multer({
    storage: storage,
    limits: {
        fileSize: 25 * 1024 * 1024, // 25MB limit for voice prescriptions
        files: 1 // Only one audio file per prescription
    },
    fileFilter: (req, file, cb) => {
        // More restrictive for voice prescriptions
        const allowedFormats = [
            'audio/mpeg',     // MP3
            'audio/wav',      // WAV  
            'audio/webm',     // WebM
            'audio/mp4'       // M4A
        ];
        
        if (file.fieldname !== 'audio') {
            return cb(new Error('Field name must be "audio"'), false);
        }
        
        if (!allowedFormats.includes(file.mimetype)) {
            return cb(new Error('Only MP3, WAV, WebM, and M4A audio files are allowed for voice prescriptions!'), false);
        }
        
        cb(null, true);
    }
});

// Error handling for audio uploads
export const handleAudioUploadError = (error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
            message: 'Audio file too large. Maximum allowed size is 25MB for voice prescriptions.',
            error: 'FILE_TOO_LARGE'
        });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ 
            message: 'Too many files. Only one audio file is allowed per voice prescription.',
            error: 'TOO_MANY_FILES'
        });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ 
            message: 'Unexpected field name. Use "audio" as the field name.',
            error: 'INVALID_FIELD_NAME'
        });
    } else if (error.message) {
        return res.status(400).json({ 
            message: error.message,
            error: 'VALIDATION_ERROR'
        });
    }
    next(error);
};
