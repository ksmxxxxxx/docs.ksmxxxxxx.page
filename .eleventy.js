const { Settings, DateTime } = require('luxon')
const eleventySass = require('eleventy-sass')
const pug = require('pug')
const { Liquid } = require('liquidjs')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItFootnote = require('markdown-it-footnote')
const pluginTOC = require('eleventy-plugin-toc')
const pluginRss = require('@11ty/eleventy-plugin-rss')

module.exports = function (eleventyConfig) {
  const markdownOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  }

  const markdownAnchorOptions = {
    permalink: true,
    permalinkClass: 'anchor-link',
    permalinkSymbol: '#',
    level: [1, 2, 3, 4]
  }

  const liquidOptions = {
    extname: '.liquid',
    dynamicPartials: false,
    staticFilters: false,
    root: ['_includes']
  }

  global.filters = eleventyConfig.javascriptFunctions
  eleventyConfig.addPlugin(eleventySass)
  eleventyConfig.addPassthroughCopy('_sources/images')
  eleventyConfig.addPassthroughCopy('_sources/_redirects')
  eleventyConfig.setLibrary('pug', pug)
  eleventyConfig.setLibrary('liquid', new Liquid(liquidOptions))
  eleventyConfig.setLibrary('md',
    markdownIt(markdownOptions)
      .use(markdownItFootnote)
      .use(markdownItAnchor, markdownAnchorOptions)
  )

  eleventyConfig.setLiquidOptions({ jsTruthy: true })

  eleventyConfig.setPugOptions({
    filters: global.filters
  })

  Settings.defaultZone = 'Asia/Tokyo'
  eleventyConfig.addFilter('htmlDateString', dateObj => DateTime.fromJSDate(dateObj).toISO())
  eleventyConfig.addFilter('readableDate', dataObj => DateTime.fromJSDate(dataObj).toFormat('yyyy年MM月dd日 HH時mm分'))
  eleventyConfig.addCollection('articles', collection => collection.getFilteredByGlob('**/articles/*.md'))

  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'div',
    ul: true
  })

  return {
    dir: {
      input: '_sources',
      data: '_data'
    }
  }
}
