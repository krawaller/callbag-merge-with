const merge = require("callbag-merge");

const mergeWith = (...newSources) => current => merge(current, ...newSources);

module.exports = mergeWith;
