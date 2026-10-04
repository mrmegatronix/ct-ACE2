const fs = require("fs");
const path = require("path");

const distDevPath = path.resolve(__dirname, "../dist/dev.html");
const distIndexPath = path.resolve(__dirname, "../dist/index.html");
const rootIndexPath = path.resolve(__dirname, "../index.html");

if (!fs.existsSync(distDevPath)) {
  console.error("dist/dev.html does not exist!");
  process.exit(1);
}

let html = fs.readFileSync(distDevPath, "utf8");

// 1. Ensure dark background on html and body
if (!html.includes('style="background-color: #0A0A0A; color: #FFFFFF;"')) {
  html = html.replace('<html lang="en">', '<html lang="en" style="background-color: #0A0A0A; color: #FFFFFF;">');
}

// 2. Find and relocate script from <head> to the end of <body> as classic non-module script
const scriptStart = html.indexOf('<script type="module" crossorigin>');
if (scriptStart !== -1) {
  const scriptEnd = html.indexOf("</script>", scriptStart) + "</script>".length;
  const scriptTag = html.substring(scriptStart, scriptEnd);
  const scriptContent = scriptTag.replace(/^<script[^>]*>/, "").replace(/<\/script>$/, "");
  
  // Remove from head
  html = html.substring(0, scriptStart) + html.substring(scriptEnd);
  
  // Remove modulepreload links
  html = html.replace(/<link rel="modulepreload"[^>]*>/g, "");
  
  // Insert as classic script before </body>
  const bodyClose = html.indexOf("</body>");
  if (bodyClose !== -1) {
    html = html.substring(0, bodyClose) + "<script>" + scriptContent + "</script>\n  " + html.substring(bodyClose);
  }
}

// 3. Write output to all target locations
fs.writeFileSync(distDevPath, html, "utf8");
fs.writeFileSync(distIndexPath, html, "utf8");
fs.writeFileSync(rootIndexPath, html, "utf8");

console.log("Postbuild complete: Resilient classic singlefile index.html generated (" + html.length + " bytes).");
