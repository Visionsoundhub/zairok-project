module.exports = function(eleventyConfig) {
  
  // Φίλτρο για να διαβάζει σωστά το Markdown (Εικόνες, Bold, Παραγράφους)
  eleventyConfig.addFilter("markdown", function(value) {
      if (!value) return "";
      let markdown = require("markdown-it")({ html: true, breaks: true });
      return markdown.render(value);
  });

  // Μόνο το πρώτο hero κάθε σελίδας είναι <h1> (ένα H1 ανά σελίδα)
  eleventyConfig.addFilter("firstHero", (blocks) => (blocks || []).find((b) => b.type === "hero"));

  // robots.txt, _headers, 404, εικονίδιο: αντιγράφονται όπως είναι
  eleventyConfig.addPassthroughCopy({ "src/static": "/" });

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
