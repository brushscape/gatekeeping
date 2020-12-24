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
          avatar = 'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=large';
          break;
        case 'D':
          username = '@cyborgrip';
          avatar = 'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=large';
          break;
        case 'Q':
          username = '@calikilly';
          avatar = 'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=large';
          break;
        case 'M':
          username = '@snakebait';
          avatar = 'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=large';
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
var passwordDict = {THO: "D:Why don't you just check the <b>errors</b> <i>tho</i>",
										UGH: "Q:<i>ugh</i> ur not very good at this r u",
										THE: "M:didnt think <i>the</i> code would be this hard",
										RIC: "D:Can't you see the t<i>ric</i>k",
										HAR: "M:how <i>har</i>d are you going to make me <i>har</i>p on you",
										EDR: "Q:this has last<i>ed r</i>eally long",
										UNK: "D:u should try being more p<i>unk</i>",
										ONM: "M:at this rate you’ll have to put in a t<i>on m</i>ore",
										ONE: "M:<i>one</i> more fail and you're back here again",
										YYO: "D:This could be the da<i>y yo</i>u <b>inspect</b> a little closer",
										URP: "D:We're not here to <b>console</b> yo<i>ur p</i>itiful ego",
										ARC: "M:arent you almost done with this <i>arc</i>?",
										HED: "D:I wonder if any of these matc<i>hed</i>...",
										LIP: "M:you better be givin them <i>lip</i> otherwise whats the point",
										SWO: "Q:think u can get em to get me a <i>swo</i>rd?",
										NTT: "Q:they probs w<i>ont t</i>ake the chance",
										AST: "Q:im too prone to take <i>a st</i>ab",
										EAD: "M:you know we're not the only l<i>ead</i>",
										ROP: "D:a c<i>rop</i> of <b>logs</b> are waiting for you"};
//var passCryptDict = {};

// phrases for the hangman page
var hangmanWords = [
	'Be gay, do crime',
	'Anarchy',
	'Eat the rich',
	'People, over profits',
	'Silence is, compliance',
	'Anonymous',
	'Abolish, the police',
	'Vendetta',
	'Money is, a construct',
	'All cops, are bastards',
	'This machine, kills fascists',
	'Liberation',
	'No justice, no peace',
  'Scarcity, is a fallacy'];
var currHangmanIndex = 0;
var currHangmanWord = '';
var finalDisplayWord = '';
var usedWords = [];
var mq;

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
var chatScrollDiff = 1.05;
var manifScrollDiff = 1.1;

var img = [
  'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=large',
  'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=large',
  'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=large',
  'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=large'
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
				helperTimeout = setTimeout(revealHelper, 700, comeHelper[comeIndex], false);
				comeIndex++;
				if(comeIndex >= comeHelper.length){
					comeIndex = 0;
				}
				break;
			case 3: // coming from Leave State
				helperTimeout = setTimeout(revealHelper, 700, leaveHelper[leaveIndex], false);
				leaveIndex++;
				if(leaveIndex >= leaveHelper.length){
					leaveIndex = 0;
				}
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

function crypticBackground(){
  var body = document.getElementById("passcodeBody");
  var crypt = document.createElement("div");
  crypt.id = 'cryptic';
  crypt.style.overflow = 'hidden';
  crypt.style.width = '100vw';
  crypt.style.height = '100vh';
  crypt.style.zIndex = '0';
  crypt.style.left = '0';
  crypt.style.top='0';
  crypt.style.position='absolute';

  var codePhrase = state.active.variables.passcodePhrase;
  var passcodes = [];
  for(var k=0; k<codePhrase.length; k+=3){
    var code = codePhrase.substring(k,k+3).toUpperCase();
    passcodes.push(code);
    //passCryptDict[code] = [];
  }
  var currPasscode = setup.getCurrentPasscode();

  for(var i=0; i<passcodes.length*5; i++){
    var div = document.createElement("div");

    var currCodeToDisplay = passcodes[i%(passcodes.length)];
    var size = (Math.random() * 3)+1;
    var x = (Math.random() * 100);
    var y = (Math.random() * 100);
    var delay = (Math.random() * 20)-10;
    var length = 20;
    var direction = Math.floor(Math.random() * 4);


    var innerText = currCodeToDisplay;

    div.style.fontSize = size +'vw';
    div.style.lineHeight = size*2 +'vw';
    div.style.letterSpacing = size*1.5 +'vw';
    div.style.opacity = '0.2';
    div.style.overflow = 'hidden';
    div.className = currCodeToDisplay;

    var wrapper = document.createElement("div");
    wrapper.className = 'rCodesWrapper';
    var para = document.createElement("p");
    para.className = 'rCodesText';
    wrapper.style.position = 'absolute';
    wrapper.style.zIndex = '0';
    wrapper.style.opacity = '0';
    wrapper.style.overflow = 'hidden';

    wrapper.style.left = x+'vw';
    wrapper.style.top = y+'vh';

    switch(direction){
      case 0:
        wrapper.style.animation = 'moveDown '+length+'s infinite';
        var newText = innerText[0];
        for(var j=1;j<innerText.length;j++){
          newText += '<br>'+innerText[j];
        }
        innerText = newText;
        break;
      case 1:
        wrapper.style.animation = 'moveUp '+length+'s infinite';
        var newText = innerText[0];
        for(var j=1;j<innerText.length;j++){
          newText += '<br>'+innerText[j];
        }
        innerText = newText;
        break;
      case 2:
        wrapper.style.animation = 'moveLeft '+length+'s infinite';
        break;
      case 3:
        wrapper.style.animation = 'moveRight '+length+'s infinite';
        break;
    }
    wrapper.style.animationDelay = delay+'s';
    wrapper.style.animationTimingFunction = 'linear';

    para.innerHTML=innerText;
    wrapper.appendChild(para);
    div.appendChild(wrapper);
    crypt.appendChild(div);
    //passCryptDict[currCodeToDisplay].push(div);
  }
  body.appendChild(crypt);
  updateBackground(passcodes[0],currPasscode);
}

function updateBackground(prevPasscode, currPasscode){

  var prevCodeDisplays = document.getElementsByClassName(prevPasscode);
  for(var i=0;i<prevCodeDisplays.length;i++){
    prevCodeDisplays[i].style.opacity = '0.2';
  }

  var currCodeDisplays = document.getElementsByClassName(currPasscode);
  for(var j=0;j<currCodeDisplays.length;j++){
    currCodeDisplays[j].style.opacity = '0.425';
  }
}

// Fit hangman word inside div if too long
function fitText(longestLine){
//return;
  var defaultAdjust = 7; //vw
  var defaultBig = 60;//px
  var bigScreenThresh = 800; //px

  //mq = window.matchMedia("(min-width: 800px)");
    //mq.addListener(WidthChange);
  //if(currPage == "hangman"){
    var wordDiv = document.getElementById('hangmanWord');
    if(longestLine >= 25){
        //longer than 25
        // if(mq.matches)
        //   wordDiv.style.fontSize = "40px";
        // else
          wordDiv.style.fontSize = "calc(14px + 1.4vw)";
    }else if(longestLine >= 20){
        //longer than 20
          wordDiv.style.fontSize = "calc(16px + 1.6vw)";
    }else if(longestLine >= 15){
          //longer than 15
          wordDiv.style.fontSize = "calc(18px + 1.8vw)";
    }else{
        //shorter than 15
          wordDiv.style.fontSize = "calc(20px + 2vw)";
    }
//  }
}

// Update scroll on Chat Page
function updateScroll(element,scrollDiff){
    console.log("amount: "+(element.scrollHeight - element.scrollTop) );
    console.log("limit: "+(window.screen.height / scrollDiff));
		if(element.scrollHeight - element.scrollTop <= (window.screen.height / scrollDiff)){
    	element.scrollTop = element.scrollHeight;
		}
}

// Reveal messages in Chat Page
function revealMessage(scroll, scrollIndex, textIndex, chatNotifWait){
  var toDisplay = scroll.children[scrollIndex];
  var newIndex = scrollIndex+1;
  if(toDisplay.className == "chatNotif"){
    toDisplay.style.display = 'block';
    updateScroll(document.getElementById('chatScroll'),chatScrollDiff);
  	if(newIndex < scroll.children.length){
  		chats = setTimeout(revealMessage, chatNotifWait, scroll, newIndex, textIndex, 0);
  		loadingChats = true;
  	}else {
  		loadingChats = false;
  	}
  }else{
  	var message = fullText[textIndex];
  	var user = message.charAt(0);
  	var avatar = toDisplay.children[0];
  	var avatarImg = avatar.children[0];
  	var text = toDisplay.children[1];
  	var username = text.children[0];
  	var messageText = text.children[1];
    	switch(user){
  				//Jax #4E4256
  				case 'J':
  					username.children[0].innerHTML = '@blackout';
  					avatarImg.src = 'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=large';
  					toDisplay.style.backgroundColor = '#4E4256';
  					toDisplay.style.borderColor = '#2C1D36'
  					break;
  				//Daeka #425653
  				case 'D':
  					username.children[0].innerHTML = '@cyborgrip';
  					avatarImg.src = 'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=large';
  					toDisplay.style.backgroundColor = '#425653';
  					toDisplay.style.borderColor = '#1D3630'
  					break;
  				//Quinn #56424B
  				case 'Q':
  					username.children[0].innerHTML = '@calikilly';
  					avatarImg.src = 'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=large';
  				  toDisplay.style.backgroundColor = '#56424B';
  					toDisplay.style.borderColor = '#361D28';
  					break;
  				//Mouse #564C42
  				case 'M':
  					username.children[0].innerHTML = '@snakebait';
  					avatarImg.src = 'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=large';
  					toDisplay.style.backgroundColor = '#564C42';
  					toDisplay.style.borderColor = '#36291D'
  					break;
  				default:
  					username.children[0].innerHTML = '@anonymous';
  					break;
  			}
  	messageText.innerHTML = message.substring(2);
    messageText.style.margin = '0';
    messageText.style.wordSpacing = '-.2vw;';
    messageText.style.lineHeight = 'calc(10px + 0.5vw)';
  	toDisplay.style.display = 'flex';
  	updateScroll(document.getElementById('chatScroll'),chatScrollDiff);
  	if(newIndex < scroll.children.length){
  		var mLen = message.substring(2).length;
  		if(mLen < 10){
  			mLen = 10;
  		}
  		var randTime = Math.floor(Math.random() * ((mLen*40+500) - mLen*40 + 1) + mLen*40);
      if(scroll.children[newIndex].className == 'chatNotif'){
        chats = setTimeout(revealMessage, 600, scroll, newIndex, textIndex+1, randTime);
      }else{
    	  chats = setTimeout(revealMessage, randTime, scroll, newIndex, textIndex+1, 0);
      }
      loadingChats = true;
  	}else {
  		loadingChats = false;
  	}
  }

}

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

// allows you to skip before the timeout on the discussion tree pages without response options and the typing out
function listenForClick(){
		if(delayedLoadSet){
			 clearTimeout(delayedLoad);
			 delayedLoad = undefined;
			 delayedLoadSet = false;
		}
		//$('html').on('click', function (ev) {  /* Look for click event */
		document.body.addEventListener('keyup', function a(e) {
			//if ((ev.target == $('html')[0]) || ($('#passages')[0].contains(ev.target))) 		{  /* Check click location. */
			if(e.which == 13){ //enter key
				if(!messageDisplayed){
					displayFullMessage = true;
				}
				else if(tags().includes('noexit')){
					currMessage = '';
					state.display(state.active.variables.nextPassage, this);
					if(delayedLoadSet){
						clearTimeout(delayedLoad);
						delayedLoad = undefined;
						delayedLoadSet = false;
					}
					if(document.getElementsByClassName('responses').length > 0){
						var x = document.getElementsByClassName('responses')[0];
						x.style.opacity = 0;
						x.style.display = 'none';
					}
				}
				if(!tags().includes('noexit')){
					document.body.removeEventListener('keyup', a);
					//$('html').off('click');  /* Stop looking for click. */
				}

		}
	});
}

// Types out the message on the Jax discussion pages
function typeText(message, i, currPassage){
	if(currPassage != state.active.title){
		return;
	}
	if(displayFullMessage){
			// skip to fully typed messsage
			document.getElementById('messageText').innerHTML = message;
			i = message.length;
		}

	if(i<message.length){
			// message not fully typed and no skip
			var punc = message[i];
			currMessage+=punc;
			i++;
			document.getElementById('messageText').innerHTML = currMessage;
			if(punc == '.' || punc == '?' || punc == '!'){
				var nextCharIsPunc = false;
				if(i < message.length){
					nextCharIsPunc = message[i] == '.' || message[i] == '?' || message[i] == '!';
				}
				if(nextCharIsPunc){
					if(message[i] == '.'){ // for elipses
						setTimeout(typeText, 200, message, i, currPassage);
					}
					else{ //for just multiple question marks or exclamation points
						setTimeout(typeText, 30, message, i, currPassage);
					}
				}
				else { //pause at end of sentence
					setTimeout(typeText, 500, message, i, currPassage);
				}
			}
			else if (punc == ','){ //tiny pause at a comma
				setTimeout(typeText, 300, message, i, currPassage);
			}
			else{ //no pause for normal text
				setTimeout(typeText, 30, message, i, currPassage);
			}

	}
	else {
		// message is fully typed
		messageDisplayed = true;
		if(document.getElementsByClassName('responses').length > 0){
			fadeInResponse(0, currPassage);
		}else if(tags().includes('noexit')){
					//listenForNextPassageClick();
			delayedLoad = setTimeout(state.display, 1000, state.active.variables.nextPassage);
			delayedLoadSet = true;
		}
	}

}

// Types out the manifesto on the Manifesto Pages
function manifestoType(message,i){
	if(displayFullMessage){
			// skip to fully typed messsage
			document.getElementById('manifestoText').innerHTML = message;
			i = message.length;
		}
  if(i%10==0){
    updateScroll(document.getElementById('manifestoText'),manifScrollDiff);
  }
	if(i<message.length){
			// message not fully typed and no skip
			var punc = message[i];
			currMessage+=punc;
			if(punc == '<'){ //skip over <br>
				currMessage+=message.substring(i+1,i+4);
        document.getElementById('manifestoText').innerHTML = currMessage;
        updateScroll(document.getElementById('manifestoText'),manifScrollDiff);
				i+=3;
			}else{
        document.getElementById('manifestoText').innerHTML = currMessage;
      }
			i++;

			if(punc == '.' || punc == '?' || punc == '!'){
				var nextCharIsPunc = false;
				if(i < message.length){
					nextCharIsPunc = message[i] == '.' || message[i] == '?' || message[i] == '!';
				}
				if(nextCharIsPunc){
          updateScroll(document.getElementById('manifestoText'),manifScrollDiff);
					if(message[i] == '.'){ //for elipses
						setTimeout(manifestoType, 200, message, i);
					}
					else{ //for just multiple question marks or exclamation points
						setTimeout(manifestoType, 30, message, i);
					}
				}
				else { //pause at end of sentence
					setTimeout(manifestoType, 500, message, i);
				}
			}
			else if (punc == ','){ //tiny pause at a comma
        updateScroll(document.getElementById('manifestoText'),manifScrollDiff);
				setTimeout(manifestoType, 300, message, i);
			}
			else{ //no pause for normal text
				setTimeout(manifestoType, 30, message, i);
			}

	}
	else {
		// message fully typed
		messageDisplayed = true;
		document.getElementById('exit').style.display = 'block';
	}
}

// Fade in the response options to Jax on the discussion tree pages
function fadeInResponse(j, currPassage){
	if(currPassage != state.active.title){
		return;
	}
  var x = document.getElementsByClassName('responses')[0];
	if(j<1){
		x.style.opacity = j;
		if (x.style.display == 'none'){
			x.style.display = 'flex';
		}
		j+=0.01;
		setTimeout(fadeInResponse, 10, j, currPassage);
	}
	else{
    x.style.opacity = 1;
		responsesDisplayed = true;

    //makes sure clicking on anywhere in the option will click the link, not just the text
    var options = x.children;
    for(var i = 0; i < options.length; i++){
      var optionLink = options[i].children[0];
      options[i].addEventListener("click", clickOption.bind(this,optionLink));
    }
	}
}

function clickOption(optionLink){
  optionLink.click();
}

// Check for correct passcode on the Passcode Page
// function accessible inside the Twine nodes
setup.checkPasscode = function checkPasscode(){
		var specialCode = state.active.variables.chatPassword;
		var normalCode = setup.getCurrentPasscode();
		var first = document.getElementById('textbox-first');
		var mid = document.getElementById('textbox-mid');
		var last = document.getElementById('textbox-last');
		var currCode = first.value + mid.value + last.value;
		document.getElementById('helper').style.display = 'none';
    document.getElementById('codeFeedback').style.opacity = 1;

		if(normalCode == currCode.toUpperCase()){
       // correct code, proceed to jax discussion tree
			 document.getElementById('codeFeedback').innerHTML = 'Correct!';
			 document.getElementById('codeFeedback').style.color = 'lightgreen';
			 numJaxAttempts++;
			 clearTimeout(helperTimeout);
			 state.display('Enter', this);

			return;
		}
		else if(specialCode == currCode.toUpperCase()){
      // correct special code, proceed to secret chat page
			 document.getElementById('codeFeedback').innerHTML = 'Valid ID';
			 document.getElementById('codeFeedback').style.color = 'lightblue';
			 clearTimeout(helperTimeout);
			 state.display('Chat', this);
			return;
		}
		else{
      // invalid code, alert user to try again
			numFailedAttempts++;

			if(numFailedAttempts%3 == 1){
				document.getElementById('codeFeedback').innerHTML = 'Invalid';
			}
			else if(numFailedAttempts%3 == 2){
				document.getElementById('codeFeedback').innerHTML = 'Twice Invalid';
				if(state.active.variables.currentHelper==0){
					revealHelper('M:they look kind of clueless to me...', false);
					state.active.variables.currentHelper = -1;
				}
			}
			else if(numFailedAttempts%3 == 0 && numFailedAttempts>0){
				setup.updateIndex();
        updateBackground(normalCode,setup.getCurrentPasscode());
				document.getElementById('codeFeedback').innerHTML = 'Thrice Invalid<br>New Code Chosen';
			}
			//document.getElementById('invalid').className ='invalid';
			//document.getElementById('invalid').style.animation ='flashing 3s linear';
			/*var element = document.getElementById('invalid');
			element.classList.remove('animate');
			void element.offsetWidth; // trigger a DOM reflow
			element.classList.add('animate');*/
		}
		if(numFailedAttempts%4 == 0)
		{
			var helperText = passwordDict[setup.getCurrentPasscode()];
			revealHelper(helperText,false);
		}
};

// Reveal helper popup message on the Passcode Page
function revealHelper(helperText, nextMessage){
	//console.log('reveal ' + helperText);
	var user = helperText.charAt(0);
	switch(user){
		//Jax #4E4256
		case 'J':
			document.getElementById('username').innerHTML = '@blackout';
			document.getElementById('helperAvatarImg').src = 'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=large';
			document.getElementById('helper').style.backgroundColor = '#4E4256';
			break;
		//Daeka #425653
		case 'D':
			document.getElementById('username').innerHTML = '@cyborgrip';
			document.getElementById('helperAvatarImg').src = 'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=large';
			document.getElementById('helper').style.backgroundColor = '#425653';
			break;
		//Quinn #56424B
		case 'Q':
			document.getElementById('username').innerHTML = '@calikilly';
			document.getElementById('helperAvatarImg').src = 'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=large';
			document.getElementById('helper').style.backgroundColor = '#56424B';
			break;
		//Mouse #564C42
		case 'M':
			document.getElementById('username').innerHTML = '@snakebait';
			document.getElementById('helperAvatarImg').src = 'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=large';
			document.getElementById('helper').style.backgroundColor = '#564C42';
			break;
		default:
			document.getElementById('username').innerHTML = '@anonymous';
			break;
	}
	document.getElementById('helperText').innerHTML = helperText.substring(2);
	document.getElementById('helper').style.display = 'flex';
	if(nextMessage)
	{
		//console.log('there is next helperhelper');
		switch(state.active.variables.currentHelper){
			case 0:
				var isNext = initIndex < initHelper.length-1;
				var mLen = helperText.length;
				var randTime = mLen*40 + 500;//+500?
				helperTimeout = setTimeout(revealHelper, randTime, initHelper[initIndex], isNext);
				initIndex++;
				break;
			case 1:
				isNext = successIndex < successHelper.length-1;
				mLen = helperText.length;
				randTime = mLen*40 + 500;//+500?
				//console.log('time '+randTime);
				helperTimeout = setTimeout(revealHelper, randTime, successHelper[successIndex], isNext);
				successIndex++;
				break;
		}
	}
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

// check for the inputted letter in the hangman phrase and update the user
// function accessible inside the Twine nodes
setup.checkHangman = function checkHangman(letterString){
	var i = 0;
	var letter = letterString.charAt(0);
	var word = currHangmanWord.toUpperCase();

	if(word.indexOf(letter) != -1){
		var displayedWord = document.getElementById('hangmanWord').innerHTML;
    for(i = 0; i < finalDisplayWord.length; i++)
		{
      var currChar = finalDisplayWord.charAt(i);
      if(currChar == '<'){//skip break <br>
        i += 3;
      }
      else if(currChar == letter){
    		var temp = displayedWord.substring(0,i) + letter + displayedWord.substring(i+1,displayedWord.length);
  			displayedWord = temp;
      }
		}
		document.getElementById('hangmanWord').innerHTML = displayedWord;
	}
	else{
		var feedback = document.getElementById('hangmanFeedback').innerHTML;
		if(feedback.length > 3){
			document.getElementById('hangmanFeedback').innerHTML = feedback.substring(0,feedback.length-2);
		}else{ //Failed
			document.getElementById('hangmanFeedback').innerHTML = 'FAILED';
			document.getElementById('hangmanFeedback').style.color = 'crimson';
			setup.updateIndex();
			state.active.variables.currentHelper = 2;
			// currHangmanIndex++;
			// if(currHangmanIndex >= hangmanWords.length){
			// 	currHangmanIndex = 0;
			// }
      //currHangmanIndex = Math.floor(Math.random() * Math.floor(hangmanWords.length()));
      //mq.removeListener(WidthChange);
      setTimeout(state.display, 800, 'Passcode');
		}
	}
	var buttons = document.getElementsByTagName('button');
	for (i=0; i<buttons.length; i++) {
		var txt = buttons[i].textContent || buttons[i].innerText;
    if (txt == letterString){
			buttons[i].disabled = true;
		}

  }

	//Word is complete!
	if(document.getElementById('hangmanWord').innerHTML.indexOf('_') == -1){
		document.getElementById('hangmanFeedback').innerHTML = 'SUCCESS';
		document.getElementById('hangmanFeedback').style.color = 'lightgreen';
		// currHangmanIndex++;
		// if(currHangmanIndex >= hangmanWords.length){
		// 	currHangmanIndex = 0;
		// }
		numJaxAttempts++;
    //mq.removeListener(WidthChange);
		setTimeout(state.display, 800, 'Enter');
	}

};
