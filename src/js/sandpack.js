import { loadSandpackClient } from "./sandpack/index.mjs";
// const { loadSandpackClient } = require("./sandpack/index.js");
 
async function main() {
  // Iframe selector or element itself
  const iframe = document.getElementById("iframe");
  
  // Files, environment and dependencies
  const content = {
    files: { 
      // We infer dependencies and the entry point from package.json 
      "/package.json": { code: JSON.stringify({
        main: "index.js",
        dependencies: { uuid: "latest" },
      })},
      
      // Main file
      "/index.js": { code: `console.log(require('uuid'))` }
    },
    environment: "vanilla"
  };
  
  // Optional options
  const options = {};
  
  // Properly load and mount the bundler
  const client = await loadSandpackClient(
    iframe, 
    content, 
    options
  );
}
console.log("here")
main();