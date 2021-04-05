chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    if (msg.text && (msg.text == "participants")) {
        let items = document.getElementsByClassName("GvcuGe")
        let participantList = items[items.length - 1];
        if (participantList == null) {
            sendResponse(null);
        } else {
            var i;
            var result = [];
            for (i = 0; i < participantList.children.length; i++) {
                result.push(participantList.children[i].children[0].children[1].children[0].children[0].innerHTML)
            }
            sendResponse(result);
        }
    }
})