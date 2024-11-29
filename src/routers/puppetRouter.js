// #region IMORTS
const express = require('express')
const mongoose = require('../db/mongoose')

const F = require('../db/models/foodModel')

const { threePuppets } = require('../back/utils/threePuppets')

const app = express.Router()

// #endregion



app.post('/puppeteer/', async (req, res) => {
  const {page, browser} = await threePuppets(req.body.url)
  const data = {}

  if (page) {
    // #region YOUTUBE vs blogs
    if(req.body.url.includes('youtube')) {
      const title = await page.evaluate(() => document.querySelector('title').innerHTML)

      const ch = await page.waitForSelector('.ytd-channel-name .ytd-channel-name a', { timeout: 5000 })
      .then(element => element.evaluate(el => el.innerHTML))
      .catch(() => null)

      const spans = await page.$$eval('.yt-core-attributed-string--link-inherit-color', elements =>
        elements.map(el => el.innerText)
      )

      const desc = spans.join(' ')

      data.name = title
      data.ch = ch
      data.desc = desc

      res.send(data)
    }
    else {
      const title = await page.evaluate(() => document.querySelector('title').innerHTML)
      data.title = title
      res.send(data)
    }

    await browser.close()
    // #endregion
  }
})



module.exports = app