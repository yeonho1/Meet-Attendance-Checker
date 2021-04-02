let list = '[]';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ list });
});