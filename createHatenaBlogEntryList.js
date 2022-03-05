require('dotenv').config()

const axios = require('axios').default
const xml2js = require('xml2js')
const { Settings, DateTime } = require('luxon')
const fs = require('fs')

Settings.defaultZone = 'Asia/Tokyo'

async function getHatenaBlogEntryXmlData (url) {
  try {
    const response = await axios.get(url, {
      auth: {
        username: process.env.HATENA_NAME,
        password: process.env.HATENA_PASS
      }
    })
    return response.data
  } catch (error) {
    return error.response.data
  }
}

async function parseXml2Json (data) {
  return xml2js.parseStringPromise(data.toString()).then(result => {
    return result.feed.entry
  }).catch(err => {
    return err.message
  })
}

function extractBlogEntry (data) {
  const extractData = []
  for (const e of data) {
    if (e['app:control'][0]['app:draft'][0] === 'yes') continue
    const item = {
      htmldate: e.published.join('').toString(),
      displaydate: DateTime.fromISO(e.published.join('').toString()).toFormat('yyyy年MM月dd日 HH時mm分'),
      title: e.title.join('').toString(),
      href: e.link[1].$.href
    }
    extractData.push(item)
  }
  return extractData.slice(0, 5)
}

async function createHatenaBlogEntryListFile () {
  const url = 'https://blog.hatena.ne.jp/ksmxxxxxx/ksmxxxxxx.hatenablog.com/atom/entry'
  const hatenaXml = await getHatenaBlogEntryXmlData(url)
  const parse2json = await parseXml2Json(hatenaXml)
  const hatenaBlogEntryItems = extractBlogEntry(parse2json)
  fs.writeFileSync('./_sources/_data/hatenaBlogEntryItems.json', JSON.stringify(hatenaBlogEntryItems, null, '  '))
}

createHatenaBlogEntryListFile()
