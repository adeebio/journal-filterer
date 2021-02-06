const { filter } = require("./filter");
const { getEntries } = require("./getEntries");
const { validate } = require("./validate");

const {
    pathToJournalDir,
    pathToEntriesDir,
    pathToOutputDir,
    filters
} = validate(process.argv);

const entries = getEntries(pathToEntriesDir);

filter(entries, filters, pathToOutputDir);
