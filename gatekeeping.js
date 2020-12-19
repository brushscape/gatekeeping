/*
helper popup messages on the passcode page to help the user
*/
var initHelper =
  [
    "D:Oh, hey, check it out. We've attracted a newby."
  ]; // 'Q:think they have the guts to try some passcodes?'];
var successHelper =
  [
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

// phrases for the hangman page
var hangmanWords = [
	'Be gay do crime',
	'Anarchy',
	'Eat the rich',
	'People over profits',
	'Silence is compliance',
	'Anonymous',
	'Abolish the police',
	'Vendetta',
	'Money is a construct',
	'All cops are bastards',
	'This machine kills fascists',
	'Liberation',
	'No justice no peace',
  'Scarcity is a fallacy'];
var currHangmanIndex = 0;
var usedWords = [];

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
var scrollDiff = 1000;

//https://intfiction.org/t/sugarcube-click-anywhere-to-proceed-to-the-next-passage/42454/4

$(document).on(':passageinit', function (ev) {
	//console.log('clear full text');
	fullText = [];
});

// currentHelper: Variable defined in the Twine passages 0 is initial, 1 is sucess, 2 is come, 3 is leave, 4 is coming back from chat
$(document).on(':passagedisplay', function (ev) {
  // Setup for the Passcode Page
	if (tags().includes('passcode')) {
		console.log('at the passcode');
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

		var invalid = document.getElementById('invalid');
		invalid.style.opacity = 0;
		invalid.style.color = 'firebrick';

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
		formatMessage(false);
		var chatMessages = document.getElementsByClassName('darkMessage');
		for(var i = 0; i < chatMessages.length; i++)
		{
			chatMessages[i].style.display = 'none';
		}
		chats = setTimeout(revealMessage, 900, chatMessages, 0);
		loadingChats = true;
		return;
	}

  // Setup for the Hangman Page
	if (tags().includes('hangman')) {
		document.getElementById('hangmanFeedback').style.color = 'darkgrey';
		 var word = hangmanWords[currHangmanIndex];
		 var displayWord = '_';
	   for (var j = 1; j < word.length; j++) {
			 if(word.charAt(j) != ' ') {
			 	displayWord += ' _';
			 }
			 else{
				 displayWord += '  ';
			 }
		 }
		document.getElementById('hangmanWord').innerHTML = displayWord;
		return;
	}

  // Setup for the Manifesto Page
	if(tags().includes('manifesto')){
		displayFullMessage = false;
		responsesDisplayed = false;
		messageDisplayed = false;
		setTimeout(listenForClick,200);
		currMessage = '';
		document.getElementById('exit').style.display='none';
		var manifesto = document.getElementById('manifesto').innerHTML;
		document.getElementById('manifesto').innerHTML = '';
		setTimeout(manifestoType, 700, manifesto, 0);
		return;
	}

	if(tags().includes('other')){
		return;
	}

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

// Update scroll on Chat Page
function updateScroll(){
    var element = document.getElementById('chatScroll');
		if(element.scrollHeight - element.scrollTop <= scrollDiff){
    	element.scrollTop = element.scrollHeight;
		}
}

// Reveal messages in Chat Page
function revealMessage(messages, index){
	var message = fullText[index];
	var user = message.charAt(0);
	var avatar = messages[index].children[0];
	var avatarImg = avatar.children[0];
	var text = messages[index].children[1];
	var username = text.children[0];
	var messageText = text.children[1];
  	switch(user){
				//Jax #4E4256
				case 'J':
					username.children[0].innerHTML = '@blackout';
					avatarImg.src = 'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=large';
					messages[index].style.backgroundColor = '#4E4256';
					messages[index].style.borderColor = '#2C1D36'
					break;
				//Daeka #425653
				case 'D':
					username.children[0].innerHTML = '@cyborgrip';
					avatarImg.src = 'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=large';
					messages[index].style.backgroundColor = '#425653';
					messages[index].style.borderColor = '#1D3630'
					break;
				//Quinn #56424B
				case 'Q':
					username.children[0].innerHTML = '@calikilly';
					avatarImg.src = 'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=large';
					messages[index].style.backgroundColor = '#56424B';
					messages[index].style.borderColor = '#361D28';
					break;
				//Mouse #564C42
				case 'M':
					username.children[0].innerHTML = '@snakebait';
					avatarImg.src = 'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=large';
					messages[index].style.backgroundColor = '#564C42';
					messages[index].style.borderColor = '#36291D'
					break;
				default:
					username.children[0].innerHTML = '@anonymous';
					break;
			}
	messageText.innerHTML = message.substring(2);
	messages[index].style.display = 'flex';
	updateScroll();
	if(index+1 < messages.length){
		var mLen = message.substring(2).length;
		if(mLen < 10){
			mLen = 10;
		}
		var randTime = Math.floor(Math.random() * ((mLen*40+500) - mLen*40 + 1) + mLen*40);
		chats = setTimeout(revealMessage, randTime, messages, index+1);
		loadingChats = true;
	}else {
		loadingChats = false;
	}

}

// Format the message boxes
// (format needs to be different for the main discussion and the Chat Page
// justJax: true if on a discussion tree page, false if on the Chat Page
function formatMessage(justJax){
	var i=0;
	var x = [];
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
			document.getElementById('manifesto').innerHTML = message;
			i = message.length;
		}

	if(i<message.length){
			// message not fully typed and no skip
			var punc = message[i];
			currMessage+=punc;
			if(punc == '<'){
				currMessage+=message.substring(i+1,i+4);
				i+=3;
			}
			i++;

			document.getElementById('manifesto').innerHTML = currMessage;
			if(punc == '.' || punc == '?' || punc == '!'){
				var nextCharIsPunc = false;
				if(i < message.length){
					nextCharIsPunc = message[i] == '.' || message[i] == '?' || message[i] == '!';
				}
				if(nextCharIsPunc){
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
	if(j<1){
		var x = document.getElementsByClassName('responses')[0];
		x.style.opacity = j;
		if (x.style.display == 'none'){
			x.style.display = 'flex';
		}
		j+=0.01;
		setTimeout(fadeInResponse, 10, j, currPassage);
	}
	else{
		responsesDisplayed = true;
	}
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

		if(normalCode == currCode.toUpperCase()){
       // correct code, proceed to jax discussion tree
			 document.getElementById('invalid').innerHTML = 'Correct!';
			 document.getElementById('invalid').style.color = 'lightgreen';
			 numJaxAttempts++;
			 clearTimeout(helperTimeout);
			 state.display('Enter', this);
			return;
		}
		else if(specialCode == currCode.toUpperCase()){
      // correct special code, proceed to secret chat page
			 document.getElementById('invalid').innerHTML = 'Valid ID';
			 document.getElementById('invalid').style.color = 'lightblue';
			 clearTimeout(helperTimeout);
			 state.display('Chat', this);
			return;
		}
		else{
      // invalid code, alert user to try again
			numFailedAttempts++;

			document.getElementById('invalid').style.opacity = 1;
			if(numFailedAttempts%3 == 1){
				document.getElementById('invalid').innerHTML = 'Invalid';
			}
			else if(numFailedAttempts%3 == 2){
				document.getElementById('invalid').innerHTML = 'Twice Invalid';
				if(state.active.variables.currentHelper==0){
					revealHelper('M:they look kind of clueless to me...', false);
					state.active.variables.currentHelper = -1;
				}
			}
			else if(numFailedAttempts%3 == 0 && numFailedAttempts>0){
				setup.updateIndex();
				document.getElementById('invalid').innerHTML = 'Thrice Invalid - New Code Chosen';
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
				var randTime = mLen*40;//+500?
				helperTimeout = setTimeout(revealHelper, randTime, initHelper[initIndex], isNext);
				initIndex++;
				break;
			case 1:
				isNext = successIndex < successHelper.length-1;
				mLen = helperText.length;
				randTime = mLen*40;//+500?
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
  var index = Math.floor(Math.random() * Math.floor(hangmanWords.length()));
	var word = hangmanWords[index].toUpperCase();
  hangmanWords.splice(index, 1); //remove from main arrays
  usedWords.push(word);
  if(hangmanWords.length() == 0){
    hangmanWords = usedWords;
    usedWords = [];
  }

	if(word.indexOf(letter) != -1){
		var displayedWord = document.getElementById('hangmanWord').innerHTML;
		var j = 0;
		for(i = 0; i < word.length; i++)
		{
			if(word.charAt(i) == letter){
				var temp = displayedWord.substring(0,j) + letter + displayedWord.substring(j+1,displayedWord.length);
				displayedWord = temp;
			}
			j+=2;
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
		setTimeout(state.display, 800, 'Enter');
	}
};
