module.exports = function(eleventyConfig) {
  
  // Φίλτρο για να διαβάζει σωστά το Markdown (Εικόνες, Bold, Παραγράφους)
  eleventyConfig.addFilter("markdown", function(value) {
      if (!value) return "";
      let markdown = require("markdown-it")({ html: true, breaks: true });
      return markdown.render(value);
  });

  // Λέμε στο σύστημα να αντιγράφει φώτο, ήχο και το admin panel όπως είναι
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
