import dotenv from 'dotenv';
dotenv.config();

const api_url = process.env.DEV_API
const total_ids = [5179, 6512, 6561, 6729, 6734, 6782, 6936, 6940, 7167, 7221, 7222, 7519, 7521, 7571, 7576, 7577, 7578, 7582, 7585, 7586, 7587, 7588, 7590, 7591, 7593]
const type = "dev";
const response = await fetch(`http://localhost:${process.env.PORT}/calculate-aspect-ratio`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ api_url, total_ids, type }),
});

const result = await response.json();
console.log(result.message);
