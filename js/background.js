// let list = '[]';
let classes = [];

chrome.runtime.onInstalled.addListener(() => {
    // chrome.storage.local.set({ list });
    chrome.storage.local.set({ classes });
});