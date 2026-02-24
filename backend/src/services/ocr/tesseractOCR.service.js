/**
 * Extract text from image using Tesseract.js (Open Source OCR)
 * Requires: npm install tesseract.js
 * 
 * Pros: 
 * - FREE and open source
 * - No API keys needed
 * - Works offline
 * 
 * Cons:
 * - Slower than cloud services
 * - Less accurate
 * - Runs on your server (uses CPU/memory)
 * 
 * Setup: Just install the package, no API key needed!
 * npm install tesseract.js
 */

const Tesseract = require('tesseract.js');
const logger = require('../../config/logger');

async function extractTextFromImageWithTesseract(fileBuffer, fileName) {
    try {
        logger.info(`Processing image with Tesseract.js (open source): ${fileName}`);
        
        // Create worker
        const worker = await Tesseract.createWorker('eng', 1, {
            logger: m => logger.debug(`Tesseract: ${m.status} - ${m.progress}`)
        });
        
        // Perform OCR
        const { data: { text } } = await worker.recognize(fileBuffer);
        
        // Terminate worker
        await worker.terminate();
        
        if (text && text.trim().length > 0) {
            logger.info(`Extracted ${text.length} characters from image using Tesseract`);
            return text;
        } else {
            logger.warn(`No text detected in image: ${fileName}`);
            return `No text detected in image. Image may not contain readable text.`;
        }
        
    } catch (error) {
        logger.error('Tesseract OCR error:', error);
        throw new Error(`Failed to process image with OCR: ${error.message}`);
    }
}

module.exports = { extractTextFromImageWithTesseract };
