
function startChat(){
  var chatScroll = document.getElementById('chatScroll');
  document.getElementById('exitButton').onclick = function(){
    goto('Passcode');
  }
  document.getElementById('chatMessage').style.display = 'none';
  S.chats = revealMessage(chatScroll,0,0);
  S.loadingChats = false;//true;
}

// Reveal messages in Chat Page
function revealMessage(scroll, textIndex){
  if(textIndex >= S.messageArray.length){return;}

  var messageEl = document.getElementById('chatMessage').cloneNode(true);
  var notifEl = document.getElementById('chatNotif').cloneNode(true);
  var loading = document.getElementById('loading');

  var toDisplay = S.messageArray[textIndex];
  //var newIndex = scrollIndex+1;
  if(toDisplay.charAt(0) == "@"){ //if chat notif
    notifEl.innerHTML = toDisplay;
    scroll.appendChild(notifEl);
    //scroll.replaceChild(notifEl,loading);
    //scroll.appendChild(loading);

    updateScroll(document.getElementById('chatScroll'),S.chatScrollDiff);
  	if(textIndex+1 < S.messageArray.length){
  		S.waiting = setTimeout(revealMessage, S.chatNotifWait, scroll, textIndex+1);
  		S.loadingChats = true;
  	}else {
  		S.loadingChats = false;
  	}
  }else{
  	//var message = S.fullText[textIndex];
  	var user = toDisplay.charAt(0);
  	var avatar = messageEl.children[0];
  	var avatarImg = avatar.children[0];
  	var text = messageEl.children[1];
  	var username = text.children[0];
  	var messageText = text.children[1];
    messageText.style.margin = 0;
    //var loading = text.children[2];
    	switch(user){
  				//Jax #4E4256
  				case 'J':
  					username.innerHTML = '@blackout';
  					avatarImg.src = S.img['JAX'];
  					messageEl.style.backgroundColor = '#4E4256';
  					messageEl.style.borderColor = '#2C1D36'
  					break;
  				//Daeka #425653
  				case 'D':
  					username.innerHTML = '@cyborgrip';
  					avatarImg.src = S.img['DAE'];
  					messageEl.style.backgroundColor = '#425653';
  					messageEl.style.borderColor = '#1D3630'
  					break;
  				//Quinn #56424B
  				case 'Q':
  					username.innerHTML = '@calikilly';
  					avatarImg.src = S.img['QUI'];
  				  messageEl.style.backgroundColor = '#56424B';
  					messageEl.style.borderColor = '#361D28';
  					break;
  				//Mouse #564C42
  				case 'M':
  					username.innerHTML = '@snakebait';
  					avatarImg.src = S.img['MOU'];
  					messageEl.style.backgroundColor = '#564C42';
  					messageEl.style.borderColor = '#36291D'
  					break;
          case 'E':
    				username.innerHTML = '@nightemissary';
    				avatarImg.src = S.img['EMI'];
    				messageEl.style.backgroundColor = '#495642';
    				messageEl.style.borderColor = '#2A361D'
    				break;
  				default:
  					username.innerHTML = '@anonymous';
            avatarImg.src = S.img['ANON'];
            messageEl.style.backgroundColor = 'darkgrey';
  					messageEl.style.borderColor = 'dimgrey'
  					break;
  			}
  	//messageEl.style.display = 'flex';
    //scroll.replaceChild(messageEl,loading);
    //scroll.appendChild(loading);
    updateScroll(document.getElementById('chatScroll'),S.chatScrollDiff);
    var waitTime = calcWaitTime(toDisplay.length);
    loading.style.display='block';
    S.waiting = setTimeout(showMessageText, waitTime, messageEl, messageText, loading, textIndex, scroll);

  }

}

function calcWaitTime(givenLength){
  var mLen = givenLength;
  if(mLen < 20){
    mLen = 20;
  }
  return Math.floor(Math.random() * ((mLen*40+500) - mLen*40) + mLen*30);
}

function showMessageText(messEl,textEl, loadingEl, textIndex, scroll){
  scroll.appendChild(messEl);
  loadingEl.style.display = 'none';
  messEl.style.display='flex';
  updateScroll(document.getElementById('chatScroll'),S.chatScrollDiff);
  textEl.innerHTML = S.messageArray[textIndex].substring(2);

  if(textIndex+1 < S.messageArray.length){
    if(S.messageArray[textIndex+1].charAt(0) == '@'){ //next message is a chat notif
      S.waiting = setTimeout(revealMessage, S.chatNotifWait, scroll, textIndex+1);
    }else{
      var randTime = calcWaitTime(S.messageArray[textIndex].length);
      S.waiting = setTimeout(revealMessage, randTime/2, scroll, textIndex+1);
    }
    S.loadingChats = true;
  }else {
    S.loadingChats = false;
  }
}

// Update scroll on Chat Page
function updateScroll(element,scrollDiff){
		if(element.scrollHeight - element.scrollTop <= (window.screen.height / scrollDiff)){
    	element.scrollTop = element.scrollHeight;
		}
}
