// #region IMPORTS
const express = require('express')
const mongoose = require('../db/mongoose')

const Cat = require('../db/models/utils/categoryModel')

const app = express.Router()
// #endregion


const dom = 'category'


// #region GET:
app.get('/category/:page/add', async (req, res) => {
  const page = req.params.page
  const data = await Cat.find({category: page})
  res.render('mains/add', {
    dom,
    title: `Add new ${page} category`
  })
})

app.get('/category/:page/', async (req, res) => {
  const page = req.params.page
  const data = await Cat.find({category: page})
  res.render('mains/list', {
    dom, data,
    title: 'Categories'
  })
})

app.get('/category/', async (req, res) => {
  res.render('mains/list', {
    dom,
    title: 'Categories'
  })
})


app.get('/category/add/', async (req, res) => {
  res.render('mains/add', {
    dom,
    title: 'Categories'
  })
})
// #endregion


// #region POST:
app.post('/category/add/', async (req, res) => {
  const cat = new Cat()
  cat.name = req.body.name
  cat.category = req.body.category
  if (req.body.picture == '/imgs/foods/plate.png') req.body.picture = ''
  cat.picture = req.body.picture
  await cat.save()
  res.send(cat)
})
// #endregion


// #region FETCH:
app.get('/category/datalists/', async (req, res) => {
  const data = {}
  res.send(data)
})

// #endregion


module.exports = app