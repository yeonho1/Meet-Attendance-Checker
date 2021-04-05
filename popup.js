let set = document.getElementById("attendance_list");

let optionButton = document.getElementById("openOptions");
optionButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
})

const copyToClipBoard = (str) =>
{
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

function copyClick() {
    copyToClipBoard(set.innerText);
}

let copyButton = document.getElementById("copy");
copyButton.addEventListener('click', copyClick);

function update() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        if (currTab) {
            chrome.tabs.sendMessage(currTab.id, {text: "participants"}, function(result) {
                if (result == null || chrome.runtime.lastError) {
                    set.innerHTML = "참여자 정보를 가져올 수 없습니다.";
                    set.innerHTML += "<br>현재 열린 페이지가 Google Meet 페이지인지,";
                    set.innerHTML += "<br>참여자 리스트가 열려 있는지 확인하십시오.";
                    copyButton.disabled = true;
                } else {
                    chrome.storage.local.get("list", ({ list }) => {
                        var l = JSON.parse(list);
                        var i;
                        var att_count = 0;
                        var abs_count = 0;
                        let allString = "";
                        for (i = 0; i < l.length; i++) {
                            var emoji = " &#10060; ";
                            let style = ""
                            if (result.includes(l[i])) {
                                emoji = " &#9989; ";
                                style = "color: green;";
                                att_count += 1;
                            } else {
                                style = "color: red;";
                                abs_count += 1;
                            }
                            allString += "<span style='" + style + "'>" + l[i] + "</span>";
                            allString += "<span>" + emoji + "</span>";
                            if ((i + 1) % 3 == 0) {
                                allString += "<br>"
                            }
                        }
                        allString = "&#9989; 출석 / &#10060; 결석<br>(" + att_count + "명 출석, " + abs_count + "명 결석)<br>" + allString;
                        set.innerHTML = allString;
                        copyButton.disabled = false;
                    });
                }
            });
        }
    });
}

update();

setInterval(update, 3000);