const sharp = require('sharp')
const path = require('path') // used for image editing
const fs = require('fs')

const imageResize = async input => {
  const url = path.resolve(__dirname, `../../${input}`)
  const tempUrl = path.resolve(__dirname, `../../imgs/temp/`, input.split('/')[input.split('/').length - 1])
  try {
    if(fs.existsSync(tempUrl)) {
      const image = await sharp(tempUrl)
      const metadata = await image.metadata()
      if (metadata.width > metadata.height) {
        image.resize({height: 500}).toBuffer()
        image.png().toBuffer()
        metadata.width = (metadata.width * 500) / metadata.height
        metadata.height = 500
        image.extract({ left: Math.floor((metadata.width - 500)/2), top: 0, width: 500, height: 500 }).toBuffer()
      }
      else if (metadata.height > metadata.width) {
        image.resize({width: 500}).toBuffer()
        metadata.height = (metadata.height * 500) / metadata.width
        metadata.width = 500
        image.png().toBuffer()
        image.extract({ left: 0, top: Math.floor((metadata.height - 500)/2), width: 500, height: 500 }).toBuffer()
      }
      else {
        image.resize({width: 500}).toBuffer()
      }
      image.toFile(url, (err, info) => {
        if (err) console.error(err)
      })
    }
    else {
      console.error('you didn\'t download the picture')
    }

  } catch (err) {
    console.error(err)
  }
}


module.exports = {
  imageResize
}