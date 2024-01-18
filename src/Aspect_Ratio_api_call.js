import express from 'express';
import findAspectRatio from './Aspect_Ratio_Script.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(express.json());

app.post('/calculate-aspect-ratio', async (req, res) => {
    const { api_url, total_ids, type } = req.body;

    try {
        await findAspectRatio(api_url, total_ids, type);
        res.status(200).json({ message: 'Aspect ratio calculation completed successfully.' });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});