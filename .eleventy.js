module.exports = function (eleventyConfig) {
  const pug = require('pug')
  // eleventyConfig.setPugOptions({ debug: true })
  eleventyConfig.setLibrary('pug', pug)
  eleventyConfig.addPassthroughCopy('_sources/images')
  return {
    dir: {
      input: '_sources',
      data: '_data'
    },
    markdownTemplateEngine: 'md'
  }
}
