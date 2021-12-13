// Types out the manifesto on the Manifesto Pages
function manifestoType(message,i){
	S.currentHelper = 1;
	if(S.displayFullMessage){
			// skip to fully typed messsage
			document.getElementById('manifestoText').innerHTML = message;
			i = message.length;
		}
  if(i%10==0){
    updateScroll(document.getElementById('manifestoText'),S.manifScrollDiff);
  }
	if(i<message.length){
			// message not fully typed and no skip
			var punc = message[i];
			S.currMessage+=punc;
			if(punc == '<'){ //skip over <br>
				S.currMessage+=message.substring(i+1,i+4);
        document.getElementById('manifestoText').innerHTML = S.currMessage;
        updateScroll(document.getElementById('manifestoText'),S.manifScrollDiff);
				i+=3;
			}else{
        document.getElementById('manifestoText').innerHTML = S.currMessage;
      }
			i++;

			if(punc == '.' || punc == '?' || punc == '!'){
				var nextCharIsPunc = false;
				if(i < message.length){
					nextCharIsPunc = message[i] == '.' || message[i] == '?' || message[i] == '!';
				}
				if(nextCharIsPunc){
          updateScroll(document.getElementById('manifestoText'),S.manifScrollDiff);
					if(message[i] == '.'){ //for elipses
						S.waiting = setTimeout(manifestoType, 200, message, i);
					}
					else{ //for just multiple question marks or exclamation points
						S.waiting = setTimeout(manifestoType, 30, message, i);
					}
				}
				else { //pause at end of sentence
					S.waiting = setTimeout(manifestoType, 500, message, i);
				}
			}
			else if (punc == ','){ //tiny pause at a comma
        updateScroll(document.getElementById('manifestoText'),S.manifScrollDiff);
				S.waiting = setTimeout(manifestoType, 300, message, i);
			}
			else{ //no pause for normal text
				S.waiting = setTimeout(manifestoType, 30, message, i);
			}

	}
	else {
		// message fully typed
		S.messageDisplayed = true;
	}
}
