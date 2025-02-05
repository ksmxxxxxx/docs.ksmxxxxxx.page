import { Settings, DateTime } from 'luxon'
import { Liquid } from 'liquidjs'
import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItFootnote from 'markdown-it-footnote'
import pluginTOC from 'eleventy-plugin-toc'
import pluginRss from '@11ty/eleventy-plugin-rss'

export default function (eleventyConfig) {
  global.filters = eleventyConfig.javascriptFunctions

  const markdownOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  }

  const markdownAnchorOptions = {
    class: 'anchor-link',
    symbol: '#'
  }

  const liquidOptions = {
    extname: '.liquid',
    dynamicPartials: false,
    staticFilters: false,
    root: ['_sources/_includes']
  }

  eleventyConfig.addPlugin(pluginRss)
  eleventyConfig.addPlugin(pluginTOC, {
    tags: ['h2', 'h3'],
    wrapper: 'div',
    ul: true
  })

  Settings.defaultZone = 'Asia/Tokyo'
  eleventyConfig.addFilter('htmlDateString', (dateObj) =>
    DateTime.fromJSDate(dateObj).toISO()
  )
  eleventyConfig.addFilter('readableDate', (dataObj) =>
    DateTime.fromJSDate(dataObj).toFormat('yyyy年MM月dd日 HH時mm分')
  )

  eleventyConfig.addPassthroughCopy('_sources/images')
  eleventyConfig.addPassthroughCopy('_sources/_redirects')
  eleventyConfig.setLibrary('liquid', new Liquid(liquidOptions))
  eleventyConfig.setLibrary(
    'md',
    markdownIt(markdownOptions)
      .use(markdownItFootnote)
      .use(markdownItAnchor, markdownAnchorOptions)
  )

  eleventyConfig.setLiquidOptions({ jsTruthy: true })

  eleventyConfig.addCollection('articles', (collection) =>
    collection.getFilteredByGlob('**/articles/*.md')
  )

  return {
    dir: {
      input: '_sources',
      data: '_data'
    }
  }
}
