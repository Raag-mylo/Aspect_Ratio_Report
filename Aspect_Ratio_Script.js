import fs from "fs";
import axios from 'axios'
import sharp from 'sharp';
import XLSX from 'xlsx'
import sizeOf from 'image-size';

let image_urls = [];
const myHeaders = new Headers({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer a8da0560-b32f-4907-9f0b-9d7fa22a1cbc',
    'Mylo-In-App': 'false'
});
async function calculateAspectRatio(imageUrl) {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const dimensions = await sizeOf(response.data);
    //   const dimensions = await sharp(response.data).metadata();
      const aspectRatio = (dimensions.width / dimensions.height).toFixed(2);
      return aspectRatio;
    } catch (error) {
      console.error(`Error fetching image dimensions for ${imageUrl}:`, error.message);
      throw new Error(`Failed to get image dimensions: ${imageUrl}`);
    }
}
async function inner_items(req_banner_obj) {
    if("image" in req_banner_obj && req_banner_obj.image != ""){
        const temp = {
            "_id": req_banner_obj._id,
            "itemType": req_banner_obj.itemType,
            "image": req_banner_obj.image
        };
        var AspectRatio = await calculateAspectRatio(req_banner_obj.image);
        temp["Aspect-Ratio"] = AspectRatio
        image_urls.push(temp);
    } else if("items" in req_banner_obj && req_banner_obj["items"].length){
        req_banner_obj["items"].forEach(element => {
            // if(element.itemType == "BANNER" || element.itemType == "MULTIPLE_ITEMS"){
                inner_items(element);
        });
    }
  }  
async function aspect_data(api_url,id){
    let response = await fetch(`${api_url}${id}`, {
        method: 'GET',
        headers: myHeaders
    })
    let jsondata = await response.json();
    if(!("data" in jsondata))
        console.log("Data is not available: ", id);
    let all_items = await jsondata.data.items;
    let req_banner_objs = [];
    all_items.forEach(element => {
        // if(element.itemType == "BANNER" || element.itemType == "MULTIPLE_ITEMS")
            req_banner_objs.push(element);
    });
    const innerItemsPromises = req_banner_objs.map(async element => inner_items(element));
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
    fs.writeFileSync(`./Aspect_Ratio_Report_${type}.json`, JSON.stringify(data, null, 2), "utf-8", (err) => {
        if(err)
            console.log(err);
    })
    var time = new Date() - start;
    console.log(time);

    const flatDataArray = Object.keys(data).reduce((result, key) => {
        const sheetData = data[key].map(item => ({
        L2_ID: key,
        General_Item_ID: item._id,
        ItemType: item.itemType,
        Image: item.image,
        AspectRatio: item["Aspect-Ratio"]
        }));
        return result.concat(sheetData);
    }, []);
    let WS = XLSX.utils.json_to_sheet(flatDataArray); 
    var wb = XLSX.utils.book_new() 
    XLSX.utils.book_append_sheet(wb, WS, 'Aspect_values') 
    XLSX.writeFile(wb, `Aspect_values_${type}.xlsx`);
}

export default findAspectRatio;