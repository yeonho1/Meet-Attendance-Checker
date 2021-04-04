let set = document.getElementById("attendance_list");

let optionButton = document.getElementById("openOptions");
optionButton.addEventListener('click', function() {
    chrome.runtime.openOptionsPage();
})

function update() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        if (currTab) {
            chrome.tabs.sendMessage(currTab.id, {text: "participants"}, function(result) {
                set.innerHTML = '';
                if (result == null || chrome.runtime.lastError) {
                    let oops = document.createElement("span");
                    oops.innerHTML = "참여자 정보를 가져올 수 없습니다.<br>";
                    let info = document.createElement("span");
                    info.innerHTML = "현재 열린 페이지가 Google Meet 페이지인지,<br>참여자 리스트가 열려 있는지 확인하십시오."
                    set.appendChild(oops);
                    set.appendChild(info);
                } else {
                    chrome.storage.local.get("list", ({ list }) => {
                        let legend = document.createElement("span");
                        legend.innerHTML = "&#9989; 출석 / &#10060; 결석<br>(0명 출석, 0명 결석)";
                        let br = document.createElement("br");
                        set.appendChild(legend);
                        set.appendChild(br);
                        var l = JSON.parse(list);
                        var i;
                        var att_count = 0;
                        var abs_count = 0;
                        for (i = 0; i < l.length; i++) {
                            let parag = document.createElement("span");
                            let emoji = document.createElement("span");
                            if (result.includes(l[i])) {
                                parag.innerText = l[i];
                                parag.style.color = "green";
                                emoji.innerHTML = " &#9989; ";
                                att_count += 1;
                            } else {
                                parag.innerText = l[i];
                                parag.style.color = "red";
                                emoji.innerHTML = " &#10060; ";
                                abs_count += 1;
                            }
                            set.appendChild(parag);
                            set.appendChild(emoji);
                            if ((i + 1) % 3 == 0) {
                                let br = document.createElement("br");
                                set.appendChild(br);
                            }
                        }
                        legend.innerHTML = "&#9989; 출석 / &#10060; 결석<br>(" + att_count + "명 출석, " + abs_count + "명 결석)";
                    });
                }
            });
        }
    });
}

update();

setInterval(update, 3000);