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
    messageText.style.lineHeight = 'calc(15px + 0.5vw)';
    messageText.style.padding = '0.5vw';
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

// Update scroll on Chat Page
function updateScroll(element,scrollDiff){
    //console.log("amount: "+(element.scrollHeight - element.scrollTop) );
    //console.log("limit: "+(window.screen.height / scrollDiff));
		if(element.scrollHeight - element.scrollTop <= (window.screen.height / scrollDiff)){
    	element.scrollTop = element.scrollHeight;
		}
}
