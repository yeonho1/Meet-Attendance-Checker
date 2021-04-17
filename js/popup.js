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

var attText = "";
var absText = "";
var countText = "";

function copyClick() {
    chrome.storage.local.get("when_copy", ({ when_copy }) => {
        switch(when_copy) {
            case "copy-all":
                copyToClipBoard(set.innerText);
                break;
            case "copy-att":
                copyToClipBoard(attText);
                break;
            case "copy-abs":
                copyToClipBoard(absText);
                break;
            case "copy-stat":
                copyToClipBoard(countText);
                break;
            default:
                copyToClipBoard(set.innerText);
                break;
        }
    });
}

let copyButton = document.getElementById("copy");
copyButton.addEventListener('click', copyClick);

var currClass = -1;

let dropdown = document.getElementById("class_select");

function updateClasses() {
    chrome.storage.local.get("classes", ({ classes }) => {
        console.log(classes);
        var i;
        dropdown.innerHTML = '<option value="nothing">-</option>';
        chrome.storage.local.get("lastclass", ({ lastclass }) => {
            var value = "nothing";
            for (i = 0; i < classes.length; i++) {
                let option = document.createElement("option");
                option.value = "class-" + classes[i].id;
                if (classes[i].id == lastclass) {
                    value = "class-" + classes[i].id;
                }
                option.innerHTML = classes[i].name;
                dropdown.appendChild(option);
            }
            dropdown.value = value;
            if (value == "nothing") {
                chrome.storage.local.set({"lastclass": 0});
            } else {
                currClass = parseInt(value.replace("class-", ""));
            }
            update();
        });
    });
}

function update() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0];
        if (currTab) {
            chrome.tabs.sendMessage(currTab.id, {text: "participants"}, function(result) {
                if (result == null || chrome.runtime.lastError) {
                    set.innerHTML = "<tr><td>참여자 정보를 가져올 수 없습니다.<br>";
                    set.innerHTML += "현재 열린 페이지가 Google Meet 페이지인지,<br>";
                    set.innerHTML += "참여자 리스트가 열려 있는지 확인하십시오.</td></tr>";
                    copyButton.disabled = true;
                    dropdown.value = "nothing";
                    dropdown.disabled = true;
                } else {
                    if (currClass < 1) {
                        set.innerHTML = "<tr><td>학급을 선택하여 주십시오.</td></tr>";
                        copyButton.disabled = true;
                    } else {
                        chrome.storage.local.get("classes", ({ classes }) => {
                            chrome.storage.local.get("when_copy", ({ when_copy }) => {
                                switch(when_copy) {
                                    case "copy-all":
                                        copyButton.innerHTML = "출석부 복사";
                                        break;
                                    case "copy-att":
                                        copyButton.innerHTML = "출석학생 명단 복사";
                                        break;
                                    case "copy-abs":
                                        copyButton.innerHTML = "결석학생 명단 복사";
                                        break;
                                    case "copy-stat":
                                        copyButton.innerHTML = "출결 통계 복사";
                                        break;
                                    default:
                                        copyButton.innerHTML = "출석부 복사";
                                        break;
                                }
                                for (var i = 0; i < classes.length; i++) {
                                    if (classes[i].id == currClass) {
                                        let l = classes[i].people;
                                        var att_count = 0;
                                        var abs_count = 0;
                                        let allString = "";
                                        var maxLength = 0;
                                        var curr_modulo = 0;
                                        attText = "";
                                        absText = "";
                                        countText = "";
                                        for (var j = 0; j < l.length; j++) {
                                            let searchName = l[j].replace(/(?:⎨)(.*)(?:⎬)/, "");
                                            let appearName = l[j].replace("⎨", "").replace("⎬", "");
                                            if (appearName.length > maxLength) {
                                                maxLength = l[j].length;
                                            }
                                            if (allString.endsWith("</tr>")) {
                                                allString += "<tr>";
                                            }
                                            var emoji = " &#10060; ";
                                            var emojiStyle = "";
                                            var style = "";
                                            if (result.includes(searchName)) {
                                                emoji = " &#9989; ";
                                                style = "color: green;";
                                                emojiStyle = "text-shadow: 0 0 0 green;";
                                                attText += "\n" + l[j];
                                                att_count += 1;
                                            } else {
                                                style = "color: red;";
                                                emojiStyle = "text-shadow: 0 0 0 red;";
                                                absText += "\n" + l[j];
                                                abs_count += 1;
                                            }
                                            allString += "<td><span style='" + style + "'>" + appearName + "</span>";
                                            allString += "<span style='" + emojiStyle + "'>" + emoji + "</span></td>";
                                            curr_modulo = (j+1) % 3;
                                            if (curr_modulo == 0) {
                                                allString += "</tr>"
                                            }
                                        }
                                        if (!(allString.endsWith("</tr>"))) {
                                            allString += "</tr>";
                                        }
                                        attText = "<출석 학생 명단 (총 " + att_count + "명)>" + attText + "\n<출석 명단 끝>";
                                        absText = "<결석 학생 명단 (총 " + abs_count + "명)>" + absText + "\n<결석 명단 끝>"
                                        allString = "<tr><td colspan='3'><span style='text-shadow: 0 0 0 green'>&#9989;</span> 출석 / <span style='text-shadow: 0 0 0 red'>&#10060;</span> 결석<br>(" + att_count + "명 출석, " + abs_count + "명 결석)</td></tr>" + allString;
                                        countText = "" + att_count + "명 출석, " + abs_count + "명 결석";
                                        set.innerHTML = allString;
                                        var width = 36 * (maxLength + 1) + 100;
                                        document.getElementById("body").style.width = width + "px";
                                        copyButton.disabled = false;
                                        break;
                                    }
                                }
                            });
                        })
                    }
                }
            });
        }
    });
}

dropdown.addEventListener("change", function() {
    if (dropdown.value.includes("class-")) {
        currClass = parseInt(dropdown.value.replace("class-", ""));
        chrome.storage.local.set({"lastclass": currClass});
    } else {
        currClass = -1;
    }
    update();
});

update();
updateClasses();

setInterval(update, 3000);