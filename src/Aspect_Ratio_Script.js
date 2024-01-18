import fs from "fs";
import axios from 'axios'
import sharp from 'sharp';
import XLSX from 'xlsx'
import sizeOf from 'image-size';
import dotenv from 'dotenv';
dotenv.config();


let image_urls = [];
const myHeaders = new Headers({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.BEARER_TOKEN}`,
    'Mylo-In-App': 'false'
});
async function calculateAspectRatio(imageUrl) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const dimensions = await sizeOf(response.data);
    //   const dimensions = await sharp(response.data).metadata();
      const aspectRatio = (dimensions.width / dimensions.height).toFixed(2);
      const temp = []
      temp.push(aspectRatio);
      temp.push(dimensions.width);
      temp.push(dimensions.height);
      return temp;
    } catch (error) {
      console.error(`Error fetching image dimensions for ${imageUrl}:`, error.message);
      throw new Error(`Failed to get image dimensions: ${imageUrl}`);
    }
}
async function inner_items(req_banner_obj) {
    // && (req_banner_obj.deeplink == 92) && ("image" in req_banner_obj && req_banner_obj.image != "")
    if((req_banner_obj._id) && (req_banner_obj.itemType == "BANNER") && ("image" in req_banner_obj && req_banner_obj.image != "")){
        const temp = {
            "_id": req_banner_obj._id,
            "itemType": req_banner_obj.itemType,
            "image": req_banner_obj.image
        };
        var AspectRatio = await calculateAspectRatio(req_banner_obj.image);
        temp["Deeplink"] = req_banner_obj.deeplink;
        temp["Aspect-Ratio"] = AspectRatio[0];
        temp["Width"] = AspectRatio[1];
        temp["Height"] = AspectRatio[2];
        image_urls.push(temp);
    }
    if("items" in req_banner_obj && req_banner_obj["items"].length){
        const innerItemsPromises = req_banner_obj["items"].map(async element => {
            // if((element.itemType == "BANNER" || element.itemType == "MULTIPLE_ITEMS")  && (element.platform != undefined && element.platform.length && element.platform.includes("web")))
                await inner_items(element);
        });
        await Promise.all(innerItemsPromises);
    }
  }  
async function aspect_data(api_url,id){
    let response = await fetch(`${api_url}${id}`, {
        method: 'GET',
        headers: myHeaders
    })
    let jsondata = await response.json();
    if(!("data" in jsondata)){
        console.log("Data is not available: ", id);
        return;
    }
    let all_items = await jsondata.data.items;
    let req_banner_objs = [];
    all_items.forEach(element => {
        // if((element.itemType == "BANNER" || element.itemType == "MULTIPLE_ITEMS") && (element.platform != undefined && element.platform.length && element.platform.includes("web")))
            req_banner_objs.push(element);
    });
    const innerItemsPromises = req_banner_objs.map(async element => await inner_items(element));
    await Promise.all(innerItemsPromises);
}

const findAspectRatio = async(api_url, total_ids, type) => {
    var start = new Date();
    const data = {};
    for(let i = 0; i < total_ids.length; i++){
        await aspect_data(api_url, total_ids[i]);
        data[total_ids[i]] = image_urls;
        image_urls = [];
    }
    fs.writeFileSync(`../Json_Reports/Aspect_Ratio_Report_${type}.json`, JSON.stringify(data, null, 2), "utf-8", (err) => {
        if(err)
            console.log(err);
    })
    var time = new Date() - start;
    console.log(time);

    const flatDataArray = Object.keys(data).reduce((result, key) => {
        var sheetData = data[key].map(item => ({
        L2_ID: key,
        General_Item_ID: item._id,
        ItemType: item.itemType,
        Image: item.image,
        Image_Ratio: item.Width + " : " + item.Height,
        AspectRatio: item["Aspect-Ratio"],
        DeepLink: item["Deeplink"]
        }));
        return result.concat(sheetData);
    }, []);
    let WS = XLSX.utils.json_to_sheet(flatDataArray); 
    var wb = XLSX.utils.book_new() 
    XLSX.utils.book_append_sheet(wb, WS, 'Aspect_values') 
    XLSX.writeFile(wb, `../Excel_Files/Aspect_Ratio_Values_${type}.xlsx`);
}
export default findAspectRatio;