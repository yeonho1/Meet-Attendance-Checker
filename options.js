function onSaveClick(event) {
    var list = JSON.stringify(document.getElementById("list_text").value.split(/\r?\n/));
    console.log(list);
    chrome.storage.local.set({ list });
}

let textfield = document.getElementById('list_text');

let saveButton = document.getElementById("save");
saveButton.addEventListener('click', onSaveClick);

chrome.storage.local.get("list", ({ list }) => {
    textfield.value = JSON.parse(list).join('\n');
})