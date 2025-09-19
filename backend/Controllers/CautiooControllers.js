import Cautioo from '../models/CautiooSchema.js';
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';
import cloudinary from '../config/cloudinary.config.js';

const uploadVideoToCloudinary = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "video",
                public_id: `cautioo_videos/${fileName}`,
                format: "mp4",
                quality: "auto",
                fetch_format: "auto"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(fileBuffer);
    });
};

const uploadThumbnailToCloudinary = async (fileBuffer, fileName) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                resource_type: "image",
                public_id: `cautioo_thumbnails/${fileName}`,
                format: "jpg",
                quality: "auto",
                fetch_format: "auto"
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        stream.end(fileBuffer);
    });
};

export const createCautioo = async (req, res) => {
    try {
        const { title, description, tags, duration } = req.body;
        const doctorId = req.user.id;

        if (!title || !req.files || !req.files.video) {
            return res.status(400).json({ 
                message: "Title and video are required" 
            });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const videoFile = req.files.video[0];
        const videoFileName = `${doctorId}_${Date.now()}_video`;
        const videoResult = await uploadVideoToCloudinary(videoFile.buffer, videoFileName);

        let thumbnailUrl = '';
        if (req.files.thumbnail && req.files.thumbnail[0]) {
            const thumbnailFile = req.files.thumbnail[0];
            const thumbnailFileName = `${doctorId}_${Date.now()}_thumbnail`;
            const thumbnailResult = await uploadThumbnailToCloudinary(thumbnailFile.buffer, thumbnailFileName);
            thumbnailUrl = thumbnailResult.secure_url;
        }

        let parsedTags = [];
        if (tags) {
            if (typeof tags === 'string') {
                parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            } else if (Array.isArray(tags)) {
                parsedTags = tags;
            }
        }

        const cautioo = new Cautioo({
            title: title.trim(),
            description: description?.trim() || '',
            videoUrl: videoResult.secure_url,
            thumbnail: thumbnailUrl,
            doctor: doctorId,
            tags: parsedTags,
            duration: duration ? parseInt(duration) : undefined
        });

        await cautioo.save();

        await Doctor.findByIdAndUpdate(doctorId, { 
            $inc: { cautiooCount: 1 } 
        });

        await cautioo.populate('doctor', 'name email profileImage experience');

        res.status(201).json({
            message: "Cautioo created successfully",
            cautioo
        });

    } catch (error) {
        console.error('Create Cautioo Error:', error);
        res.status(500).json({ 
            message: "Failed to create cautioo", 
            error: error.message 
        });
    }
};

export const getAllCautioos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const cautioos = await Cautioo.find({ isActive: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('doctor', 'name email profileImage experience followersCount')
            .lean();

    
        if (req.user && req.user.id) {
            const user = await User.findById(req.user.id).select('likedCautioos');
            const likedCautiooIds = user?.likedCautioos.map(item => item.cautioo.toString()) || [];
            
            cautioos.forEach(cautioo => {
                cautioo.isLiked = likedCautiooIds.includes(cautioo._id.toString());
            });
        }

        const total = await Cautioo.countDocuments({ isActive: true });
        const totalPages = Math.ceil(total / limit);

        res.json({
            cautioos,
            pagination: {
                currentPage: page,
                totalPages,
                totalCautioos: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get All Cautioos Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch cautioos", 
            error: error.message 
        });
    }
};

export const getFollowingCautioos = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId).select('following');
        if (!user || !user.following.length) {
            return res.json({
                cautioos: [],
                pagination: {
                    currentPage: page,
                    totalPages: 0,
                    totalCautioos: 0,
                    hasNext: false,
                    hasPrev: false
                }
            });
        }

        const followedDoctorIds = user.following.map(item => item.doctor);

        const cautioos = await Cautioo.find({ 
            doctor: { $in: followedDoctorIds }, 
            isActive: true 
        })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('doctor', 'name email profileImage experience followersCount')
            .lean();

        const likedCautiooIds = user.likedCautioos?.map(item => item.cautioo.toString()) || [];
        cautioos.forEach(cautioo => {
            cautioo.isLiked = likedCautiooIds.includes(cautioo._id.toString());
        });

        const total = await Cautioo.countDocuments({ 
            doctor: { $in: followedDoctorIds }, 
            isActive: true 
        });
        const totalPages = Math.ceil(total / limit);

        res.json({
            cautioos,
            pagination: {
                currentPage: page,
                totalPages,
                totalCautioos: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get Following Cautioos Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch following cautioos", 
            error: error.message 
        });
    }
};

export const getDoctorCautioos = async (req, res) => {
    try {
        const doctorId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const cautioos = await Cautioo.find({ doctor: doctorId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('doctor', 'name email profileImage experience followersCount')
            .lean();

        const total = await Cautioo.countDocuments({ doctor: doctorId });
        const totalPages = Math.ceil(total / limit);

        res.json({
            cautioos,
            pagination: {
                currentPage: page,
                totalPages,
                totalCautioos: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get Doctor Cautioos Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch doctor cautioos", 
            error: error.message 
        });
    }
};

export const getCautiooById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const cautioo = await Cautioo.findByIdAndUpdate(
            id,
            { $inc: { views: 1 } }, // Increment view count
            { new: true }
        ).populate('doctor', 'name email profileImage experience followersCount');

        if (!cautioo) {
            return res.status(404).json({ message: "Cautioo not found" });
        }

        let isLiked = false;
        if (req.user && req.user.id) {
            const user = await User.findById(req.user.id).select('likedCautioos');
            isLiked = user?.likedCautioos?.some(item => item.cautioo.toString() === id) || false;
        }

        res.json({
            ...cautioo.toJSON(),
            isLiked
        });

    } catch (error) {
        console.error('Get Cautioo By ID Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch cautioo", 
            error: error.message 
        });
    }
};

export const toggleLikeCautioo = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const cautioo = await Cautioo.findById(id);
        if (!cautioo) {
            return res.status(404).json({ message: "Cautioo not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const likedIndex = cautioo.likes.findIndex(like => like.user.toString() === userId);
        const userLikedIndex = user.likedCautioos.findIndex(item => item.cautioo.toString() === id);

        if (likedIndex > -1) {
            cautioo.likes.splice(likedIndex, 1);
            if (userLikedIndex > -1) {
                user.likedCautioos.splice(userLikedIndex, 1);
            }
        } else {
            cautioo.likes.push({ user: userId });
            user.likedCautioos.push({ cautioo: id });
        }

        await cautioo.save();
        await user.save();

        res.json({
            message: likedIndex > -1 ? "Cautioo unliked" : "Cautioo liked",
            isLiked: likedIndex === -1,
            likesCount: cautioo.likes.length
        });

    } catch (error) {
        console.error('Toggle Like Cautioo Error:', error);
        res.status(500).json({ 
            message: "Failed to toggle like", 
            error: error.message 
        });
    }
};

export const toggleFollowDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const userId = req.user.id;

        if (doctorId === userId) {
            return res.status(400).json({ message: "Cannot follow yourself" });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followingIndex = user.following.findIndex(follow => follow.doctor.toString() === doctorId);
        const followerIndex = doctor.followers.findIndex(follower => follower.user.toString() === userId);

        if (followingIndex > -1) {
            user.following.splice(followingIndex, 1);
            if (followerIndex > -1) {
                doctor.followers.splice(followerIndex, 1);
            }
        } else {
            user.following.push({ doctor: doctorId });
            doctor.followers.push({ user: userId });
        }

        await user.save();
        await doctor.save();

        res.json({
            message: followingIndex > -1 ? "Doctor unfollowed" : "Doctor followed",
            isFollowing: followingIndex === -1,
            followersCount: doctor.followers.length
        });

    } catch (error) {
        console.error('Toggle Follow Doctor Error:', error);
        res.status(500).json({ 
            message: "Failed to toggle follow", 
            error: error.message 
        });
    }
};

export const getFollowedDoctors = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId)
            .populate('following.doctor', 'name email profileImage experience followersCount cautiooCount')
            .select('following');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const followedDoctors = user.following.map(item => ({
            ...item.doctor.toJSON(),
            followedAt: item.followedAt
        }));

        res.json({ followedDoctors });

    } catch (error) {
        console.error('Get Followed Doctors Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch followed doctors", 
            error: error.message 
        });
    }
};

export const getUserLikedCautioos = async (req, res) => {
    try {
        const userId = req.user.id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findById(userId)
            .populate({
                path: 'likedCautioos.cautioo',
                populate: {
                    path: 'doctor',
                    select: 'name email profileImage experience followersCount'
                }
            })
            .select('likedCautioos');

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const validLikedCautioos = user.likedCautioos.filter(item => item.cautioo);
        
        const paginatedCautioos = validLikedCautioos
            .slice(skip, skip + limit)
            .map(item => ({
                ...item.cautioo.toJSON(),
                likedAt: item.likedAt,
                isLiked: true
            }));

        const total = validLikedCautioos.length;
        const totalPages = Math.ceil(total / limit);

        res.json({
            cautioos: paginatedCautioos,
            pagination: {
                currentPage: page,
                totalPages,
                totalCautioos: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Get User Liked Cautioos Error:', error);
        res.status(500).json({ 
            message: "Failed to fetch liked cautioos", 
            error: error.message 
        });
    }
};

export const deleteCautioo = async (req, res) => {
    try {
        const { id } = req.params;
        const doctorId = req.user.id;

        const cautioo = await Cautioo.findOne({ _id: id, doctor: doctorId });
        if (!cautioo) {
            return res.status(404).json({ message: "Cautioo not found or not authorized" });
        }

        try {
            const videoPublicId = cautioo.videoUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`cautioo_videos/${videoPublicId}`, { resource_type: 'video' });
            
            if (cautioo.thumbnail) {
                const thumbnailPublicId = cautioo.thumbnail.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`cautioo_thumbnails/${thumbnailPublicId}`);
            }
        } catch (cloudinaryError) {
            console.error('Cloudinary deletion error:', cloudinaryError);
        }

        await User.updateMany(
            { 'likedCautioos.cautioo': id },
            { $pull: { likedCautioos: { cautioo: id } } }
        );

        await Cautioo.findByIdAndDelete(id);

        await Doctor.findByIdAndUpdate(doctorId, { 
            $inc: { cautiooCount: -1 } 
        });

        res.json({ message: "Cautioo deleted successfully" });

    } catch (error) {
        console.error('Delete Cautioo Error:', error);
        res.status(500).json({ 
            message: "Failed to delete cautioo", 
            error: error.message 
        });
    }
};

export const updateCautioo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tags } = req.body;
        const doctorId = req.user.id;

        const cautioo = await Cautioo.findOne({ _id: id, doctor: doctorId });
        if (!cautioo) {
            return res.status(404).json({ message: "Cautioo not found or not authorized" });
        }

        if (title) cautioo.title = title.trim();
        if (description !== undefined) cautioo.description = description.trim();
        if (tags) {
            if (typeof tags === 'string') {
                cautioo.tags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
            } else if (Array.isArray(tags)) {
                cautioo.tags = tags;
            }
        }

        await cautioo.save();
        await cautioo.populate('doctor', 'name email profileImage experience');

        res.json({
            message: "Cautioo updated successfully",
            cautioo
        });

    } catch (error) {
        console.error('Update Cautioo Error:', error);
        res.status(500).json({ 
            message: "Failed to update cautioo", 
            error: error.message 
        });
    }
};
