# awesome-feeds - Community curated RSS feeds

This project is intended to collect community curated RSS feeds (ordered by category).

**You can contribute by forking this project and creating a PR (pull request).**

The data is stored in simple CSV files, which are in the `/csv`-folder and can be converted to JSON and Markdown with running `node generate.js`.

The CSV files follow this pattern:

```
title,description,url
"ENTRY-1-TITLE","ENTRY-1-DESCRIPTION","ENTRY-1-URL"
"ENTRY-2-TITLE","ENTRY-2-DESCRIPTION","ENTRY-2-URL"
...
```

The file name should equal `name.csv` where name equals either the topic ("tech"), the language ("de" - please use language codes like "de" for German or "fr" for French) or the topic and language ("tech_de").

Please only add your feed entries to the according CSV file, because all JSON and Markdown files get deleted when running the generation script.

Please run `node generate.js` before commiting. This requires [Node.js](https://nodejs.org) installed on your machine.

## License

<a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/"><img alt="Creative Commons License" style="border-width:0" src="https://i.creativecommons.org/l/by-sa/4.0/88x31.png" /></a><br />This work is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/4.0/">Creative Commons Attribution-ShareAlike 4.0 International License</a>.