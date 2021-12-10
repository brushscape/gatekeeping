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
