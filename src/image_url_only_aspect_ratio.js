import axios from 'axios'
import XLSX from 'xlsx'
import sizeOf from 'image-size';
import sharp from 'sharp';

const data = [
  'https://images.myloapp.in/tags/170195007147.webp',
  'https://images.myloapp.in/tags/170197451841.webp',
  'https://images.myloapp.in/tags/170246145075.webp',
  'https://images.myloapp.in/tags/169044196998.webp',
  'https://images.myloapp.in/tags/169044196846.webp',
  'https://images.myloapp.in/tags/170246145247.webp',
  'https://images.myloapp.in/tags/170194698912.webp',
  'https://images.myloapp.in/tags/170204098222.webp',
  'https://images.myloapp.in/tags/170195007042.webp',
  'https://images.myloapp.in/tags/170194698815.webp',
  'https://images.myloapp.in/tags/170205661973.webp',
  'https://images.myloapp.in/tags/170197451866.webp',
  'https://images.myloapp.in/tags/170197451977.webp',
  'https://images.myloapp.in/tags/170197451853.webp',
  'https://images.myloapp.in/tags/170246145190.webp',
  'https://images.myloapp.in/tags/170194698942.webp',
  'https://images.myloapp.in/tags/webp/category_banner_6926_7018_167887365819.webp',
  'https://images.myloapp.in/tags/170262104074.webp',
  'https://images.myloapp.in/tags/170194699020.webp',
  'https://images.myloapp.in/tags/170246110817.webp',
  'https://images.myloapp.in/tags/169045638334.webp',
  'https://images.myloapp.in/tags/170229058394.webp',
  'https://images.myloapp.in/tags/170246145130.webp',
  'https://images.myloapp.in/products_category/168659193426.webp',
  'https://images.myloapp.in/tags/170229088248.webp',
  'https://images.myloapp.in/tags/170229058482.webp',
  'https://images.myloapp.in/tags/170229058361.webp',
  'https://images.myloapp.in/tags/169527937627.webp',
  'https://images.myloapp.in/tags/168683316549.webp',
  'https://images.myloapp.in/tags/169527604775.webp',
  'https://images.myloapp.in/tags/170194879728.webp',
  'https://images.myloapp.in/tags/170194879861.webp',
  'https://images.myloapp.in/tags/170197375172.webp',
  'https://images.myloapp.in/tags/170195403996.webp',
  'https://images.myloapp.in/tags/170197352159.webp',
  'https://images.myloapp.in/tags/169527912061.webp',
  'https://images.myloapp.in/tags/170204117050.webp',
  'https://images.myloapp.in/tags/170229803351.webp',
  'https://images.myloapp.in/tags/170204402199.webp',
  'https://images.myloapp.in/tags/170204402223.webp',
  'https://images.myloapp.in/tags/170262112660.webp',
  'https://images.myloapp.in/tags/170197610895.webp',
  'https://images.myloapp.in/tags/170197610826.webp',
  'https://images.myloapp.in/tags/170197610739.webp',
  'https://images.myloapp.in/tags/170197610764.webp',
  'https://images.myloapp.in/tags/170197451947.webp',
  'https://images.myloapp.in/tags/170201863128.webp',
  'https://images.myloapp.in/tags/170315795732.webp',
  'https://images.myloapp.in/tags/170204423537.webp',
  'https://images.myloapp.in/tags/170256130913.webp',
  'https://images.myloapp.in/tags/170262091181.webp',
  'https://images.myloapp.in/tags/170262091217.webp',
  'https://images.myloapp.in/tags/170262104187.webp',
  'https://images.myloapp.in/tags/170204313122.webp',
  'https://images.myloapp.in/tags/170204313253.webp',
  'https://images.myloapp.in/tags/170204313299.webp',
  'https://images.myloapp.in/tags/170205962664.webp',
  'https://images.myloapp.in/tags/170204313225.webp',
  'https://images.myloapp.in/tags/170204313324.webp',
  'https://images.myloapp.in/tags/170204313335.webp',
  'https://images.myloapp.in/tags/170205661981.webp',
]

const result = []
async function calculateAspectRatio(imageUrl) {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })
    // const dimensions = await sharp(response.data).metadata();
    const dimensions = await sizeOf(response.data)
    const aspectRatio = (dimensions.width / dimensions.height).toFixed(2)
    var temp = {}
    temp.url = imageUrl
    temp.aspectRatio = aspectRatio
    temp.width = dimensions.width
    temp.height = dimensions.height
    result.push(temp)
  } catch (error) {
    console.error(
      `Error fetching image dimensions for ${imageUrl}:`,
      error.message
    )
    throw new Error(`Failed to get image dimensions: ${imageUrl}`)
  }
}

let promises = data.map(async (element) => {
  await calculateAspectRatio(element)
})
Promise.all(promises).then(() => {
  let WS = XLSX.utils.json_to_sheet(result)
  var wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, WS, 'Aspect_values')
  XLSX.writeFile(wb, `../Excel_Files/Apect_Ratio_Image_Url.xlsx`)
})