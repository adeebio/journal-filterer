const fs = require("fs");
const path = require("path");

const { utils } = require("./utils");

function getEntries(pathToEntriesDir) {
    const files = getListOfMdFiles(pathToEntriesDir);

    const entries = {};

    for (const file of files) {
        const pathToFile = path.join(pathToEntriesDir, file);
        const fileLines = fs.readFileSync(pathToFile, "utf8").split(/\r?\n/);

        let entryLines = [];
        let foundFirstEntry = false;

        for (const line of fileLines) {
            switch (foundFirstEntry) {
                case false: {
                    if (line.startsWith("## ")) {
                        foundFirstEntry = true;
                        entryLines.push(line);
                    }

                    break;
                }

                case true: {
                    if (line.startsWith("## ")) {
                        const entry = parseEntryLines(entryLines);
                        entries[entry.title] = entry;
                        entryLines = [];
                    }

                    entryLines.push(line);

                    break;
                }
            }
        }

        if (entryLines.length !== 0) {
            const entry = parseEntryLines(entryLines);
            entries[entry.title] = entry;
            entryLines = [];
        }
    }

    return entries;
}

function getListOfMdFiles(pathToEntriesDir) {
    const files = fs.readdirSync(pathToEntriesDir);
    return files.filter((file) => {return file.endsWith(".md");});
}

function parseEntryLines(entryLines) {
    const entry = {
        lines: entryLines.slice(),
        title: null,
        time: {
            num: null,
            year: null,
            month: null,
            date: null
        },
        tags: [],
        output: false
    };

    for (const line of entryLines) {
        if (line.startsWith("## ")) {
            entry.title = line;

            const dateStr = line.substring(3, 11);
            entry.time = utils.dateStrToTimeObj(dateStr);
        }

        if (line.startsWith("> TAGS: ")) {
            let tagBuffer = "";
            let extractingTag = false;

            for (let i = 0; i < line.length; i++) {
                const c = line[i];

                switch (extractingTag) {
                    case false: {
                        if (c === "`") {
                            extractingTag = true;
                        }

                        break;
                    }

                    case true: {
                        if (c === "`") {
                            if (!entry.tags.includes(tagBuffer)) {
                                entry.tags.push(tagBuffer);
                            }

                            tagBuffer = "";
                            
                            extractingTag = false;
                        } else {
                            tagBuffer += c;
                        }

                        break;
                    }
                }
            }
        }
    }

    if (entry.lines[entry.lines.length - 1] !== "") entry.lines.push("");

    return entry;
}

module.exports = {
    getEntries
};
