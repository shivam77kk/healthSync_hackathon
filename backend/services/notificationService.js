// Notification service for voice prescriptions
import User from '../models/userSchema.js';
import Doctor from '../models/doctorSchema.js';

class NotificationService {
    constructor() {
        this.notifications = new Map(); // In-memory storage for demo (use database in production)
    }

    // Send prescription notification to patient
    async sendPrescriptionNotification(patient, prescription) {
        try {
            const notification = {
                id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                type: 'voice_prescription',
                recipient: {
                    id: patient._id,
                    name: patient.name,
                    email: patient.email
                },
                sender: {
                    id: prescription.doctor._id || prescription.doctor,
                    name: prescription.doctor.name,
                    type: 'doctor'
                },
                prescription: {
                    id: prescription._id,
                    type: prescription.type,
                    priority: prescription.priority,
                    hasAudio: !!prescription.audioUrl
                },
                title: 'New Voice Prescription Received',
                message: `You have received a new ${prescription.type} prescription from Dr. ${prescription.doctor.name}`,
                status: 'sent',
                channels: ['in-app', 'email'], // Could also include 'sms', 'push'
                createdAt: new Date(),
                readAt: null,
                metadata: {
                    prescriptionPriority: prescription.priority,
                    transcriptPreview: prescription.transcript ? 
                        prescription.transcript.substring(0, 100) + '...' : null
                }
            };

            // Store notification (in production, save to database)
            if (!this.notifications.has(patient._id.toString())) {
                this.notifications.set(patient._id.toString(), []);
            }
            this.notifications.get(patient._id.toString()).push(notification);

            // Send via different channels
            const results = await Promise.allSettled([
                this.sendInAppNotification(notification),
                this.sendEmailNotification(notification),
                // this.sendSMSNotification(notification), // Uncomment if SMS service available
                // this.sendPushNotification(notification) // Uncomment if push service available
            ]);

            console.log('Notification sent successfully:', {
                notificationId: notification.id,
                patient: patient.name,
                doctor: prescription.doctor.name,
                channels: results.map((result, index) => ({
                    channel: notification.channels[index],
                    success: result.status === 'fulfilled'
                }))
            });

            return {
                success: true,
                notificationId: notification.id,
                channels: notification.channels,
                deliveryResults: results
            };

        } catch (error) {
            console.error('Failed to send prescription notification:', error);
            throw error;
        }
    }

    // In-app notification
    async sendInAppNotification(notification) {
        // In production, this would save to a notifications table in the database
        console.log(`📱 In-App Notification sent to ${notification.recipient.name}:`, {
            title: notification.title,
            message: notification.message,
            timestamp: notification.createdAt
        });
        
        return {
            channel: 'in-app',
            status: 'delivered',
            timestamp: new Date()
        };
    }

    // Email notification
    async sendEmailNotification(notification) {
        // In production, this would integrate with an email service like:
        // - SendGrid
        // - AWS SES
        // - Nodemailer with SMTP
        // - Mailgun, etc.
        
        const emailContent = {
            to: notification.recipient.email,
            from: 'noreply@healthsync.com',
            subject: notification.title,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #2c5282;">New Voice Prescription</h2>
                    <p>Dear ${notification.recipient.name},</p>
                    <p>You have received a new ${notification.prescription.type} prescription from <strong>Dr. ${notification.sender.name}</strong>.</p>
                    
                    ${notification.metadata.transcriptPreview ? `
                        <div style="background: #f7fafc; padding: 15px; border-radius: 5px; margin: 15px 0;">
                            <h4 style="margin-top: 0; color: #2d3748;">Prescription Preview:</h4>
                            <p style="font-style: italic; margin-bottom: 0;">"${notification.metadata.transcriptPreview}"</p>
                        </div>
                    ` : ''}
                    
                    <div style="background: #e6fffa; padding: 15px; border-radius: 5px; margin: 15px 0;">
                        <p style="margin: 0;"><strong>Priority:</strong> ${notification.prescription.priority.toUpperCase()}</p>
                        <p style="margin: 5px 0 0 0;"><strong>Date:</strong> ${notification.createdAt.toLocaleDateString()}</p>
                    </div>
                    
                    <p>Please log in to your HealthSync account to view the complete prescription and audio recording.</p>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="http://localhost:3000/prescriptions/${notification.prescription.id}" 
                           style="background: #3182ce; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                           View Prescription
                        </a>
                    </div>
                    
                    <p style="color: #718096; font-size: 14px; margin-top: 30px;">
                        This is an automated message from HealthSync. Please do not reply to this email.
                    </p>
                </div>
            `
        };

        console.log(`📧 Email Notification sent to ${notification.recipient.email}:`, {
            subject: emailContent.subject,
            timestamp: new Date()
        });

        // Simulate email sending delay
        await new Promise(resolve => setTimeout(resolve, 100));

        return {
            channel: 'email',
            status: 'delivered',
            timestamp: new Date(),
            recipient: notification.recipient.email
        };
    }

    // SMS notification (placeholder)
    async sendSMSNotification(notification) {
        // In production, integrate with SMS service like:
        // - Twilio
        // - AWS SNS
        // - MessageBird, etc.
        
        const smsContent = `HealthSync: New voice prescription from Dr. ${notification.sender.name}. Priority: ${notification.prescription.priority}. Login to view: http://healthsync.com/rx/${notification.prescription.id}`;

        console.log(`📱 SMS Notification would be sent:`, {
            recipient: notification.recipient.phone || 'Phone not available',
            message: smsContent,
            timestamp: new Date()
        });

        return {
            channel: 'sms',
            status: 'delivered',
            timestamp: new Date()
        };
    }

    // Push notification (placeholder)
    async sendPushNotification(notification) {
        // In production, integrate with push service like:
        // - Firebase Cloud Messaging (FCM)
        // - Apple Push Notification Service (APNS)
        // - OneSignal, etc.

        const pushPayload = {
            title: notification.title,
            body: `New prescription from Dr. ${notification.sender.name}`,
            data: {
                prescriptionId: notification.prescription.id,
                priority: notification.prescription.priority,
                type: 'voice_prescription'
            }
        };

        console.log(`🔔 Push Notification would be sent:`, {
            payload: pushPayload,
            timestamp: new Date()
        });

        return {
            channel: 'push',
            status: 'delivered',
            timestamp: new Date()
        };
    }

    // Get patient's notifications
    async getPatientNotifications(patientId, options = {}) {
        const { page = 1, limit = 10, unreadOnly = false } = options;
        const skip = (page - 1) * limit;

        let notifications = this.notifications.get(patientId.toString()) || [];
        
        if (unreadOnly) {
            notifications = notifications.filter(notif => !notif.readAt);
        }

        // Sort by creation date (newest first)
        notifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        // Apply pagination
        const paginatedNotifications = notifications.slice(skip, skip + limit);
        const total = notifications.length;
        const totalPages = Math.ceil(total / limit);

        return {
            notifications: paginatedNotifications,
            pagination: {
                currentPage: page,
                totalPages,
                totalNotifications: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
                unreadCount: notifications.filter(n => !n.readAt).length
            }
        };
    }

    // Mark notification as read
    async markNotificationAsRead(patientId, notificationId) {
        const patientNotifications = this.notifications.get(patientId.toString());
        if (!patientNotifications) {
            throw new Error('No notifications found for patient');
        }

        const notification = patientNotifications.find(n => n.id === notificationId);
        if (!notification) {
            throw new Error('Notification not found');
        }

        notification.readAt = new Date();
        notification.status = 'read';

        return notification;
    }

    // Mark all notifications as read for a patient
    async markAllNotificationsAsRead(patientId) {
        const patientNotifications = this.notifications.get(patientId.toString());
        if (!patientNotifications) {
            return { markedCount: 0 };
        }

        let markedCount = 0;
        const now = new Date();

        patientNotifications.forEach(notification => {
            if (!notification.readAt) {
                notification.readAt = now;
                notification.status = 'read';
                markedCount++;
            }
        });

        return { markedCount };
    }

    // Send reminder notification
    async sendReminderNotification(patientId, prescriptionId) {
        const patient = await User.findById(patientId);
        if (!patient) {
            throw new Error('Patient not found');
        }

        // This would be used for prescription reminders, follow-ups, etc.
        const reminderNotification = {
            id: `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            type: 'prescription_reminder',
            recipient: {
                id: patient._id,
                name: patient.name,
                email: patient.email
            },
            title: 'Prescription Reminder',
            message: 'Don\'t forget to take your prescribed medication as directed.',
            status: 'sent',
            createdAt: new Date(),
            metadata: {
                prescriptionId,
                reminderType: 'medication'
            }
        };

        if (!this.notifications.has(patientId.toString())) {
            this.notifications.set(patientId.toString(), []);
        }
        this.notifications.get(patientId.toString()).push(reminderNotification);

        console.log(`🔔 Prescription reminder sent to ${patient.name}`);

        return reminderNotification;
    }

    // Get notification statistics
    async getNotificationStats(patientId) {
        const patientNotifications = this.notifications.get(patientId.toString()) || [];
        
        const stats = {
            total: patientNotifications.length,
            unread: patientNotifications.filter(n => !n.readAt).length,
            byType: {},
            byPriority: {},
            recent: patientNotifications
                .filter(n => new Date() - new Date(n.createdAt) < 7 * 24 * 60 * 60 * 1000) // Last 7 days
                .length
        };

        // Count by type
        patientNotifications.forEach(notification => {
            stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
            
            if (notification.metadata?.prescriptionPriority) {
                const priority = notification.metadata.prescriptionPriority;
                stats.byPriority[priority] = (stats.byPriority[priority] || 0) + 1;
            }
        });

        return stats;
    }
}

// Export singleton instance
const notificationService = new NotificationService();
export default notificationService;
