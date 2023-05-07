const { Settings, DateTime } = require('luxon')
const eleventySass = require('eleventy-sass')
const pug = require('pug')
const markdownIt = require('markdown-it')
const markdownItFootnote = require('markdown-it-footnote')
const pluginRss = require("@11ty/eleventy-plugin-rss")


module.exports = function (eleventyConfig) {
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
    typographer: true,
  })
    .use(markdownItFootnote)

  global.filters = eleventyConfig.javascriptFunctions
  eleventyConfig.addPlugin(eleventySass)
  eleventyConfig.addPassthroughCopy('_sources/images')
  eleventyConfig.setLibrary('md', markdownLibrary)
  eleventyConfig.setLibrary('pug', pug)

  eleventyConfig.setPugOptions({
    filters: global.filters
  })

  Settings.defaultZone = 'Asia/Tokyo'
  eleventyConfig.addFilter('htmlDateString', dateObj => DateTime.fromJSDate(dateObj).toISO())
  eleventyConfig.addFilter('readableDate', dataObj => DateTime.fromJSDate(dataObj).toFormat('yyyy年MM月dd日 HH時mm分'))
  eleventyConfig.addCollection('articles', collection => collection.getFilteredByGlob('**/articles/*.md'))

  eleventyConfig.addPlugin(pluginRss)

  return {
    dir: {
      input: '_sources',
      data: '_data'
    }
  }
}
