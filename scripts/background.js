chrome.extension.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.pageAction.show(sender.tab.id);

        // Now we have a token saved locally, as fetched from the settings page after authorization.
        if (request.command == 'saveToken') {
            localStorage.setItem('trello_token', request.token);
            sendResponse();
            return true;
        }

        if (!request.command && !localStorage.getItem('trello_token')) {
            chrome.tabs.create({url: chrome.extension.getURL('settings/index.html')});
            sendResponse();
            return true;
        }

    });

var myProject;

chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
        window.myProject = $(request.content).find(".projectname").text(); 
    }
);
    
chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.executeScript(tab.id, {
        code: "chrome.extension.sendMessage({content: document.body.innerHTML}, function(response) { console.log('success'); });"
    }, function() { console.log('done'); });
});

// Trello Creating Card

var APP_KEY = '*app_key*';
var myList = '5d1089c67893fe7afb014694';

function trelloInit() {
    Trello.setKey(APP_KEY);
    Trello.setToken(localStorage.getItem('trello_token'));
    console.log(APP_KEY);
    console.log(localStorage.getItem('trello_token'))
}

var creationSuccess = function (data) {
    console.log('Card created successfully.');
    console.log(JSON.stringify(data, null, 2));
    console.log(myProject)
};

var newCard = {
    name: myProject, 
    desc: 'This is the description of our new card.',
    // Place this card at the top of our list 
    idList: myList,
    pos: 'top'
};

function createCard() {
    $("#trello_create_card").click(function () {
        trelloInit();
        Trello.post('/cards/', newCard, creationSuccess);  
    });
}
    
$(document).ready(createCard);