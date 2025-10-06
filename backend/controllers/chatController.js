import axios from 'axios';
import { generateReplyHome } from '../services/gemini.js';

export const chatWithAI = async (req, res) => {
    try {
        const { message, location } = req.body;

        if (!message) {
            return res.status(400).json({ message: "Message is required." });
        }

        const aiText =await generateReplyHome({ message, location });
    console.log("AI Response:", aiText);    
        const response = {
            response: aiText.trim(),
            suggestions: [
                "Check current air quality index",
                "Get weather forecast",
                "Report an environmental issue",
                "Find nearby water logging areas"
            ]
        };
        
        res.status(200).json(response);

    } catch (error) {
        console.error("Error in AI chat:", error.message);
        res.status(500).json({
            response: "I'm sorry, I'm experiencing some technical difficulties.",
            suggestions: []
        });
    }
};