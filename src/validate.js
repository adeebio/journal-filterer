const fs = require("fs");
const path = require("path");

const { utils } = require("./utils");

function validate(args) {
    if (args.length !== 4) {
        console.error("Error: Incorrect number of arguments.");
        process.exit();
    }

    const pathToJournalDir = args[2];
    const nameOfFilterFileWithoutExt = args[3];

    const {
        pathToEntriesDir,
        pathToFiltersDir,
        pathToOutputDir
    } = checkThatDirsExist(pathToJournalDir);

    const filters = checkFilters(path.join(pathToFiltersDir, `${nameOfFilterFileWithoutExt}.json`));

    return {
        pathToJournalDir,
        pathToEntriesDir,
        pathToOutputDir,
        filters
    };
}

function checkThatDirsExist(pathToJournalDir) {
    const paths = {
        pathToEntriesDir: null,
        pathToFiltersDir: null,
        pathToOutputDir: null
    };

    if (
        fs.existsSync(path.join(pathToJournalDir, "entries")) &&
        fs.existsSync(path.join(pathToJournalDir, "filters"))
    ) {
        paths.pathToEntriesDir = path.join(pathToJournalDir, "entries");
        paths.pathToFiltersDir = path.join(pathToJournalDir, "filters");
        paths.pathToOutputDir = path.join(pathToJournalDir, "output");
    } else if (
        fs.existsSync(path.join(pathToJournalDir, "Entries")) &&
        fs.existsSync(path.join(pathToJournalDir, "Filters"))
    ) {
        paths.pathToEntriesDir = path.join(pathToJournalDir, "Entries");
        paths.pathToFiltersDir = path.join(pathToJournalDir, "Filters");
        paths.pathToOutputDir = path.join(pathToJournalDir, "Output");
    } else {
        console.error("Error: Could not find the required folders.");
        process.exit();
    }

    if (fs.existsSync(paths.pathToOutputDir)) {
        fs.rmdirSync(paths.pathToOutputDir, { recursive: true });
    }

    utils.ensurePathExists(paths.pathToOutputDir);

    return paths;
}

function checkFilters(pathToFiltersFile) {
    let filters;

    if (fs.existsSync(pathToFiltersFile)) {
        filters = JSON.parse(fs.readFileSync(pathToFiltersFile, "utf8"));
    } else {
        console.error("Error: Could not find the specified filter file.");
        process.exit();
    }

    // TODO: check the filters

    return filters;
}

module.exports = {
    validate
};
