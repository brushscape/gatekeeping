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

// allows you to skip before the timeout on the discussion tree pages without response options and the typing out
function listenForClick(){
  return;
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
