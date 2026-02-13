module.exports = function(eleventyConfig) {
  
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