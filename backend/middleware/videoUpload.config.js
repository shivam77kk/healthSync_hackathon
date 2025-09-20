import multer from 'multer';

const storage = multer.memoryStorage();

export const videoUpload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit for videos
    },
    fileFilter: (req, file, cb) => {
        // Allow video files
        const allowedVideoTypes = [
            'video/mp4', 
            'video/mpeg', 
            'video/quicktime', 
            'video/x-msvideo', 
            'video/x-ms-wmv',
            'video/webm'
        ];
        
        if (allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only video files (MP4, MPEG, MOV, AVI, WMV, WEBM) are allowed!'), false);
        }
    }
});

// Separate middleware for thumbnail uploads (optional)
export const thumbnailUpload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit for thumbnails
    },
    fileFilter: (req, file, cb) => {
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        
        if (allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files (JPEG, PNG, JPG, WEBP) are allowed for thumbnails!'), false);
        }
    }
});

// Combined upload for video and thumbnail
export const cautiooUpload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedVideoTypes = [
            'video/mp4', 
            'video/mpeg', 
            'video/quicktime', 
            'video/x-msvideo', 
            'video/x-ms-wmv',
            'video/webm'
        ];
        const allowedImageTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        
        if (file.fieldname === 'video' && allowedVideoTypes.includes(file.mimetype)) {
            cb(null, true);
        } else if (file.fieldname === 'thumbnail' && allowedImageTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type for the specified field!'), false);
        }
    }
});
