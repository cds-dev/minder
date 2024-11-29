const pup = require('puppeteer')


const threePuppets = async (url) => {
  let page
  let browser
  try {
    let success = false
    let attempts = 0
    const maxAttempts = 3

    browser = await pup.launch({
      args: ['--disable-http2']
    })
    page = await browser.newPage()

    while(!success && attempts < maxAttempts) {
      try {
        await page.goto(url, {
          waitUntil: 'networkidle2',
          timeout: 30000
        })

        success = true
      } catch (err) {
        attempts++
        console.warn(`Attempt ${attempts} to fetch ${url} failed:`, err)
        if (attempts >= maxAttempts) {
          throw new Error(`Failed to fetch ${url} after ${maxAttempts} attempts`)
        }
      }
    }
  } catch (err) {
    console.error(err)
  }
  return { page, browser }
}

module.exports = {
  threePuppets
}