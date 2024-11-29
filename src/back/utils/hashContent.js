const crypto = require('crypto')


const hashContent = (content) => {
  return crypto.createHash('sha256').update(content).digest('hex')
}


module.exports = {
  hashContent
}