const { Settings, DateTime } = require('luxon')
const eleventySass = require('eleventy-sass')
const pug = require('pug')

module.exports = function (eleventyConfig) {
  global.filters = eleventyConfig.javascriptFunctions
  eleventyConfig.addPlugin(eleventySass)
  eleventyConfig.addPassthroughCopy('_sources/images')
  eleventyConfig.setLibrary('pug', pug)

  eleventyConfig.setPugOptions({
    filters: global.filters
  })

  Settings.defaultZone = 'Asia/Tokyo'
  eleventyConfig.addFilter('htmlDateString', dateObj => DateTime.fromJSDate(dateObj).toISO())
  eleventyConfig.addFilter('readableDate', dataObj => DateTime.fromJSDate(dataObj).toFormat('yyyy年MM月dd日 HH時mm分'))
  eleventyConfig.addCollection('articles', collection => collection.getFilteredByGlob('**/articles/*.md'))

  return {
    dir: {
      input: '_sources',
      data: '_data'
    }
  }
}
