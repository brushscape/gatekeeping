//setup global variables
if (typeof S == "undefined") {
	var S = {
		aaa:0,
		currPage: "",

    //helper popup messages on the passcode page to help the user
    initHelper:["D:check it out. they've attracted another one"],
    successHelper:
      [
				"E:Congrats on your success",
        "Q:...tat it.?",
        "M:I can't believe they thought that would be a worthwhile reward.",
        "D:if you want to complain, take it to the chat"
      ],
    comeHelper:
      [
				"M:That phrase not to your liking?",
        "Q:badd spellr",
        "D:better luck next time, I guess",
				"E:If it helps, the phrases follow a theme"
      ],
    leaveHelper:
      [
				"D:if you were trying to ask them personal questions... maybe dont",
        "M:Don't take it personally. They're just an asshole.",
				"E:Don't worry. They don't hold a grudge. You can always try again",
        "Q:pisssed em off XD"
      ],
    chatHelper: "J:You just found the biggest secret. are you satisfied?",
		rumpleHelper: "J:Your move, little bird. what's my name?",

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
        THO: "D:I <b>tho</b>ught this would go faster",
        UGH: "Q:<b>ugh</b> nott gud at tis r u",
    		THE: "M:I honestly didn't think <b>the</b> code would be this difficult.",
    		RIC: "E:Look around. Can't you see t<b>ric</b>k?",
    		HAR: "M:How <b>har</b>d are you going to make me <b>har</b>p on you?",
    		EDR: "Q:evr gess<b>ed r</b>ight?",
    		UNK: "E:You seem to be in a f<b>unk</b>",
    		ONM: "M:At this rate, you’ll have to put in a shitt<b>on m</b>ore.",
    		ONE: "D:maybe try <b>one</b> more time",
    		YYO: "E:There's no need to do this b<b>y yo</b>urself",
    		URP: "M:We're not here to console yo<b>ur p</b>itiful ego.",
    		ARC: "M:If you don't get this soon, I'm m<b>arc</b>hing out of here.",
    		HED: "D:I'm dying to s<b>hed</b> my promise to be here",
    	  LIP: "E:I'm sorry if it seems like we're giving you <b>lip</b>",
    		SWO: "D:I'd be more direct if I wasnt <b>swo</b>rn to secrecy",
    		NTT: "Q:ca<b>nt t</b>elll hints frevr",
    		AST: "M:It's <b>a st</b>rain to come up with these sentences",
    		EAD: "M:Why did I agree to this? They didn't even pl<b>ead</b>.",
    		ROP: "D:I didn't ask to get <b>rop</b>ed into this either"
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
      	'This machine, kills fascists',
      	'Leeches for, Liberation',
        'Scarcity, is a fallacy',
				'Bite the hand, that feeds on you',
				'Fuck the, Ouroboros',
				'Dare to keep, your body yours',
      ],
    currHangmanIndex: 0,
    currHangmanWord: '',
    finalDisplayWord: '',
    usedWords: [],
    mq: undefined,

		messageArray:
		[
		  "M:This was an obnoxious way to spread a manifesto.",
		  "D:I doubt that was the main purpose of this",
		  "M:Who wants to bet they just wanted a powertrip?",
		  "Q:borring powrtip",
		  "J:Maybe to you",
		  "M:What the hell is that supposed to mean?",
		  "J:I added anyone who played to my botnet. The game gives me time to upload the virus &#128521",
		  "D:well shit. how many did you add?",
		  "J:Wouldn't you like to know &#128527",
		  "D:I dont know why I expected a straight answer...",
		  "E:What's a botnet?",
		  "D:Its basically when you zombifying people's computers so you can steal computing power",
		  "Q:shitt!! mske zombies?!",
		  "M:It's not as cool as it sounds.",
		  "J:It is exactly as cool as it sounds. You just don't give a shit about computers",
		  "M:Why should I? We have enough reclusive circuit nuts without me caring about motherboards.",
		  "J:Those were some cute buzzwords, facer. &#128527 Want to see how they're actually used?",
		  "D:Jax...",
		  "J:What?! What's a little demonstration amongst friends &#128521",
		  "M:**Comrades. At best.",
		  "D:ouch",
		  "J:Damn, this little mouse bites &#128556 You show those teeth to your followers?",
		  "M:I don't need to waste my charisma on you &#128405",
		  "J:Tell that to your stream. Cuz you just went live &#128526&#128073&#128073",
		  "M:Get off my FUCKING interface, you annoying little shit.",
		  "E:What is happening?",
		  "M:You are so damn lucky that was still on test mode. I would have killed you if that had gone public.",
		  "J:HA! You should have seen the look on your face tho &#128514&#128514&#128514",
		  "Q:lol wanna seee mouse look stupid",
		  "M:&#128405",
			"D:Quinn, be nice",
			"Q:no",
			"J:A kitty after my own heart",
		  "D:that was way too fast. are you just always in their camera?",
		  "J:How else am I supposed to keep an eye on you guys &#128521",
		  "M:You're not, invasive prick.",
		  "D:guess its time to comb my OS for Jax-shaped viruses again &#128579",
		  "J:It's cute you think you can get rid of me &#128536",
		  "Q:wen teach me how fuck w mouse",
		  "J:Oh easy. Running <u>this</u> gets you into their camera and <u>this</u> uploads screenshots to their feed",
		  "J:I'm sure you can figure out how to give them a heartattack from there &#128521",
		  "Q:yee",
		  "M:JAX",
			"E:Jax...",
		  "D:Quinn, dont touch that link! dont be a script kiddie",
		  "J:**script kitty &#128514&#128514&#128514",
		  "D:Jax stfu",
		  "M:QUINN GET OFF MY FUCKING INTERFACE",
		  "J:good kitty &#128527",
		  "Q:f u dae",
			"E:What did you do?",
			"D:I broke their link. youre welcome",
		  "J:Come on, Daeka &#128553 You're spoiling the fun &#128548",
		  "D:harassing Mouse is not 'fun'",
		  "J:Isn't it though? &#128527",
		  "Q:lol",
		  "M:Do you want me to start harassing you back, you cocky egotistical embodiment of a god-complex?",
		  "J:Do I? &#129397",
		  "M:You're insufferable. Do you even care about radicalizing these people?",
		  "J:I thought that was your job &#128533",
		  "D:It's all our jobs? That's kind of the point???",
			"E:We're comrades :)",
		  "Q:thot we eat rich",
		  "E:That's a figure of speach",
		  "J:Is it, Emis?",
		  "D:mostly. though I'm not really expecting Quinn to be invested in theology",
		  "J:They're just here to maul some corporates &#128520",
		  "Q:nom",
		  "D:sigh I need to separate you two",
		  "M:good luck. you're better off separating yourself &#9996&#128405",
		  "@snakebait has left the chat room",
		  "J:No, wait, come back!",
			"E:I really don't know what you were expecting",
			"J:I was just playing around!",
		  "D:One of these days you're going to do something they won't forgive you for",
		  "J:Psh, please, I'm too cute to stay mad at",
			"E:Sigh don't I know it",
			"J:Love you bb &#128536",
			"E:I love you too",
			"Q:bleh",
			"D:haha I concur",
			"E:Lol I'll spare you any more romantics",
			"@nightemissary has left the chat room",
			"J:Aww, now both my loves got scared away",
			"D:dont let Mouse hear you calling them that",
			"J:You gonna be a snitch?",
			"Q:ya",
			"J:&#128551 you wouldn't",
			"Q:wud",
			"J:Daeka! I think your cat might be feral",
			"D:you taught them to be like this. I take no responsibility",
			"J:&#128514 yeah that's fair.",
			"J:Hey Quinn, I'll trade ya 10g for your discretion",
			"Q:hehe deel",
		  "D:who said you were allowed to get them high??",
			"J:They're not real drugs, Daeka. Catnip doesn't count",
			"D:for them?? yes it does!",
			"Q:no count",
			"D:you dont get a say in this",
			"Q:cant stawp mee",
			"@calikilly has left the chat room",
			"D:you are the worst influence on them, I swear",
		  "@cyborgrip has left the chat room",
		  "J:Only when I want to be",
		  "@blackout has left the chat room"
		],
		chatNotifWait: 600,

    img:
      {
        'JAX': 'img/avatar_blackout.JPG',//'https://pbs.twimg.com/media/ElNEt_9WMAMZPZ-?format=jpg&name=small',
        'DAE': 'img/avatar_cyborgrip.JPG',//'https://pbs.twimg.com/media/ElNEuAHXYAcIVuW?format=jpg&name=small',
        'QUI': 'img/avatar_calikilly.JPG',//'https://pbs.twimg.com/media/ElNEuEcX0AEXp44?format=jpg&name=small',
        'MOU': 'img/avatar_snakebait.JPG',//'https://pbs.twimg.com/media/ElNEuBuX0AUtitq?format=jpg&name=small'
				'EMI': 'img/avatar_nightemis.JPG',
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
