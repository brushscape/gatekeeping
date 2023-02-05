// Check for correct passcode on the Passcode Page
// function accessible inside the Twine nodes
function checkPasscode(){
		var specialCode = S.chatPassword;
		var normalCode = getCurrentPasscode();
		var first = document.getElementById('textbox-first');
		var mid = document.getElementById('textbox-mid');
		var last = document.getElementById('textbox-last');
		var currCode = first.value + mid.value + last.value;
		document.getElementById('helper').style.display = 'none';
    document.getElementById('codeFeedback').style.opacity = 1;

		if(normalCode == currCode.toUpperCase()){
       // correct code, proceed to J discussion tree
			 document.getElementById('codeFeedback').innerHTML = 'Correct!';
			 document.getElementById('codeFeedback').style.color = 'lightgreen';
			 S.numJAttempts++;
			 //state.display('Enter', this);
			 goto('Enter')

			return;
		}
		else if(specialCode == currCode.toUpperCase()){
      // correct special code, proceed to secret chat page
			 document.getElementById('codeFeedback').innerHTML = 'Valid ID';
			 document.getElementById('codeFeedback').style.color = 'lightblue';
			 //state.display('Chat', this);
			 goto('Chat')
			return;
		}
		else{
      // invalid code, alert user to try again
			S.numFailedAttempts++;

			if(S.numFailedAttempts%3 == 1){
				document.getElementById('codeFeedback').innerHTML = 'Once Invalid';
			}
			else if(S.numFailedAttempts%3 == 2){
				document.getElementById('codeFeedback').innerHTML = 'Twice Invalid';
				if(S.currentHelper==0){
					revealHelper('M:They look rather clueless to me.', false);
					S.currentHelper = -1;
				}
			}
			else if(S.numFailedAttempts%3 == 0 && S.numFailedAttempts>0){
				updateCurrIndex();
        updateBackground(normalCode,getCurrentPasscode());
				document.getElementById('codeFeedback').innerHTML = 'Thrice Invalid<br>New Code Chosen';
			}
		}
		if(S.numFailedAttempts%4 == 0)
		{
			var helperText = S.passwordDict[getCurrentPasscode()];
			revealHelper(helperText,false);
		}
};

// Reveal helper popup message on the Passcode Page
function revealHelper(helperText, nextMessage){
	var user = helperText.charAt(0);
	switch(user){
		//J #4E4256
		case 'J':
			document.getElementById('username').innerHTML = '@blackout';
			document.getElementById('helperAvatarImg').src = S.img['JEY'];
			document.getElementById('helper').style.backgroundColor = '#4E4256';
			break;
		//Teika #425653
		case 'D':
			document.getElementById('username').innerHTML = '@cyborgrip';
			document.getElementById('helperAvatarImg').src = S.img['TEI'];
			document.getElementById('helper').style.backgroundColor = '#425653';
			break;
		//Kiko #56424B
		case 'Q':
			document.getElementById('username').innerHTML = '@calikilly';
			document.getElementById('helperAvatarImg').src = S.img['KIK'];
			document.getElementById('helper').style.backgroundColor = '#56424B';
			break;
		//Mouse #564C42
		case 'M':
			document.getElementById('username').innerHTML = '@snakebait';
			document.getElementById('helperAvatarImg').src = S.img['MOU'];
			document.getElementById('helper').style.backgroundColor = '#564C42';
			break;
		//Emis
		case 'E':
			document.getElementById('username').innerHTML = '@nightemissary';
			document.getElementById('helperAvatarImg').src = S.img['EMI'];
			document.getElementById('helper').style.backgroundColor = '#495642';
			break;
		default:
			document.getElementById('username').innerHTML = '@anonymous';
			break;
	}
	document.getElementById('helperText').innerHTML = helperText.substring(2);
	document.getElementById('helper').style.display = 'flex';
	if(nextMessage)
	{
		switch(S.currentHelper){
			case 0:
				var isNext = S.initIndex < S.initHelper.length-1;
				var mLen = helperText.length;
				var randTime = mLen*40 + 500;//+500?
				if(randTime<900){randTime=900;}
			  S.waiting = setTimeout(revealHelper, randTime, S.initHelper[S.initIndex], isNext);
				S.initIndex++;
				break;
			case 1:
				isNext = S.successIndex < S.successHelper.length-1;
				mLen = helperText.length;
				randTime = mLen*40 + 500;//+500?
				if(randTime<900){randTime=900;}
				S.waiting = setTimeout(revealHelper, randTime, S.successHelper[S.successIndex], isNext);
				S.successIndex++;
				break;
		}
	}
}

//controls the floating passwords on the passcode page
//the current passcode is a slightly higher opacity than the others
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

  var codePhrase = S.passcodePhrase;
  var passcodes = [];
  for(var k=0; k<codePhrase.length; k+=3){
    var code = codePhrase.substring(k,k+3).toUpperCase();
    passcodes.push(code);
    //passCryptDict[code] = [];
  }
  var currPasscode = getCurrentPasscode();

  for(var i=0; i<passcodes.length*5; i++){
    var div = document.createElement("div");

    var currCodeToDisplay = passcodes[i%(passcodes.length)];
    var size = (Math.random() * 1)+0.5;
    var smallest = '10px';
    var x = (Math.random() * 100);
    var y = (Math.random() * 100);
    var delay = (Math.random() * 20)-10;
    var length = 15;
    var direction = Math.floor(Math.random() * 4);


    var innerText = currCodeToDisplay;

    div.style.fontSize = 'calc('+smallest + ' + '+size +'vw)';
    div.style.lineHeight = 'calc('+smallest + ' + '+size*4 +'vw)';
    div.style.letterSpacing = 'calc('+smallest + ' + '+size*2.5 +'vw)';
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

//update the cryptic background to reflect the new passcode selected
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
