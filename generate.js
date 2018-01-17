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
    var jsObject = parseCSV(content);
    console.log(parseCSV(content));
    // Create JSON
    var json = JSON.stringify(jsObject);
    fs.writeFileSync("json/" + name + ".json", json);
    // Create Markdown
    var md = "# " + name.replace("_", " ").toUpperCase() + "\n\nTitle | Description | URL\n--- | --- | ---";
    for (var feed of jsObject) {
      md += "\n" + (feed.title.replace("|", "&#124;") + " | " + feed.description.replace("|", "&#124;") + " | [URL](" + feed.url + ")")
    }
    fs.writeFileSync("md/" + name + ".md", md);
  }
});

// Finished
console.log('Finished in ' + (new Date().getTime() - startTime) + ' ms.');

// --- Helper functions ---

// https://gist.github.com/vgrichina/57796fb8d9a8ae41fc0d
function parseCSV(input) {
  input = fixLinebreaks(input);
  var separator = ',';
  var quote = '"';
  var inQuotes = false;
  var rows = [];
  var row = [];
  var value = "";
  for (var i = 0; i < input.length; i++) {
    var c = input[i];
    if (inQuotes) {
      if (c == quote) {
        if (input[i + 1] != quote) {
          inQuotes = false;
        } else {
          value += quote;
          i++;
        }
      } else {
        value += c;
      }
    } else {
      if (c == separator) {
        row.push(value);
        value = "";
      } else if (c == "\n") {
        row.push(value);
        rows.push(row);
        value = "";
        row = [];
      } else if (c == quote) {
        inQuotes = true;
      } else {
        value += c
      }
    }
  }
  if (value.length > 0) {
    row.push(value);
    rows.push(row);
  }
  return rowsToObjects(rows);
}

// fix linebreaks
function fixLinebreaks(input) {
  return input
  .replace(/\r\n|\r/g, "\n");
}

// convert row-arrays to JS objects
function rowsToObjects(rows) {
  var array = [];
  var headers = rows[0];
  for (var i = 1; i < rows.length; i++) {
    var row = rows[i];
    var object = {};
    for (var j = 0; j < row.length; j++) {
      var value = row[j];
      object[headers[j]] = value;
    }
    array.push(object);
  }
  return array;
}