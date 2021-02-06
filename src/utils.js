const fs = require("fs");

function ensurePathExists(path) {
    for (let i = 0; i < path.length; i++) {
        if (path[i] === "/" || i === path.length - 1) {
            const pathPart = path.substr(0, i + 1);
            
            if (!fs.existsSync(pathPart)) fs.mkdirSync(pathPart);
        }
    }
}

function dateStrToTimeObj(dateStr) {
    const time = {
        num: null,
        year: null,
        month: null,
        date: null
    };

    const time_yearStr = dateStr.substring(0, 2);
    const time_monthStr = dateStr.substring(3, 5);
    const time_dateStr = dateStr.substring(6, 8);

    time.year = Number(time_yearStr);
    time.month = Number(time_monthStr);
    time.date = Number(time_dateStr);

    time.num = 0;
    time.num += time.year * 10000;
    time.num += time.month * 100;
    time.num += time.date;

    return time;
}

module.exports = {
    utils: {
        ensurePathExists,
        dateStrToTimeObj
    }
};
