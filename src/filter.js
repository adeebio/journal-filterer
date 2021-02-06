const fs = require("fs");
const path = require("path");

const { utils } = require("./utils");

function filter(entries, filters, pathToOutputDir) {
    if (filters.hasOwnProperty("tags"))
        filter_tags(entries, filters.tags, pathToOutputDir);

    if (filters.hasOwnProperty("entries"))
        filter_entries(entries, filters.entries, pathToOutputDir);
}

function filter_tags(entries, tagFilters, pathToOutputDir) {
    const entryTitles_all = Object.getOwnPropertyNames(entries).sort();

    for (const tagFilter of tagFilters) {
        const timeObj_date_start = utils.dateStrToTimeObj(tagFilter.date_start);
        const timeObj_date_end = utils.dateStrToTimeObj(tagFilter.date_end);
        const tags = [];

        for (const entryTitle of entryTitles_all) {
            if (
                entries[entryTitle].time.num >= timeObj_date_start.num &&
                entries[entryTitle].time.num <= timeObj_date_end.num
            ) {
                for (const tag of entries[entryTitle].tags) {
                    if (!tags.includes(tag)) {
                        tags.push(tag);
                    }
                }
            }
        }

        const tags_order_date = tags.slice();
        const tags_order_alph = tags.sort();
        let fileContents_tags_order_date = "";
        let fileContents_tags_order_alph = "";
        for (const tag of tags_order_date) fileContents_tags_order_date += `${tag}\n`;
        for (const tag of tags_order_alph) fileContents_tags_order_alph += `${tag}\n`;
        let fileContents = "";
        fileContents += `Tags in order of date\n`;
        fileContents += `---------------------\n\n`;
        fileContents += fileContents_tags_order_date;
        fileContents += `\n`;
        fileContents += `Tags in alphabetical order\n`;
        fileContents += `--------------------------\n\n`;
        fileContents += fileContents_tags_order_alph;

        const filePath = `${pathToOutputDir}/${tagFilter.filename}.txt`;
        fs.writeFileSync(filePath, fileContents);
    }
}

function filter_entries(entries, entryFilters, pathToOutputDir) {
    const entryTitles_all = Object.getOwnPropertyNames(entries).sort();

    for (const entryFilter of entryFilters) {
        const timeObj_date_start = utils.dateStrToTimeObj(entryFilter.date_start);
        const timeObj_date_end = utils.dateStrToTimeObj(entryFilter.date_end);
        const entryTitles_inRange = [];

        for (const entryTitle of entryTitles_all) {
            if (
                entries[entryTitle].time.num >= timeObj_date_start.num &&
                entries[entryTitle].time.num <= timeObj_date_end.num
            ) {
                entryTitles_inRange.push(entryTitle);
            }
        }

        for (const entryTitle of entryTitles_inRange) {
            entries[entryTitle].output = false;
        }

        for (const action of entryFilter.actions) {
            const actionBool = (action[0] === "+") ? true : false;
            const actionTags = action.slice(1, action.length);
            const specialCase = (actionTags.length > 0) ? false : true;
        
            if (specialCase) {
                for (const entryTitle of entryTitles_inRange) {
                    entries[entryTitle].output = actionBool;
                }
            } else {
                for (const entryTitle of entryTitles_inRange) {
                    const entryTags = entries[entryTitle].tags;
                    if (actionTags.some(actionTag => entryTags.indexOf(actionTag) >= 0)) {
                        entries[entryTitle].output = actionBool;
                    }
                }
            }
        }

        let fileContents = "";
        for (const entryTitle of entryTitles_inRange) {
            if (entries[entryTitle].output === true) {
                fileContents += entries[entryTitle].lines.join("\n") + "\n";
            }
        }
        fileContents = fileContents.slice(0, fileContents.length - 1);
        const filePath = `${pathToOutputDir}/${entryFilter.filename}.md`;
        fs.writeFileSync(filePath, fileContents);
    }
}

module.exports = {
    filter
};
