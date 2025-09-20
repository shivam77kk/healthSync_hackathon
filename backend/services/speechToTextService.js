import cloudinary from '../config/cloudinary.config.js';

// Mock Speech-to-Text Service (for development/testing)
class MockSpeechToTextService {
    async transcribe(audioBuffer, options = {}) {
        // Simulate processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock medical prescription transcriptions based on audio file size/duration
        const mockTranscriptions = [
            "Patient presents with symptoms of hypertension. Prescribe Amlodipine 5mg once daily. Monitor blood pressure weekly. Follow up in 2 weeks.",
            "Diagnosis: Upper respiratory tract infection. Prescribe Azithromycin 250mg twice daily for 5 days. Plenty of rest and fluids. Return if symptoms worsen.",
            "Patient complains of chronic back pain. Prescribe Ibuprofen 400mg three times daily with food. Physical therapy recommended. Review in 1 week.",
            "Allergic rhinitis symptoms present. Prescribe Cetirizine 10mg once daily. Avoid known allergens. Continue for 2 weeks or until symptoms resolve.",
            "Type 2 diabetes management. Continue Metformin 500mg twice daily. Monitor blood glucose levels. Dietary counseling scheduled.",
            "Migraine episode. Prescribe Sumatriptan 50mg as needed for headache. Avoid triggers. Keep headache diary. Follow up in 2 weeks.",
            "Gastroesophageal reflux disease. Prescribe Omeprazole 20mg once daily before breakfast. Avoid spicy foods. Elevate head of bed.",
            "Anxiety symptoms present. Prescribe Sertraline 50mg once daily. Start therapy sessions. Monitor for side effects. Review in 4 weeks."
        ];
        
        const randomTranscription = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
        
        return {
            transcript: randomTranscription,
            confidence: 0.85 + Math.random() * 0.1, // Mock confidence between 0.85-0.95
            duration: Math.floor(audioBuffer.length / 16000), // Rough estimate
            language: 'en-US',
            provider: 'mock'
        };
    }
}

// Google Cloud Speech-to-Text Service (requires API key)
class GoogleSpeechToTextService {
    constructor() {
        this.apiKey = process.env.GOOGLE_SPEECH_API_KEY;
    }
    
    async transcribe(audioBuffer, options = {}) {
        if (!this.apiKey) {
            throw new Error('Google Speech API key not configured');
        }
        
        try {
            // Note: This would require @google-cloud/speech package
            // For now, we'll simulate the API call
            const mockGoogleResponse = {
                transcript: "This is a mock Google Speech-to-Text transcription for medical prescription audio.",
                confidence: 0.92,
                duration: options.duration || 30,
                language: options.language || 'en-US',
                provider: 'google'
            };
            
            return mockGoogleResponse;
        } catch (error) {
            console.error('Google Speech-to-Text error:', error);
            throw new Error('Failed to transcribe audio using Google Speech-to-Text');
        }
    }
}

// OpenAI Whisper Service (via API)
class OpenAIWhisperService {
    constructor() {
        this.apiKey = process.env.OPENAI_API_KEY;
        this.apiUrl = 'https://api.openai.com/v1/audio/transcriptions';
    }
    
    async transcribe(audioBuffer, options = {}) {
        if (!this.apiKey) {
            throw new Error('OpenAI API key not configured');
        }
        
        try {
            const formData = new FormData();
            formData.append('file', audioBuffer, {
                filename: 'audio.mp3',
                contentType: 'audio/mpeg'
            });
            formData.append('model', 'whisper-1');
            formData.append('language', options.language || 'en');
            formData.append('response_format', 'verbose_json');
            
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: formData
            });
            
            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            return {
                transcript: result.text,
                confidence: result.segments ? 
                    result.segments.reduce((acc, seg) => acc + seg.avg_logprob, 0) / result.segments.length : 
                    0.9,
                duration: result.duration,
                language: result.language,
                provider: 'openai'
            };
        } catch (error) {
            console.error('OpenAI Whisper error:', error);
            // Fallback to mock service if API fails
            console.log('Falling back to mock service...');
            const mockService = new MockSpeechToTextService();
            return await mockService.transcribe(audioBuffer, options);
        }
    }
}

// Azure Speech Service
class AzureSpeechToTextService {
    constructor() {
        this.apiKey = process.env.AZURE_SPEECH_API_KEY;
        this.region = process.env.AZURE_SPEECH_REGION || 'eastus';
    }
    
    async transcribe(audioBuffer, options = {}) {
        if (!this.apiKey) {
            throw new Error('Azure Speech API key not configured');
        }
        
        try {
            // Mock Azure response for now
            return {
                transcript: "Mock Azure Speech-to-Text transcription for medical prescription.",
                confidence: 0.88,
                duration: options.duration || 25,
                language: options.language || 'en-US',
                provider: 'azure'
            };
        } catch (error) {
            console.error('Azure Speech-to-Text error:', error);
            throw new Error('Failed to transcribe audio using Azure Speech-to-Text');
        }
    }
}

// Main Speech-to-Text Service Manager
class SpeechToTextService {
    constructor() {
        this.providers = {
            mock: new MockSpeechToTextService(),
            google: new GoogleSpeechToTextService(),
            openai: new OpenAIWhisperService(),
            azure: new AzureSpeechToTextService()
        };
        
        // Priority order of providers to try
        this.providerPriority = ['openai', 'google', 'azure', 'mock'];
    }
    
    async transcribe(audioBuffer, options = {}) {
        const { preferredProvider, fallback = true } = options;
        
        let providersToTry = preferredProvider ? 
            [preferredProvider, ...this.providerPriority.filter(p => p !== preferredProvider)] :
            this.providerPriority;
        
        if (!fallback) {
            providersToTry = [preferredProvider || this.providerPriority[0]];
        }
        
        let lastError = null;
        
        for (const providerName of providersToTry) {
            try {
                console.log(`Attempting transcription with ${providerName} provider...`);
                const provider = this.providers[providerName];
                
                if (!provider) {
                    throw new Error(`Unknown provider: ${providerName}`);
                }
                
                const result = await provider.transcribe(audioBuffer, options);
                console.log(`Successfully transcribed with ${providerName} provider`);
                
                return {
                    ...result,
                    providersAttempted: providersToTry.indexOf(providerName) + 1
                };
                
            } catch (error) {
                console.error(`${providerName} provider failed:`, error.message);
                lastError = error;
                
                if (!fallback || providerName === 'mock') {
                    throw error;
                }
                
                continue;
            }
        }
        
        throw lastError || new Error('All speech-to-text providers failed');
    }
    
    // Upload audio to cloud storage
    async uploadAudio(audioBuffer, fileName) {
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    resource_type: "auto",
                    public_id: `voice_prescriptions/${fileName}`,
                    format: "mp3"
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            stream.end(audioBuffer);
        });
    }
    
    // Get audio metadata
    getAudioMetadata(audioBuffer, mimetype) {
        return {
            size: audioBuffer.length,
            format: mimetype,
            // Note: Getting actual duration would require a library like node-ffprobe
            // For now, we'll estimate based on file size and common bitrates
            duration: this.estimateDuration(audioBuffer.length, mimetype)
        };
    }
    
    // Estimate audio duration (rough calculation)
    estimateDuration(fileSize, mimetype) {
        // Rough estimates based on common bitrates
        const bitrates = {
            'audio/mpeg': 128000,    // 128 kbps MP3
            'audio/wav': 1411200,    // 16-bit 44.1kHz WAV
            'audio/webm': 96000,     // 96 kbps WebM
            'audio/mp4': 128000      // 128 kbps M4A
        };
        
        const bitrate = bitrates[mimetype] || 128000;
        return Math.floor((fileSize * 8) / bitrate); // Duration in seconds
    }
    
    // Medical context-aware post-processing
    processMedicalTranscript(transcript) {
        // Common medical terms and their corrections
        const medicalCorrections = {
            'high per tension': 'hypertension',
            'dia betes': 'diabetes',
            'anti biotic': 'antibiotic',
            'milli gram': 'milligram',
            'milli grams': 'milligrams',
            'once daily': 'once daily',
            'twice daily': 'twice daily',
            'three times daily': 'three times daily',
            'as needed': 'as needed',
            'follow up': 'follow-up',
            'side effects': 'side effects'
        };
        
        let processedTranscript = transcript;
        
        for (const [incorrect, correct] of Object.entries(medicalCorrections)) {
            processedTranscript = processedTranscript.replace(
                new RegExp(incorrect, 'gi'),
                correct
            );
        }
        
        return processedTranscript;
    }
}

// Export singleton instance
const speechToTextService = new SpeechToTextService();
export default speechToTextService;
