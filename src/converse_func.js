//read the dialogue tree by parsing each node
function parsePassage(passName){
	var message = '';
	var responses = [];
  var toprint = window.story.passage(passName).source; //all the text from the passage

	while(toprint.length > 0){
		//get one line from the text
    var find = toprint.indexOf('\n');
		var curr = '';
		if(find == -1){
			curr = toprint;
			toprint = '';
		}else{
	    curr = toprint.substring(0,find);
	    var newstring = toprint.substring(find+1);
	    toprint = newstring;
		}

		//find any code in there
		if(curr.indexOf('<%') != -1){
			var chop = curr;
			curr = 	chop.substring( 0, chop.indexOf('<%') ) +
									chop.substring( chop.indexOf('%>')+2 );
			chop = chop.slice( chop.indexOf('<%')+2, chop.indexOf('%>') );
			setTimeout(chop,1); //execute the code
		}

		//parse the line
    if(curr.length > 1){
			if(curr.substring(0,2) == '[[')
			{//line is a response
				var res = curr.substring(2,curr.length-2);
				responses.push(res);
			}
			else
			{//line is the message
				message = curr;
      }
		}

  }
	return [message,responses];

}

function showJaxMessage(){
	if(document.getElementById('responses')){
		document.getElementById('responses').style.display = 'none';
	}
	document.getElementById('messageText').innerHTML='';
	S.displayFullMessage = false;
	S.currMessage = "";
	clearTimeout(S.waiting);

	var content = parsePassage(S.currPassage);
	if(S.responseListeners.length > 0){
		document.getElementById('option1').removeEventListener("click", clickOption, true);
		document.getElementById('option1').removeEventListener("click", clickOption, true);
		document.getElementById('option1').removeEventListener("click", clickOption, true);
		S.responseListeners = [];
	}
	if(content[1].length > 0){
		document.getElementById('option1').innerHTML = content[1][0];
		document.getElementById('option1').style.pointerEvents = "auto";
		document.getElementById('option2').innerHTML = content[1][1];
		document.getElementById('option2').style.pointerEvents = "auto";
		document.getElementById('option3').innerHTML = content[1][2];
		document.getElementById('option3').style.pointerEvents = "auto";
	}else if(document.getElementById('responses')){
		document.getElementById('responses').remove();
	}
	typeText(content[0],0,content[1]);

}


// Types out the message on the Jax discussion pages
function typeText(message, i, responses){
	if(S.displayFullMessage){
			// skip to fully typed messsage
			document.getElementById('messageText').innerHTML = message;
			i = message.length;
		}
	if(i<message.length){
			// message not fully typed and no skip
			var punc = message[i]; //pick a character
			S.currMessage+=punc;
			i++;
			document.getElementById('messageText').innerHTML = S.currMessage;
			if(punc == '.' || punc == '?' || punc == '!'){
				var nextCharIsPunc = false;
				if(i < message.length){
					nextCharIsPunc = message[i] == '.' || message[i] == '?' || message[i] == '!';
				}
				if(nextCharIsPunc){
					if(message[i] == '.'){ // for elipses
						S.waiting = setTimeout(typeText, 200, message, i);
					}
					else{ //for just multiple question marks or exclamation points
						S.waiting = setTimeout(typeText, 30, message, i);
					}
				}
				else { //pause at end of sentence
					S.waiting = setTimeout(typeText, 500, message, i);
				}
			}
			else if (punc == ','){ //tiny pause at a comma
				S.waiting = setTimeout(typeText, 300, message, i);
			}
			else{ //no pause for normal text
				S.waiting = setTimeout(typeText, 30, message, i);
			}

	}
	else {
		// message is fully typed
		S.messageDisplayed = true;
		if(window.story.passage(S.currPassage).tags.includes('noexit')){
			//skip to next message without responses
			if(window.story.passage(S.currPassage).tags.includes('toLeave')){
				S.currPassage = "Leave";
			}else if(window.story.passage(S.currPassage).tags.includes('toComeback')){
				S.currPassage = "Come Back";
			}else if(window.story.passage(S.currPassage).tags.includes('toWelcome')){
				S.currPassage = "Welcome";
			}else{
				console.log('Error: invalid noexit destination');
			}
			S.waiting = setTimeout(showJaxMessage, 1000);
		}else if(window.story.passage(S.currPassage).tags.includes('leave')){
			//leave conversation
			var passage = S.currPassage;
			S.currPassage = "First";
			if(window.story.passage(passage).tags.includes('toPasscode')){
				if(window.story.passage(passage).tags.includes('rumple')){
					S.currentHelper = 5;
				}else{
					S.currentHelper = 3;
				}
				S.waiting = setTimeout(goto, 1000, "Passcode");
			}
			else if(window.story.passage(passage).tags.includes('toHangman')){
				S.waiting = setTimeout(goto, 1000, "Hangman");
			}
			else if(window.story.passage(passage).tags.includes('toManifesto')){
				S.currentHelper = 1;
				S.waiting = setTimeout(goto, 1000, "Manifesto");
			}
			else{
				console.log('Error: invalid leave destination');
			}
		}else{ // show responses
			fadeInResponse(0);
		}
	}

}

// Fade in the response options to Jax on the discussion tree pages
function fadeInResponse(j){
  var x = document.getElementsByClassName('responses')[0];
	if(j<1){ // if opacity is not opaque yet
		x.style.opacity = j;
		if (x.style.display == 'none'){
			x.style.display = 'flex';
		}
		j+=0.01;
		S.waiting = setTimeout(fadeInResponse, 10, j);
	}
	else{
    x.style.opacity = 1;
		S.responsesDisplayed = true;

    //makes sure clicking on anywhere in the option will click the link, not just the text
    var options = x.children;
    for(var i = 0; i < options.length; i++){
			var text = options[i].innerHTML;
      S.responseListeners[i] = options[i].addEventListener("click", clickOption.bind(this, i), true );
    }
	}
}


function clickOption(i){
	var el = document.getElementById("responses").children[i];
	el.style.pointerEvents = "none";
  S.currPassage = el.innerHTML;
	el.removeEventListener("click", clickOption, true);
	S.waiting = setTimeout(showJaxMessage, 10);
}
