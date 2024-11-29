// #region IMPORTS
const express = require('express')
const mongoose = require('../db/mongoose')
const cron = require('node-cron')
const pup = require('puppeteer')
// const crypto = require('crypto')
const jsdiff = require('diff')
const fs = require('fs')
const fsp = require('fs').promises

const J = require('../db/models/utils/cronModel')
const Cat = require('../db/models/utils/categoryModel')
const Cal = require('../db/models/calendarModel')
const P = require('../db/models/peopleModel')

// HELPER:
const { hashContent } = require('../back/utils/hashContent')
const { imageResize } = require('../back/utils/imageResize')
const { threePuppets } = require('../back/utils/threePuppets')


const app = express.Router()

// #endregion


// #region
cron.schedule('00 11 * * *', async () => {
  const urls = await monitorUrls()
  const bdys = await monitorBday()
  await deleteOld()
})
// #endregion


// #region HELPER: bdays
const monitorBday = async () => {
  console.info('currently cronning birthdays...')
  const ppl = await P.find({variety: 'friend'})
  const today = new Date()
  const day7 = new Date()
  day7.setDate(today.getDate() + 7)
  for (const x of ppl) {
    const day = x.birthday.getDate()
    const month = x.birthday.getMonth()

    const thisYear = new Date(today.getFullYear(), month, day + 1)
    const nextYear = new Date(today.getFullYear() + 1, month, day + 1)

    if(thisYear >= today && thisYear <= day7) {
      await saveBday(x)
    }

    if(nextYear >= today && nextYear <= day7) {
      await saveBday(x)
    }
  }

  return true
}

const saveBday = async data => {
  const minder = await Cal.findOne({name: data.name, variety: 'minder'}) || new Cal()
  const expiry = getExpiry(7)
  const p = await Ppl.findOne({name: data.name})

  minder.name = data.name
  minder.picture = data.picture
  minder.site = `/show/friend/${p._id}`
  minder.minder = {}
  minder.minder.type = 'birthday'
  minder.variety = 'minder'
  minder.minder.expiry = expiry

  await minder.save()
  return true
}
// #endregion


// #region
const monitorUrls = async () => {
  try {
    const active = await Cat.findOne({name: 'active', category: 'check'})
    const items = await J.find({status: active._id})
    const today = new Date()
    const data = {}

    // #region RUNNING THROUGH ALL ITEMS IN DB
    for (const item of items) {
      console.info('currently cronning...', item.name)
      const {page, browser} = await threePuppets(item.site)
      try {
        // #region GET THE KEY CONTENT FROM THE PAGE
        let content
        if(!item.tag) {
          content = await page.content()
        }
        else {
          content = await page.evaluate(tag => {
            const element = document.querySelector(tag)
            return element ? element.outerHTML : null
          }, item.tag)
        }
        // ABOVE:
        const newHash = hashContent(content)
        // #endregion

        // #region ADD CHANGES TO UPDATES ARRAY
        if (newHash !== item.hash) {
          const today = new Date()
          const pastDate = new Date(today)
          pastDate.setDate(today.getDate() - item.keepFor)

          const query = {
            name: item.name,
            variety: 'minder',
            time: { $gte: pastDate }
          }

          item.notes = item.notes || ''
          //page has changed
          const diff = jsdiff.diffLines(item.notes, content)

          const expiry = getExpiry(item.keepFor)

          const update = await Cal.findOne(query) || new Cal()

          update.name = item.name,
          update.site = item.site,
          update.picture = item.picture,
          update.minder = {
            diff: diff,
            type: 'urlmonitor',
            expiry: expiry
          },
          update.variety = 'minder',
          await update.save()


          // update db to reflect new state of the monitored page
          item.diff = diff
          item.hash = newHash
          item.notes = content
          item.number = 0
          await item.save()
        } else {
          item.number ++
          await item.save()
        }

        // #endregion
      } catch (err) {
        console.error(`Error processing item ${item.name}:`, err)
      } finally {
        await browser.close();
      }
    }
    // #endregion
  } catch (err) {
    console.error('Error in cron job:', err)
  }
  return true
}


const deleteOld = async () => {
  const data = await Cal.find({variety: 'minder'})
  const today = new Date()
  for (const d of data) {
    if (d.minder.expiry < today) {
      await d.deleteOne()
    }
  }
}



const getExpiry = days => {
  const expiry = new Date()
  const today = new Date()
  expiry.setDate(today.getDate() + Number(days))
  return expiry
}
// #endregion


module.exports = app