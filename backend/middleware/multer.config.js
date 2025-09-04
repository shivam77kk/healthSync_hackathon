import multer from 'multer';

const storage = multer.memoryStorage();

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, JPG, and PDF files are allowed!'), false);
        }
        cb(null, true);
    }
});