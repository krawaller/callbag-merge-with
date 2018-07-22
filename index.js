import merge from "callbag-merge";

const mergeWith = (...newSources) => current => merge(current, ...newSources);

export default mergeWith;
