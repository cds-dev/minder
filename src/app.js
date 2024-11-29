// #region IMPORTS
const ex = require('express')
const app = ex()
const port = process.env.PORT || 80
require('./db/mongoose')
const compression = require('compression')
const https = require('https')
const fs = require('fs')
// bodyParser so that form can directly submit to the server
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  parameterLimit: 10000000,
  extended: true,
  limit: '50mb'
}))

app.use(ex.json())
// #endregion


// #region IMPORT UTILS
const { formatDate } = require('./back/utils/formatDate.js')
const { getDateList } = require('./back/utils/getDateList')
// #endregion


// #region IMPORT MODELS
const Cal = require('./db/models/calendarModel')
const F = require('./db/models/foodModel')
// #endregion



// #region PATHS
const path = require('path')
const dir = path.join(__dirname)
const views = path.join(__dirname, 'views')
const static = path.join(__dirname, 'src')
app.use('/imgs', ex.static(path.join(dir, 'src', 'imgs')))


app.use(ex.static(dir))
app.use(ex.static(static))


const options = {
  key: fs.readFileSync(path.join(__dirname, 'app.test-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'app.test.pem'))
}

const session = require('express-session');
app.use(session({ secret: 'your-secret', resave: false, saveUninitialized: true }))

// #endregion


// #region HANDLEBARS

const hbs = require('hbs')
const { createSecureContext } = require('tls')

app.set('view engine', 'hbs')
app.set('views', views)
app.set('view options', { layout: 'index' })
hbs.registerPartials(views)

/* handlebars helpers */
// repeats block of code n times
hbs.registerHelper('times', function(n, block) {
  let result = ''
  for (let i = 0; i < n; i++) {
    result += block.fn(i + 1)
  }
  return result
})


hbs.registerHelper('eq', function(a, b, options) {
  if (typeof b == 'number' || typeof b == 'boolean' || (typeof b == 'string' && !b.includes(' '))) {
    const presetValues = b
    if (a == b) { return options.fn(this) }
    return options.inverse(this)
  }
  else if (b.includes(' ')) {
    const presetValues = b.split(' ').map(val => val.trim())
    if (presetValues.includes(a)) {
      return options.fn(this)
    } else {
      return options.inverse(this)
    }
  }
})


hbs.registerHelper('filter', function(items, category) {
  return items.filter(item => item.category === category)
})


hbs.registerHelper('ne', function(a, b, options) {
  let presetValues
  if (typeof b == 'number') {
    if (b !== a) return options.fn(this)
    else return options.inverse(this)
  }
  else if (b.includes(' ')) {
    presetValues = b.split(' ').map(val => val.trim())
    if (!presetValues.includes(a)) {
      return options.fn(this) // Execute the block if condition is true
    } else {
      return options.inverse(this) // Execute the else block if condition is false
    }
  }
  else {
    if (a !== b) { return options.fn(this) }
    return options.inverse(this)
  }
})


hbs.registerHelper('co', function (a, b, options) {
  if (a == b) { return options.fn(this) }
  return options.inverse(this)
})


hbs.registerHelper('or', function () {
  const args = Array.prototype.slice.call(arguments)

  for (let i = 0; i < args.length - 1; i++) {
    if (typeof args[i] == 'string') {
      return args[i]
    }
  }
  return args[args.length - 1]
})


hbs.registerHelper("inc", function(value, options) {
    return parseInt(value) + 1
})

// #endregion


// #region IMPORT ROUTERS
const categoryRouter = require('./routers/categoryRouter.js')
app.use(categoryRouter)

const cronRouter = require('./routers/cronRouter.js')
app.use(cronRouter)

const datalistRouter = require('./routers/datalistRouter.js')
app.use(datalistRouter)

const deleteRouter = require('./routers/deleteRouter.js')
app.use(deleteRouter)

// const diaryRouter = require('./routers/-ždiaryRouter.js')
// app.use(diaryRouter)

const editRouter = require('./routers/editRouter.js')
app.use(editRouter)

const featuresRouter = require('./routers/featuresRouter.js')
app.use(featuresRouter)

const fetchRouter = require('./routers/fetchRouter.js')
app.use(fetchRouter)

const postFetchRouter = require('./routers/postFetchRouter.js')
app.use(postFetchRouter)

const flashRouter = require('./routers/flashRouter.js')
app.use(flashRouter)

const listRouter = require('./routers/listRouter.js')
app.use(listRouter)

const puppetRouter = require('./routers/puppetRouter.js')
app.use(puppetRouter)

const recipeRouter = require('./routers/recipeRouter.js')
app.use(recipeRouter)

const showRouter = require('./routers/showRouter.js')
app.use(showRouter)

const utilsRouter = require('./routers/utilsRouter.js')
app.use(utilsRouter)
// #endregion


// #region ROUTES
app.get('/markup/', async (req, res) => {
  res.render('utils/markup', {title: 'Markdown guide'})
})



app.get('/', async (req, res) => {
  const allDates = await getDateList('front', req)

  const message = req.session.message
  delete req.session.message

  res.render('front', {
    message,
    allDates,
    title: "Welcome to your mind's OS", dom: 'front'
  })
})



app.get('*', (req, res) => {
  req.session.message = `URL ${req.originalUrl} not found`
  res.redirect('/')
})
// #endregion


// app.listen(port, '0.0.0.0', () => {
//   console.warn(`Minder running at ${process.env.URL}, on port ${port}...`)
// })

https.createServer(options, app).listen(port, '0.0.0.0', () => {
  console.warn(`Minder running at ${process.env.URL}, on port ${port}...`)
})
