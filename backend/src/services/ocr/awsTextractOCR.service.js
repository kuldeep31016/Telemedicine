/**
 * Extract text from image using AWS Textract
 * Requires: npm install @aws-sdk/client-textract
 * 
 * Setup:
 * 1. AWS account with Textract enabled
 * 2. Set environment variables:
 *    AWS_REGION=ap-south-1
 *    AWS_ACCESS_KEY=your_access_key
 *    AWS_SECRET_KEY=your_secret_key
 */

const { TextractClient, DetectDocumentTextCommand } = require('@aws-sdk/client-textract');
const logger = require('../../config/logger');

// Initialize Textract client
const textractClient = new TextractClient({
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

async function extractTextFromImageWithAWSTextract(fileBuffer, fileName) {
    try {
        logger.info(`Processing image with AWS Textract: ${fileName}`);
        
        const command = new DetectDocumentTextCommand({
            Document: {
                Bytes: fileBuffer
            }
        });
        
        const response = await textractClient.send(command);
        
        if (response.Blocks && response.Blocks.length > 0) {
            // Extract all LINE blocks (contains text)
            const textBlocks = response.Blocks
                .filter(block => block.BlockType === 'LINE')
                .map(block => block.Text)
                .join('\n');
            
            logger.info(`Extracted ${textBlocks.length} characters from image`);
            return textBlocks;
        } else {
            logger.warn(`No text detected in image: ${fileName}`);
            return `No text detected in image. Image may not contain readable text.`;
        }
        
    } catch (error) {
        logger.error('AWS Textract OCR error:', error);
        throw new Error(`Failed to process image with OCR: ${error.message}`);
    }
}

module.exports = { extractTextFromImageWithAWSTextract };
