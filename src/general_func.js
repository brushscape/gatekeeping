// if (typeof S == "undefined") {
// 	var S = {

Macro.add('message', {
  handler: function () { // inside the macro contents -> message text
    var username = '@blackout';
    var avatar = 'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=large';
    var isChat = this.args[0].charAt(1) === ':';
    if (isChat) {
      var user = this.args[0].charAt(0);
      switch (user) {
        case 'J':
          username = '@blackout';
          avatar = 'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=small';
          break;
        case 'D':
          username = '@cyborgrip';
          avatar = 'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=small';
          break;
        case 'Q':
          username = '@calikilly';
          avatar = 'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=small';
          break;
        case 'M':
          username = '@snakebait';
          avatar = 'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=small';
          break;
        default:
          username = '@anonymous'; // username.children[0].innerHTML = '@anonymous';
          break;
      }
    }
    fullText.push(this.args[0]);
    var html;
    if(isChat){
      html = "<div class='chatMessage' id='chatMessage'>";
      html += "<div class='chatAvatar'><img class='avatarImg' id='avatarImg' src='" + avatar + "' alt='Avatar'></div>";
      html += "<div class='chatTextCol'><p class='chatUsernameP' id='chatUsernameP'><b>" + username + "</b></p>";
      html += "<p id='chatMessageText'>" + " " + "</p></div>";
      html += "</div>";
    }else{
      html = "<div class='darkMessage' id='darkMessage'>";
      html += "<div class='avatar'><img class='avatarImg' id='avatarImg' src='" + avatar + "' alt='Avatar'></div>";
      html += "<div class='textCol'><p class='usernameP' id='usernameP'><b>" + username + "</b></p>";
      html += "<p id='messageText'>" + " " + "</p></div>";
      html += "</div>";
    }
    $(this.output).wiki(html);
  }
});

var currPage;

/*
helper popup messages on the passcode page to help the user
*/
var initHelper =
  [
    "D:Oh, hey, check it out. We've attracted a newby."
  ]; // 'Q:think they have the guts to try some passcodes?'];
var successHelper =
  [
    "Q:so... is that it?",
    "M:I can't believe <i>Jax</i> thought that would be a worthwhile reward.",
    "D:If you want to complain, take it to the chat."
  ]; // 'Q:i bet newby doesnt even know how to get there...'];
var comeHelper =
  [
    "Q:guess ur a terrible speller, huh",
    "D:Better luck next time, I guess",
    "M:that phrase not to your liking?"
  ];
var leaveHelper =
  [
    "M:don't take it personally. they're just an asshole.",
    "D:If you were trying to ask them personal questions... maybe don't",
    "Q:someone pissed them off... "
  ];
var chatHelper = "J:you just found the biggest secret. Are you satisfied?";
// global counters for the helper popup message arrays above
var initIndex = 0;
var successIndex = 0;
var comeIndex = 0;
var leaveIndex = 0;

// global variable to keep track of the helper popup timeout function
// makes it easier to clear later
var helperTimeout;

// though the rich are drunk on money, your parched lips won't taste a drop
// dictionary for the passcodes and their corresponding helper messages
var passwordDict = {THO: "D:I <i>tho</i>ught it would go faster",
										UGH: "Q:<i>ugh</i> ur not very good at this r u",
										THE: "M:I didnt think <i>the</i> code would be this hard",
										RIC: "D:Can't you see the t<i>ric</i>k",
										HAR: "M:how <i>har</i>d are you going to make me <i>har</i>p on you",
										EDR: "Q:this has last<i>ed r</i>eally long",
										UNK: "D:You seem to be in a f<i>unk</i>",
										ONM: "M:at this rate you’ll have to put in a t<i>on m</i>ore",
										ONE: "D:Maybe try <i>one</i> more time",
										YYO: "D:There's no need to do this b<i>y yo</i>urself",
										URP: "M:we're not here to console yo<i>ur p</i>itiful ego",
										ARC: "M:if you dont get this soon, I'm m<i>arc</i>hing out of here",
										HED: "Q:i wanna s<i>hed</i> my promise to be here",
										LIP: "M:you'd better be giving them <i>lip</i> in there",
										SWO: "D:I wish I wasn't <i>swo</i>rn to secrecy",
										NTT: "M:I ca<i>nt t</i>ell you hints forever",
										AST: "M:it's <i>a st</i>rain to come up with these sentences",
										EAD: "M:why did I agree to this? they didnt even pl<i>ead</i>",
										ROP: "D:I'm not sure how I was <i>rop</i>ed into this either"};

var currMessage = '';
var displayFullMessage = false;
var messageDisplayed = true;
var responsesDisplayed = true;
var delayedLoad;
var delayedLoadSet = false;
var numFailedAttempts = 0;
var loadingChats = false;
var chats;
var numJaxAttempts = 0;
var fullText=[];
var chatScrollDiff = 0.95;
var manifScrollDiff = 1;

var img = [
  'img/avatar_blackout.JPG',//'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=small',
  'img/avatar_cyborgrip.JPG',//'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=small',
  'img/avatar_calikilly.JPG',//'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=small',
  'img/avatar_snakebait.JPG'//'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=small'
];
var imgLoaded = false;

function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

//https://intfiction.org/t/sugarcube-click-anywhere-to-proceed-to-the-next-passage/42454/4

$(document).on(':passageinit', function (ev) {
	//console.log('clear full text');
	fullText = [];
  $(this.output).wiki("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
  if(!imgLoaded){
    preload();
    imgLoaded = true;
  }
});



// currentHelper: Variable defined in the Twine passages 0 is initial, 1 is sucess, 2 is come, 3 is leave, 4 is coming back from chat
$(document).on(':passagedisplay', function (ev) {
  // Setup for the Passcode Page
	if (tags().includes('passcode')) {
		console.log('at the passcode');
    $(".codeInputBox").keyup(function () {
        if (this.value.length == this.maxLength) {
          if($(this).next('.codeInputBox').length){
            $(this).next('.codeInputBox').focus();
          }else{
            $( ":button" ).focus();
          }
        }
    });
    currPage="passcode";
    crypticBackground();
		switch(state.active.variables.currentHelper){
			case 0: // initial
				initIndex = 0;
				var isNext = initIndex<initHelper.length-1;
				helperTimeout = setTimeout(revealHelper, 1000, initHelper[initIndex], isNext);
				initIndex++;
				break;
			case 1: // coming from Success State
				successIndex = 0;
				helperTimeout = setTimeout(revealHelper, 700, successHelper[successIndex], true);
				successIndex++;
				break;
			case 2: // coming from Come Back State
        comeIndex++;
        if(comeIndex >= comeHelper.length){
          comeIndex = 0;
        }
				helperTimeout = setTimeout(revealHelper, 700, comeHelper[comeIndex], false);
				break;
			case 3: // coming from Leave State
        leaveIndex++;
        if(leaveIndex >= leaveHelper.length){
          leaveIndex = 0;
        }
				helperTimeout = setTimeout(revealHelper, 700, leaveHelper[leaveIndex], false);
				break;
			case 4: // coming from Secret Chat State
				helperTimeout = setTimeout(revealHelper, 700, chatHelper, false);
				break;
		}

		var currentPass = setup.getCurrentPasscode();
		console.log('which is ' + currentPass + ' by the way');

		document.getElementById('helper').style.display = 'none';

		//var invalid = document.getElementById('invalid').innerHTML="";

		numFailedAttempts = 0;
		if(loadingChats){
			clearTimeout(chats);
			loadingChats = false;
		}
		return;
	}

  // Setup for the Chat Page
	if (tags().includes('chat')) {
		//console.log('at the chat');
    currPage="chat";
		formatMessage(false);
		//var chatMessages = document.getElementsByClassName('chatMessage');
    var chatScroll = document.getElementById('chatScroll');
    var chatMessages = chatScroll.children;
    for(var i = 1; i < chatMessages.length; i++)
		{
			chatMessages[i].style.display = 'none';
		}
		chats = setTimeout(revealMessage, 900, chatScroll, 1, 0, 0);
		loadingChats = false;//true;
		return;
	}

  // Setup for the Hangman Page
	if (tags().includes('hangman')) {
    currPage="hangman";
		document.getElementById('hangmanFeedback').style.color = 'darkgrey';
     currHangmanIndex = Math.floor(Math.random() * Math.floor(hangmanWords.length));
		 var word = hangmanWords[currHangmanIndex];
     currHangmanWord = word;
     console.log(word);
     hangmanWords.splice(currHangmanIndex, 1); //remove from main array
     usedWords.push(word);
     if(hangmanWords.length == 0){
       hangmanWords = usedWords;
       usedWords = [];
     }

		 var displayWord = '';
     var hiddenWord = '';
     //var wordStart = 0;
     var lineStart = 0;
     var lineLength = 0;
     var longestLine = 0;
	   for (var j = 0; j < word.length; j++) {
       var currChar = word.charAt(j);
       if(currChar == ','){
         displayWord += ' <br>';
         hiddenWord += ' <br>';
         j++;
         lineLength = displayWord.length - lineStart - 4;
         if(lineLength>longestLine){
           longestLine = lineLength;
         }
         lineStart = displayWord.length;
         //wordStart = j+1;
       }
       else if(word.charAt(j) == ' '){
         //console.log("finished word "+word.substring(wordStart,j));
         displayWord += '  ';
         hiddenWord += '  ';
         //wordStart = j+1;
       }
       else{
         displayWord += ' _';
         hiddenWord += ' ' + word.charAt(j);
       }
		 }
     displayWord += ' ';
     lineLength = displayWord.length-lineStart;
     if(lineLength>longestLine){
       longestLine = lineLength;
     }
     finalDisplayWord = hiddenWord + ' ';
     finalDisplayWord = finalDisplayWord.toUpperCase();
     fitText(longestLine);


		document.getElementById('hangmanWord').innerHTML = displayWord;
		return;
	}

  // Setup for the Manifesto Page
	if(tags().includes('manifesto')){
    currPage="manifesto";
		displayFullMessage = false;
		responsesDisplayed = false;
		messageDisplayed = false;
		setTimeout(listenForClick,200);
		currMessage = '';
		//document.getElementById('exit').style.display='none';
		var manifesto = document.getElementById('manifestoText').innerHTML;
		document.getElementById('manifestoText').innerHTML = '';
		setTimeout(manifestoType, 700, manifesto, 0);
		return;
	}

	if(tags().includes('other')){
		return;
	}

  currPage="discussion";

	if(state.active.title == 'Enter'){
		console.log('chatting with JAX: attempt '+numJaxAttempts);
	}

	document.getElementById('messageText').innterHTML = '';
	formatMessage(true);

	if(document.getElementsByClassName('responses').length > 0){
		var x = document.getElementsByClassName('responses');
		x[0].style.display = 'none';
	}
	displayFullMessage = false;
	responsesDisplayed = false;
	messageDisplayed = false;
	setTimeout(listenForClick, 200);
	currMessage = '';
	setTimeout(typeText, 700, fullText[0], 0, state.active.title);
});


function displayFull(){
  if(!messageDisplayed){
    displayFullMessage = true;
  }
}

// Format the message boxes
// (format needs to be different for the main discussion and the Chat Page
// justJax: true if on a discussion tree page, false if on the Chat Page
function formatMessage(justJax){
  var i=0;
	var x = [];
  if(justJax){
    document.getElementById('darkMessage').addEventListener("click",function(){displayFull();});
		document.getElementById('messageText').innterHTML = '';
		var temp2 = document.getElementById('messageText');
		x.push(temp2);
	}
	else{
		x = document.getElementsByClassName('chatMessageText');
	}
	for(i=0;i<x.length;i++){
		x[i].style.margin = '0';
	}

  return;
	if(justJax){
		var temp = document.getElementById('darkMessage');
		x=[temp];
	}
	else{
		x = document.getElementsByClassName('darkMessage');
	}
	for(i=0;i<x.length;i++){
		x[i].style.display = 'flex';
		x[i].style.alignItems = 'flex-start';
		x[i].style.alignContent = 'flex-start';
		if(!justJax){
			x[i].style.fontSize = '80%';
		}
	}

	if(justJax){
		document.getElementById('messageText').innterHTML = '';
		var temp2 = document.getElementById('messageText');
		x.push(temp2);
	}
	else{
		x = document.getElementsByClassName('messageText');
	}
	for(i=0;i<x.length;i++){
		x[i].style.alignItems = 'flex-start';
		x[i].style.alignContent = 'flex-start';
		x[i].style.alignSelf = 'flex-start';

		x[i].style.marginBottom = '3px';
		if(justJax){
			x[i].style.marginTop = '0.5px';
			x[i].style.padding = '3px';
		}else{
			x[i].style.marginTop = '0.1px';
			x[i].style.padding = '0.5px';
		}
	}

	if (justJax) {
		var temp3 = document.getElementById('usernameP');
		x = [temp3];
	}
	else {
		x = document.getElementsByClassName('usernameP');
	}
	for (i=0;i<x.length;i++) {
  	x[i].style.marginTop = '3px';
		if (justJax) {
  		x[i].style.marginBottom = '0.5px';
			x[i].style.padding = '3px';
		}
    else {
			x[i].style.marginBottom = '0.1px';
			x[i].style.padding = '0.5px';
		}
	}


	if (!justJax) {
		x = document.getElementsByClassName('avatarImg');
		for(i=0;i<x.length;i++){
			x[i].style.width = '100px';
			x[i].style.height = '100px';
		}
	}

}


function clickOption(optionLink){
  optionLink.click();
}


// return the current passcode for the Passcode Page
// function accessible inside the Twine nodes
setup.getCurrentPasscode = function getCurrentPasscode() {
	  var normalCodePhrase = state.active.variables.passcodePhrase;
		var currCodeIndex = state.active.variables.currPassIndex;
		var normalCode = '';
	  if(currCodeIndex+3 > normalCodePhrase.length)
		{
			normalCode = normalCodePhrase.substring(currCodeIndex);
			normalCode += normalCodePhrase.substring(0, 3 - (normalCodePhrase.length - currCodeIndex));
		}
		else{
			normalCode = normalCodePhrase.substring(currCodeIndex, currCodeIndex+3);
		}
		return normalCode.toUpperCase();
};

// update the index and therefore passcode for the Passcode Pages
// called after 3 failed attempts or failed hangman game or failed conversation
// function accessible inside the Twine nodes
setup.updateIndex = function updateCurrIndex() {
	var currCodeIndex= state.active.variables.currPassIndex;
	var normalCodePhrase = state.active.variables.passcodePhrase;
	if(currCodeIndex+3 >= normalCodePhrase.length)
		{
			state.active.variables.currPassIndex = 3 - (normalCodePhrase.length - currCodeIndex);
		}
		else{
			state.active.variables.currPassIndex = currCodeIndex+3;
		}
	console.log(setup.getCurrentPasscode());
};
