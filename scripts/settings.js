
function init() {

    // Check if page load is a redirect back from the auth procedure
    if (HashSearch.keyExists('token')) {
        Trello.authorize(
            {
                name: "Trello Helper Extension",
                expiration: "never",
                interactive: false,
                scope: {read: true, write: false},
                success: function () {
                    chrome.extension.sendMessage({
                        command: 'saveToken',
                        token: localStorage.getItem('trello_token')
                    }, function(data) {
                        chrome.tabs.getCurrent(function (tab) {
                            chrome.tabs.remove(tab.id)
                        });
                    });
                },
                error: function () {
                    alert("Failed to authorize with Trello.")
                }
            });
    }

    var authenticationSuccess = function() {
        console.log('Successful authentication');
    };
      
    var authenticationFailure = function() {
        console.log('Failed authentication');
    };

    // Message and button containers
    var lout = $("#trello_helper_loggedout");
    var lin = $("#trello_helper_loggedin");
    var APP_KEY = 'bb0113ca792a37ba1b40edf69dd9ace4';

    // Log in button
    $("#trello_helper_login").click(function () {
        Trello.setKey(APP_KEY);
        Trello.authorize(
            {
                name: "Trello Helper Extension",
                type: "redirect",
                expiration: "never",
                interactive: true,
                scope: {read: true, write: true},
                success: function () {
                    // Can't do nothing, we've left the page
                },
                error: function () {
                    alert("Failed to authorize with Trello.")
                }
            });
    });

    // Log out button
    $("#trello_helper_logout").click(function () {
        Trello.deauthorize();
        location.reload();
    });

    if (!localStorage.trello_token) {
        $(lout).show();
        $(lin).hide();
    } else {
        $(lout).hide();
        $(lin).show();
    }

    // Trello Creating Card

    function trelloInit() {
        Trello.setKey(APP_KEY);
        Trello.setToken(localStorage.getItem('trello_token'));
        console.log(APP_KEY);
        console.log(localStorage.getItem('trello_token'))
    }

    var myList = '5d1089c67893fe7afb014694';

    var creationSuccess = function (data) {
        console.log('Card created successfully.');
        console.log(JSON.stringify(data, null, 2));
    };

    var newCard = {
        name: 'Chrome Extension Card', 
        desc: 'This is the description of our new card.',
        // Place this card at the top of our list 
        idList: myList,
        pos: 'top'
    };

    $("#trello_create_card").click(function () {
        trelloInit();
        console.log('Board creating started..');
        Trello.post('/cards/', newCard, creationSuccess);       
        console.log('Board created..');
    });

    initDiscord();

}

/*
 Discord
 TODO: Move to submodule
 */

function initDiscord() {

  console.log('Discord', Discord);

  const client = new Discord.Client();
  console.log('Discord client', client);

  //Buttons events init once
  $('#discordClientLogin').click(function() {
    console.log('Trying login with token:' + $('#discordClientLoginToken').val());
    //TODO: Example login by loken
    client.login($('#discordClientLoginToken').val());
    // discordClientLogin()
  });

  // CLIENT ID
  // 593900662891348166
  // CLIENT SECRET
  // TZ0lmaOMTUJp_bKjRP1MgVl1htOjR5UO


  //Websocket client listeners init
  client.on('ready', () => {
      console.log(`Logged in as ${client.user.tag}!`);
  });

  client.on('message', msg => {
      if (msg.content === 'ping') {
      msg.reply('Pong!');
    }
  });



// chrome.identity.launchWebAuthFlow(
//     {'url': 'https://discordapp.com/api/oauth2/authorize?client_id=593900662891348166&redirect_uri=https%3A%2F%2Faeakhidjnjllleocgebkochjlbfggjec.chromiumapp.org%2Fsettings%2Findex.html&response_type=code&scope=identify%20guilds',
//      'interactive': true},
//     function(redirect_url) {
//         console.log('Authorization success');
//         console.log(redirect_url);
//     });


  function discordClientLogin(token) {

  }
  
}





$(document).ready(init);
