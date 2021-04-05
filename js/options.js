/*
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
*/

let class_list = document.getElementById("class_list");

function updateClasses() {
    chrome.storage.local.get("classes", ({ classes }) => {
        console.log(classes)
        if (classes == undefined || classes.length == 0) {
            let inner = "<p>학급이 한 개도 없습니다. 지금 추가해보세요!</p>";
            class_list.innerHTML = inner;
        } else {
            var i;
            class_list.innerHTML = '';
            for (i = 0; i < classes.length; i++) {
                let inner_div = document.createElement("div");
                inner_div.id = "class-" + classes[i].id;
                inner_div.classList.add("class-element");
                let collapsible_button = document.createElement("button");
                collapsible_button.classList.add("collapsible");
                collapsible_button.type = "button";
                collapsible_button.innerHTML = classes[i].name;
                collapsible_button.id = "collapsible-" + classes[i].id;
                collapsible_button.addEventListener("click", function() {
                    this.classList.toggle("active");
                    var content = this.nextElementSibling;
                    if (content.style.maxHeight){
                      content.style.maxHeight = null;
                    } else {
                      content.style.maxHeight = content.scrollHeight + "px";
                    }
                });
                let content_div = document.createElement("div");
                content_div.classList.add("content");
                var content_inner = '';
                content_inner += '<span>학생 명단 (한 줄에 한 명씩)</span><br>';
                content_inner += '<textarea id="list_text" cols="50" rows="5">';
                content_inner += classes[i].people.join('\n');
                content_inner += '</textarea><br>';
                content_div.innerHTML = content_inner;
                let delete_button = document.createElement("button");
                delete_button.classList.add("btn");
                delete_button.classList.add("btn-danger");
                delete_button.classList.add("font");
                delete_button.type = "button";
                delete_button.innerHTML = "삭제";
                delete_button.id = "delete-" + classes[i].id;
                delete_button.addEventListener("click", function() {
                    this.parentElement.parentElement.remove();
                });
                content_div.appendChild(delete_button);
                content_div.appendChild(document.createElement("hr"));
                inner_div.appendChild(collapsible_button);
                inner_div.appendChild(content_div);
                class_list.appendChild(inner_div);
            }
        }
    });
}

function createClass(name = "새로운 클래스") {
    chrome.storage.local.get("classes", ({ classes }) => {
        if (classes == undefined) {
            classes = [];
        }
        chrome.storage.local.get("new_id", ({new_id}) => {
            if (new_id == undefined) {
                new_id = 1;
            }
            classes.push({"id": new_id, "name": name, "people": []});
            chrome.storage.local.set({ "classes": classes }, () => {
                updateClasses();
            });
            chrome.storage.local.set({ "new_id": new_id + 1 });
        });
    });
}

let defaultName = "새로운 클래스";

let newButton = document.getElementById("createClass_submit");
newButton.addEventListener('click', function() {
    var nameValue = document.getElementById("createClass_name").value.trim();
    if (nameValue === "") {
       nameValue = defaultName; 
    }
    createClass(nameValue);
    document.getElementById("createClass_name").value = defaultName;
});

let saveButton = document.getElementById("save");
saveButton.addEventListener('click', function() {
    let divs = document.getElementsByClassName("class-element");
    var classes = [];
    for (var i = 0; i < divs.length; i++) {
        let people = divs[i].getElementsByTagName("div")[0].getElementsByTagName("textarea")[0].value.split(/\r?\n/);
        let button = divs[i].getElementsByClassName("collapsible")[0];
        let id = parseInt(button.id.replace("collapsible-", ""));
        let name = button.innerText;
        classes.push({"id": id, "name": name, "people": people})
    }
    chrome.storage.local.set({ "classes": classes });
});

document.getElementById("createClass_name").value = defaultName;

updateClasses();