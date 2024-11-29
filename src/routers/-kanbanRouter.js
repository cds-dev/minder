// #region IMPORTS
const express = require('express')
const app = express.Router()
const { ObjectID } = require('mongodb')


// const Cat = require('../db/models/utils/categoryModel')
// const K = require('../db/models/kanbanModel')
// #endregion

const dom = 'kanban'

// #region GET:
// app.get('/kanban/show/:id', async (req, res) => {
//   const data = await K.findById(req.params.id)
//   .populate('status')

//   const statuses = await Cat.find({category: 'status'})

//   res.render('mains/show', {
//     title: 'Kanban board',
//     dom, data, statuses
//   })
// })


// app.get('/kanban/edit/:id', async (req, res) => {
//   const data = await K.findById(req.params.id)
//   .populate('category')
//   const main = await Cat.findOne({category: 'kanban', main: true})

//   res.render('mains/edit', {
//     title: 'Kanban board',
//     dom, data, main
//   })
// })


// app.get('/kanban/delete/:id', async (req, res) => {
//   const data = await K.findById(req.params.id)
//   res.render('mains/delete', {data, dom})
// })


// app.get('/kanban/add/', async (req, res) => {
//   const main = await Cat.findOne({category: 'kanban', main: true})
//   res.render('mains/add', {
//     title: 'Add kanban',
//     dom, main
//   })
// })

// #endregion

// #region POST:
// app.post('/kanban/add', async (req, res) => {
//   const newIdea = new K()
//   newIdea.name = req.body.name
//   const cat = await Cat.findOne({main: true})
//   newIdea.picture = req.body.picture || cat.picture
//   newIdea.site = req.body.site
//   newIdea.category = cat._id
//   const idea = await Cat.findOne({name: 'idea'})
//   newIdea.status = idea._id
//   newIdea.notes = []
//   req.body.notes.forEach(x => {
//     newIdea.notes.push(x)
//   })
//   await newIdea.save()
//   res.send(newIdea)
// })


// app.post('/kanban/edit/:id', async (req, res) => {
//   const newIdea = await K.findById(req.params.id)
//   newIdea.name = req.body.name
//   const cat = await Cat.findOne({main: true})
//   newIdea.picture = req.body.picture || cat.picture
//   newIdea.site = req.body.site
//   newIdea.category = cat._id
//   const idea = await Cat.findOne({name: 'idea'})
//   newIdea.status = idea._id
//   newIdea.notes = []
//   req.body.notes.forEach(x => {
//     newIdea.notes.push(x)
//   })
//   await newIdea.save()
//   res.send(newIdea)
// })
// #endregion

// #region FETCH:




// app.get('/kanban/datalists/', async (req, res) => {
//   const categories = await Cat.find({category: 'kanban'})
//   const data = {
//     categories
//   }
//   res.send(data)
// })





// #endregion


// app.get('/kanban/:cat?', async (req, res) => {
//   const def = await Cat.findOne({category: 'kanban', main: true})

//   const progress = await Cat.findOne({name: 'progress'})

//   req.params.cat = req.params.cat || def._id

//   const current = await Cat.findById(req.params.cat)
  
//   if(ObjectID.isValid(req.params.cat) && !def._id.equals(req.params.cat)) {
//     def.main = false
//     await def.save()
//     current.main = true
//     await current.save()

    
//     const statuses = await Cat.find({category: 'status'})
//     // ???????
//     for(const s of statuses) {
//       const kans = await K.find({category: current._id, status: s._id})
//       s.number = kans.length

//       await s.save()
//     }
//   }

//   const data = await K.find({
//     category: req.params.cat,
//     status: progress._id
//   })
//   .populate('status')

//   const submenu = await Cat.find({category: 'kanban'})

//   const statuses = await Cat.find({category: 'status'})

//   res.render('mains/list', {
//     dom, submenu, data,
//     total: data.length,
//     title: `Tasks for ${current.name}`,
//     statuses
//   })
// })

module.exports = app