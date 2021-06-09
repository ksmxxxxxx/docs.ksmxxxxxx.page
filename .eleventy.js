const { Settings, DateTime } = require('luxon')
const pug = require('pug')

module.exports = function (eleventyConfig) {
  global.filters = eleventyConfig.javascriptFunctions
  eleventyConfig.addPassthroughCopy('_sources/images')
  eleventyConfig.setLibrary('pug', pug)
  eleventyConfig.setPugOptions({
    filters: global.filters
  })

  Settings.defaultZoneName = 'Asia/Tokyo'

  eleventyConfig.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj).toISO()
  })

  eleventyConfig.addFilter('readableDate', dataObj => {
    return DateTime.fromJSDate(dataObj).toFormat('yyyy年MM月dd日 HH時mm分')
  })

  return {
    dir: {
      input: '_sources',
      data: '_data'
    },
    markdownTemplateEngine: 'md'
  }
}
