let set = document.getElementById("attendance_list");

function update() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        if (currTab) {
            chrome.tabs.sendMessage(currTab.id, {text: "participants"}, function(result) {
                chrome.storage.sync.get("list", ({ list }) => {
                    set.innerHTML = '';
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
                        emoji.style.fontFamily = "Symbola";
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
                })
            });
        }
    });
}

update();

setInterval(update, 3000);