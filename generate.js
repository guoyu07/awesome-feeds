// 2018 - Jan-Lukas Else
// Code to generate files

var fs = require('fs'),
  path = require('path');

var startTime = new Date().getTime();

// Remove old files
console.log("Remove old JSON and Markdown files...");
var directories = ["json", "md"];
for (var directory of directories) {
  fs.readdirSync(directory).forEach(fileName => {
    fs.unlink(path.join(directory, fileName), err => {
      if (err) console.error("Failed to delete " + fileName);
    });
  });
}

// Create new files
console.log("Create JSON and Markdown files...");
var directory = "csv";
fs.readdirSync(directory).forEach(fileName => {
  var file = path.join(directory, fileName);
  if (fs.statSync(file).isFile()
    && fileName.indexOf("." + directory) !== -1) {
    var name = fileName.replace("." + directory, "");
    var content = fs.readFileSync(file, "utf8");
    var jsObject = csvToJS(content);
    // Create JSON
    var json = JSON.stringify(jsObject);
    fs.writeFileSync("json/" + name + ".json", json);
    // Create Markdown
    var md = "# " + name.replace("_", " ").toUpperCase() + "\n\nTitle | Description | URL\n--- | --- | ---\n";
    for (var feed of jsObject) {
      md += (feed.title + " | " + feed.description + " | [URL](" + feed.url + ")\n")
    }
    fs.writeFileSync("md/" + name + ".md", md);
  }
});

// Finished
console.log('Finished in ' + (new Date().getTime() - startTime) + ' ms.');

// --- Helper functions ---

// Convert CSV to JS object (https://gist.github.com/jonmaim/7b896cf5c8cfe932a3dd)
function csvToJS(csv) {
  var lines = csv.split("\n");
  var result = [];
  var headers = lines[0].split(",");
  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var row = lines[i], queryIdx = 0, startValueIdx = 0, idx = 0;
    if (row.trim() === '') { continue; }
    while (idx < row.length) {
      /* if we meet a double quote we skip until the next one */
      var c = row[idx];
      if (c === '"') { do { c = row[++idx]; } while (c !== '"' && idx < row.length - 1); }
      if (c === ',' || /* handle end of line with no comma */ idx === row.length - 1) {
        /* we've got a value */
        var value = row.substr(startValueIdx, idx - startValueIdx).trim();
        /* skip first double quote */
        if (value[0] === '"') { value = value.substr(1); }
        /* skip last comma */
        if (value[value.length - 1] === ',') { value = value.substr(0, value.length - 1); }
        /* skip last double quote */
        if (value[value.length - 1] === '"') { value = value.substr(0, value.length - 1); }
        var key = headers[queryIdx++];
        obj[key] = value;
        startValueIdx = idx + 1;
      }
      ++idx;
    }
    result.push(obj);
  }
  return result;
}