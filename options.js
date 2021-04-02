function onSaveClick(event) {
    var list = JSON.stringify(document.getElementById("list_text").value.split(/\r?\n/));
    console.log(list);
    chrome.storage.sync.set({ list });
}

let textfield = document.getElementById('list_text');

let saveButton = document.getElementById("save");
saveButton.addEventListener('click', onSaveClick);

chrome.storage.sync.get("list", ({ list }) => {
    textfield.value = JSON.parse(list).join('\n');
})