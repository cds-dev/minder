// #region IMPORTS
const express = require('express')
const fs = require('fs')
const path = require('path')
const multer = require('multer')

const Cat = require('../db/models/utils/categoryModel')
const Cal = require('../db/models/calendarModel')
const K = require('../db/models/kanbanModel')


const { getModel } = require('../back/utils/getModel')


if (!fs.existsSync('src/imgs/temp/')) {
  fs.mkdirSync('src/imgs/temp/')
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/imgs/temp/') // Set the destination folder (make sure this folder exists)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname); // Preserve original extension
    cb(null, file.fieldname + '-' + uniqueSuffix + ext); // Customize the file name
  }
})
const upload = multer({ storage: storage })


const app = express.Router()

const audioFolder = path.join(__dirname, '../', 'audio')
// #endregion

// #region GET:
// app.get('/audio-files/', (req, res) => {

//   // Read the audio files from the folder
//   fs.readdir(audioFolder, (err, files) => {
//     if (err) {
//       console.error('Error reading audio files:', err)
//       return res.sendStatus(500)
//     }

//     res.json(files) // Send the array of audio file names as JSON
//   })
// })

// app.get('/files2cache/', async (req, res) => {
//   const imgDir = path.join(__dirname, '../imgs')
//   const jsDir = path.join(__dirname, '../front')

//   app.use(express.static(imgDir))
//   app.use(express.static(jsDir))
//   const img = getFiles(imgDir)
//   const js = getFiles(jsDir)
//   const files = [...img, ...js]
//   res.json(files)
// })


// clicking on a day in a calendar
app.get('/diary/:day/:month/:year', async (req, res) => {
  const date = `${req.params.day}/${req.params.month}/${req.params.year}`
  const data = await Cal.find({date: date})
  .populate('food')
  data.forEach(x => {
    if(x.variety == 'food') x.picture = x.food.picture
    if (x.picture && x.picture.includes('/')) x.icon = false
    else x.icon = true
  })


  const allDates = await Cal.find({}).distinct('date')

  res.render('mains/list', {
    data, allDates,
    dom: 'diary',
    title: `Calendar for ${date}`
  })
})
// #endregion


// #region POST:
app.post('/save-image/', upload.single('image'), (req, res) => {
  if (req.file) {
    console.info("File saved at:", req.file.path)
    res.json({ message: "Image saved successfully", filePath: req.file.path })
  } else {
    console.info("No file received")
    res.status(400).json({ error: "No file uploaded" })
  }
})
// #endregion


// #region STATUSES
app.get('/status/:page/:id', async (req, res) => {
  const query = {}
  const page = req.params.page
  const M = await getModel(page)
  // kanban board, not needed for item and monitor
  if (page == 'kanban') {
    const board = await Cat.findOne({main: true, category: page})

    query.category = board._id
  }

  const status = await Cat.findById(req.params.id)
  if (status.name !== 'filter') { // show all
    query.status = status._id
  }
  const data = await M.find(query)
  .populate('status')
  res.send(data)
})

app.post('/status/kanban/:id', async (req, res) => {
  const kanId = req.body.current.split('/')[req.body.current.split('/').length - 1]

  const kan = await K.findById(kanId)
  kan.status = req.params.id
  await kan.save()

  res.send({kan})
})
// #endregion


// #region
// const getFiles = (dir, files_) => {
//   files_ = files_ || []
//   const files = fs.readdirSync(dir)
//   for (let i in files) {
//     const name = path.join(dir, files[i])
//     if (fs.statSync(name).isDirectory()) {
//       getFiles(name, files_)
//     } else {
//       files_.push(name.replace(dir + path.sep, ''))
//     }
//   }
//   return files_
// }
// #endregion

module.exports = app