import readline from 'readline';
import findAspectRatio from './Aspect_Ratio_Script.js';
import { exit } from 'process';
import dotenv from 'dotenv';
dotenv.config();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var total_ids = [], api_url, type;
rl.question("Enter 1 for dev and 2 for staging: ", async(input) =>{
    if(input == '1'){
        api_url = process.env.DEV_API;
        type = "dev"
    }else if(input == '2'){
        api_url = process.env.TEST_API;
        type = "stage";
    }
    else{
        console.log("Enter Valid Input");
        exit(1);
    }
    rl.question('Enter total_ids (comma-separated): ', async(input) => {
        // ID's input from the console 
        if(input.length == 0){
            console.log("Please Enter a id");
            exit(0);
        }
        if(!(input.includes(',')))
            total_ids.push(parseInt(input.trim(), 10))
        else
            total_ids.push(...input.split(',').map(id => parseInt(id.trim(), 10)));

        // OR just pass already stored array of total_ids
        // const total_ids = [5179, 6512, 6560, 6561, 6729, 6734, 6782, 6936, 6938, 6940, 7167, 7221, 7222, 7512, 7519, 7520, 7521, 7571, 7576, 7577, 7578, 7582, 7585, 7586, 7587, 7588, 7590, 7591, 7593];

        // 5179, 6512, 6561, 6729, 6734, 6782, 6936, 6940, 7167, 7221, 7222, 7519, 7521, 7571, 7576, 7577, 7578, 7582, 7585, 7586, 7587, 7588, 7590, 7591, 7593
        findAspectRatio(api_url, total_ids, type);
        rl.close();
    }); 
});