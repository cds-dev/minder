const express = require('express')
const app = express.Router()

const { getModel } = require
('../back/utils/getModel')
const { ObjectID } = require('mongodb')

app.get('/delete/?:page/?:id', async (req, res) => {
  //console.info('DELETE CALLED...')
  const MODEL = await getModel(req.params.page)

  //console.info('Request headers:', req.headers)
  //console.info('Request params:', req.params)

  if(!MODEL) return
  else {
    const data = await MODEL.findById(req.params.id)

    if (data.picture && data?.picture.includes('/')) {
      data.icon = false
    } else {
      data.icon = true
    }

    res.render('mains/delete', {
      data, dom: req.params.page,
      title: `Delete ${data.name}`
    })
  }
  
})


app.post('/delete/?:page/?:id', async (req, res) => {
  const MODEL = await getModel(req.params.page)
  await MODEL.findByIdAndDelete(req.params.id)
  .then(data => {
    if (!data) {
      console.error(`no ${req.params.page} found`)
      return res.status(404).send(`${req.params.page} not found`)
    }

    return res.json(data)
  })
  .catch(err => {
    console.error(err)
    return res.status(500).send(err)
  })
})


// const retriveModel = async (req, res) => {  
//   const page = req.params.page
//   const id = req.params.id


//   if (page && (!id || !ObjectID.isValid(id))) {
//     return res.redirect(`/list/${page}`)
//   } else if (!page) {
//     return res.redirect('/')
//   }

//   const MODEL = await getModel(page)
//   return MODEL
// }



module.exports = app