// Types out the manifesto on the Manifesto Pages
function manifestoType(message,i){
	if(displayFullMessage){
			// skip to fully typed messsage
			document.getElementById('manifestoText').innerHTML = message;
			i = message.length;
		}
  if(i%10==0){
    updateScroll(document.getElementById('manifestoText'),manifScrollDiff);
  }
	if(i<message.length){
			// message not fully typed and no skip
			var punc = message[i];
			currMessage+=punc;
			if(punc == '<'){ //skip over <br>
				currMessage+=message.substring(i+1,i+4);
        document.getElementById('manifestoText').innerHTML = currMessage;
        updateScroll(document.getElementById('manifestoText'),manifScrollDiff);
				i+=3;
			}else{
        document.getElementById('manifestoText').innerHTML = currMessage;
      }
			i++;

			if(punc == '.' || punc == '?' || punc == '!'){
				var nextCharIsPunc = false;
				if(i < message.length){
					nextCharIsPunc = message[i] == '.' || message[i] == '?' || message[i] == '!';
				}
				if(nextCharIsPunc){
          updateScroll(document.getElementById('manifestoText'),manifScrollDiff);
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
        updateScroll(document.getElementById('manifestoText'),manifScrollDiff);
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
