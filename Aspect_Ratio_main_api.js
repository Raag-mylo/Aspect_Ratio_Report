const api_url = "https://dev-api.myloapp.in/new/generalTab/getTabByKeyForWeb?key="
const total_ids = [5179, 6512, 6560, 6561, 6729, 6734, 6782, 6936, 6938, 6940, 7167, 7221, 7222, 7512, 7519, 7520, 7521, 7571, 7576, 7577, 7578, 7582, 7585, 7586, 7587, 7588, 7590, 7591, 7593]
const type = "dev";
const response = await fetch('http://localhost:8000/calculate-aspect-ratio', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ api_url, total_ids, type }),
});

const result = await response.json();
console.log(result.message);
