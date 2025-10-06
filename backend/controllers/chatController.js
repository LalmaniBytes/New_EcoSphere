import axios from 'axios';

export const chatWithAI = async (req, res) => {
    try {
        const { message, location } = req.body;
        // ... (logic is identical to the previous version)
        const aiText = "The air quality in Delhi is currently 'Moderate'. It's generally okay for outdoor activities, but sensitive individuals should limit prolonged exertion.";
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