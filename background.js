let list = '[]';

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ list });
});