function modifyClass(id, obj) {
    chrome.storage.local.get("classes", ({ classes }) => {
        var i;
        for (i = 0; i < classes.length; i++) {
            if (classes[i].id == id) {
                classes[i] = obj;
                break;
            }
        }
    });
}