/**
 * Extract text from image using Google Cloud Vision OCR
 * Requires: npm install @google-cloud/vision
 * 
 * Setup:
 * 1. Create Google Cloud project
 * 2. Enable Vision API
 * 3. Create service account & download JSON key
 * 4. Set environment variable: GOOGLE_APPLICATION_CREDENTIALS=path/to/key.json
 */

const vision = require('@google-cloud/vision');

async function extractTextFromImageWithGoogleVision(fileBuffer, fileName) {
    try {
        // Initialize Vision API client
        const client = new vision.ImageAnnotatorClient();
        
        logger.info(`Processing image with Google Cloud Vision: ${fileName}`);
        
        // Perform text detection
        const [result] = await client.textDetection({
            image: { content: fileBuffer }
        });
        
        const detections = result.textAnnotations;
        
        if (detections && detections.length > 0) {
            // First annotation contains all detected text
            const extractedText = detections[0].description;
            logger.info(`Extracted ${extractedText.length} characters from image`);
            return extractedText;
        } else {
            logger.warn(`No text detected in image: ${fileName}`);
            return `No text detected in image. Image may not contain readable text.`;
        }
        
    } catch (error) {
        logger.error('Google Vision OCR error:', error);
        throw new Error(`Failed to process image with OCR: ${error.message}`);
    }
}

module.exports = { extractTextFromImageWithGoogleVision };
