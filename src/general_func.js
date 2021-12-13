//setup global variables
if (typeof S == "undefined") {
	var S = {
		aaa:0,
		currPage: "",

    //helper popup messages on the passcode page to help the user
    initHelper:["D:Oh, hey, check it out. We've attracted a newby."],
    successHelper:
      [
        "Q:so... is that it?",
        "M:I can't believe they thought that would be a worthwhile reward.",
        "D:If you want to complain, take it to the chat."
      ],
    comeHelper:
      [
        "Q:guess ur a terrible speller, huh",
        "D:Better luck next time, I guess",
        "M:that phrase not to your liking?"
      ],
    leaveHelper:
      [
        "M:don't take it personally. they're just an asshole.",
        "D:If you were trying to ask them personal questions... maybe don't",
        "Q:someone pissed them off... "
      ],
    chatHelper: "J:You just found the biggest secret. Are you satisfied?",
		rumpleHelper: "J:Your move, little bird. What's my name?",

    // global counters for the helper popup message arrays above
    initIndex: 0,
    successIndex: 0,
    comeIndex: 0,
    leaveIndex: 0,
    // global variable to keep track of the helper popup timeout function
    // makes it easier to clear later
    helperTimeout: 0,

    //initial state of passcode page variables
    currentHelper: 0,
    chatPassword: "JAX",
    passcodePhrase: "Thoughthericharedrunkonmoneyyourparchedlipswonttasteadrop",
    currPassIndex: 0,

    // though the rich are drunk on money, your parched lips won't taste a drop
    // dictionary for the passcodes and their corresponding helper messages
    passwordDict:
      {
        THO: "D:I <i>tho</i>ught it would go faster",
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
    		ROP: "D:I'm not sure how I was <i>rop</i>ed into this either"
      },
    currMessage: '',
    displayFullMessage: false,
    messageDisplayed: true,
    responsesDisplayed:  true,
    delayedLoad: undefined,
    delayedLoadSet: false,
    numFailedAttempts: 0,
    loadingChats: false,
    numJaxAttempts: 0,
    fullText: [],
    chatScrollDiff: 0.95,
    manifScrollDiff: 1,
		nextPassage: "",
		currPassage: "First",
		leavePassage: "",
		responseListeners:[],

    //hangman variables
    hangmanWords:
      [
      	'Be gay, do crime',
      	'Anarchy',
      	'Eat the rich',
      	'People, over profits',
      	'Silence is, compliance',
      	'Anonymous',
      	'Vendetta',
      	'Money is, a construct',
      	'All cops, are bastards',
      	'This machine, kills fascists',
      	'Liberation',
      	'No justice, no peace',
        'Scarcity, is a fallacy'
      ],
    currHangmanIndex: 0,
    currHangmanWord: '',
    finalDisplayWord: '',
    usedWords: [],
    mq: undefined,

		messageArray:
		[
		  "M:this was an obnoxious way to spread a manifesto",
		  "D:I doubt that was the main purpose of this...",
		  "M:I bet they just wanted a powertrip",
		  "Q:this is a boring powertrip",
		  "J:Maybe to you",
		  "M:the hell is that supposed to mean?",
		  "J:I added anyone who played to my botnet. The game gives me time to upload the virus &#128521",
		  "D:Well shit. How many did you add?",
		  "J:Wouldn't you like to know &#128527",
		  "D:I don't know why I expected a straight answer...",
		  "Q:whats a botnet",
		  "D:It's basically when you zombifying people's computers so you can steal computing power",
		  "Q:oh shit!! jax is makin zombies?!",
		  "M:it's not as cool as it sounds",
		  "J:It is exactly as cool as it sounds. You just don't give a shit about computers",
		  "M:why should I? we have enough reclusive circuit nuts without me caring about motherboards",
		  "J:Those were some cute buzzwords, facer. &#128527 Want to see how they're actually used?",
		  "D:Jax...",
		  "J:What?! What's a little demonstration amongst friends &#128521",
		  "M:**comrades. at best.",
		  "D:Ouch",
		  "J:Damn, this little mouse bites &#128556 You show those teeth to your followers?",
		  "Q:and here i thought facers needed to be likable",
		  "M:i don't need to waste my charisma on you &#128405",
		  "J:Tell that to your stream. Cuz you just went live &#128526&#128073&#128073",
		  "M:WTF JAX GET OFF MY COMPUTER",
		  "D:...what is happening?",
		  "M:you are so goddamn lucky that was still on test mode. I would have killed you if that had gone public",
		  "J:HA! You should have seen the look on your face tho &#128514&#128514&#128514",
		  "Q:no fair! i wanna see mouse lookin stupid",
		  "M:&#128405",
		  "D:How do you even have access to Mouse's account?",
		  "J:Dude, they are trivial to hack. They use the same password for everything smh",
		  "D:And their camera?",
		  "J:How else am I supposed to keep an eye on you guys &#128521",
		  "M:um, you're not???",
		  "D:Guess it's time to comb my OS for Jax-shaped viruses again &#128579",
		  "J:It's cute you think you can get rid of me &#128536",
		  "Q:when r u gonna teach me how to mess with mouse like that",
		  "J:Oh easy. Running <u>this</u> gets you into their camera and <u>this</u> uploads screenshots to their feed",
		  "J:I'm sure you can figure out how to give them a heartattack from there &#128521",
		  "Q:nice",
		  "M:JAX",
		  "D:Quinn, don't touch that link! Don't be a script kiddie!",
		  "J:**script kitty &#128514&#128514&#128514",
		  "D:Jax stfu",
		  "Q:like this?",
		  "M:QUINN GET OFF MY FUCKING COMPUTER",
		  "J:good kitty &#128527",
		  "Q:dammit! daeka broke my link",
		  "J:Come on, Daeka &#128553 You're spoiling the fun &#128548",
		  "D:Harassing Mouse is not 'fun'",
		  "J:Isn't it though? &#128527",
		  "Q:lol",
		  "M:do you want me to start harassing you back, you cocky egotistical embodiment of a god-complex?",
		  "J:It's cute you think you can hurt me &#128536",
		  "M:Do you even care about radicalizing these people?",
		  "J:I thought that was your job &#128533",
		  "D:It's all our jobs? That's kind of the point???",
		  "Q:i thought the point was eating the rich",
		  "M:that's a metaphor, dumbass",
		  "J:Is it?",
		  "D:Mostly. Though I'm not really expecting Quinn to be invested in theology",
		  "J:They're just here to maul some corporates &#128520",
		  "Q:damn right i am",
		  "D:sigh I need to separate you two",
		  "M:good luck. you're better off separating yourself &#9996&#128405",
		  "@snakebait has left the chat",
		  "J:lol poor baby got their feelings hurt",
		  "D:One of these days you're going to do something they won't forgive you for",
		  "J:¯\\_(ツ)_/¯ cross that bridge and all that &#128521",
		  "D:Don't say I didn't warn you",
		  "@cyborgrip has left the chat",
		  "J:You leaving too, you little traitor?",
		  "Q:u know me &#128520",
		  "@calikilly has left the chat",
		  "J:all too well...",
		  "@blackout has left the chat"
		],
		chatNotifWait: 600,

    img:
      {
        'JAX': 'img/avatar_blackout.JPG',//'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=small',
        'DAE': 'img/avatar_cyborgrip.JPG',//'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=small',
        'QUI': 'img/avatar_calikilly.JPG',//'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=small',
        'MOU': 'img/avatar_snakebait.JPG',//'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=small'
				'ANON': 'img/avatar_anon.JPG'
			},
    imgLoaded: false,
		waiting: undefined,
  }
}

function preload() {
    for (var i = 0; i < arguments.length; i++) {
        images[i] = new Image();
        images[i].src = preload.arguments[i];
    }
}

// currentHelper: Variable defined in the Twine passages
//		0 is initial, 1 is sucess, 2 is come, 3 is leave,
//		4 is coming back from chat, 5 is a special case from the convo
$(window).on('sm.passage.shown', function(event, passage) {
	S.fullText = [];
	//$(this.output).wiki("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
	if(!S.imgLoaded){
		preload();
		S.imgLoaded = true;
	}

	// Setup for the Passcode Page
	if (window.passage.tags.includes('passcode')) {
		var button = document.getElementById('enterButton');
		button.onclick = function (){ checkPasscode(); };

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
    S.currPage="passcode";
    crypticBackground();
		switch(S.currentHelper){
			case 0: // initial
				S.initIndex = 0;
				var isNext = S.initIndex<S.initHelper.length-1;
				S.helperTimeout = setTimeout(revealHelper, 1000, S.initHelper[S.initIndex], isNext);
				S.initIndex++;
				break;
			case 1: // coming from Success State
				S.successIndex = 0;
				S.helperTimeout = setTimeout(revealHelper, 700, S.successHelper[S.successIndex], true);
				S.successIndex++;
				break;
			case 2: // coming from Come Back State
        S.comeIndex++;
        if(S.comeIndex >= S.comeHelper.length){
          S.comeIndex = 0;
        }
				S.helperTimeout = setTimeout(revealHelper, 700, S.comeHelper[S.comeIndex], false);
				break;
			case 3: // coming from Leave State
        S.leaveIndex++;
        if(S.leaveIndex >= S.leaveHelper.length){
          S.leaveIndex = 0;
        }
				S.helperTimeout = setTimeout(revealHelper, 700, S.leaveHelper[S.leaveIndex], false);
				break;
			case 4: // coming from Secret Chat State
				S.helperTimeout = setTimeout(revealHelper, 700, S.chatHelper, false);
				break;
			case 5: // coming from Secret Chat State
				S.helperTimeout = setTimeout(revealHelper, 700, S.rumpleHelper, false);
				break;
		}

		var currentPass = getCurrentPasscode();
		console.log('which is ' + currentPass + ' by the way');

		document.getElementById('helper').style.display = 'none';

		//var invalid = document.getElementById('invalid').innerHTML="";

		S.numFailedAttempts = 0;
		if(S.loadingChats){
			clearTimeout(S.waiting);
			S.loadingChats = false;
		}
		return;
	}

  // Setup for the Chat Page
	if (window.passage.tags.includes('chat')) {
		//console.log('at the chat');
    S.currPage="chat";
		S.currentHelper = 4;
		//formatMessage(false);
		startChat();
		return;
	}

  // Setup for the Hangman Page
	if (window.passage.tags.includes('hangman')) {
    S.currPage="hangman";
		startHangman();
		return;
	}

  // Setup for the Manifesto Page
	if(window.passage.tags.includes('manifesto')){
		S.displayFullMessage = false;
		S.responsesDisplayed = false;
		S.messageDisplayed = false;
		S.currMessage = '';
		//document.getElementById('exit').style.display='none';
		var manifesto = document.getElementById('manifestoText').innerHTML;
		document.getElementById('manifestoText').innerHTML = '';
		document.getElementById('manifestoText').addEventListener("click", function(){S.displayFullMessage = true;})
		var exitButton=document.getElementById('exitButton');
		exitButton.onclick = function(){
	    goto('Passcode');
	  }
		exitButton.style.margin = 0;
		manifestoType(manifesto,0);
		return;
	}

	if(window.passage.tags.includes('other')){
		return;
	}

  S.currPage="discussion";

	if(window.passage.name == 'Enter'){
		console.log('chatting with JAX: attempt '+S.numJaxAttempts);
	}
	document.getElementById('darkMessage').addEventListener("click", function(){S.displayFullMessage = true;})
	document.getElementById('messageText').innterHTML = '';
	document.getElementById('messageText').style.margin = 0;
	//formatMessage(true);

	if(document.getElementsByClassName('responses').length > 0){
		var x = document.getElementsByClassName('responses');
		x[0].style.display = 'none';
	}
	S.displayFullMessage = false;
	S.responsesDisplayed = false;
	S.messageDisplayed = false;
	S.currMessage = '';
	showJaxMessage();
});

// return the current passcode for the Passcode Page
function getCurrentPasscode() {
	  var normalCodePhrase = S.passcodePhrase;
		var currCodeIndex = S.currPassIndex;
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
}

// update the index and therefore passcode for the Passcode Pages
// called after 3 failed attempts or failed hangman game or failed conversation
function updateCurrIndex() {
	var currCodeIndex= S.currPassIndex;
	var normalCodePhrase = S.passcodePhrase;
	if(currCodeIndex+3 >= normalCodePhrase.length)
		{
			S.currPassIndex = 3 - (normalCodePhrase.length - currCodeIndex);
		}
		else{
			S.currPassIndex = currCodeIndex+3;
		}
	console.log(getCurrentPasscode());
}

//load a new page
function goto(passage){
	clearTimeout(S.waiting);
	S.waiting = undefined;
	if(passage == "Passcode"){
		updateCurrIndex();
	}

	window.story.show(passage);
}
