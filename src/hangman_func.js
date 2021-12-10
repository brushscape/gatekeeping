// phrases for the hangman page
var hangmanWords = [
	'Be gay, do crime',
	'Anarchy',
	'Eat the rich',
	'People, over profits',
	'Silence is, compliance',
	'Anonymous',
	'Abolish, the police',
	'Vendetta',
	'Money is, a construct',
	'All cops, are bastards',
	'This machine, kills fascists',
	'Liberation',
	'No justice, no peace',
  'Scarcity, is a fallacy'];
var currHangmanIndex = 0;
var currHangmanWord = '';
var finalDisplayWord = '';
var usedWords = [];
var mq;

// check for the inputted letter in the hangman phrase and update the user
// function accessible inside the Twine nodes
setup.checkHangman = function checkHangman(letterString){
	var i = 0;
	var letter = letterString.charAt(0);
	var word = currHangmanWord.toUpperCase();

	if(word.indexOf(letter) != -1){
		var displayedWord = document.getElementById('hangmanWord').innerHTML;
    for(i = 0; i < finalDisplayWord.length; i++)
		{
      var currChar = finalDisplayWord.charAt(i);
      if(currChar == '<'){//skip break <br>
        i += 3;
      }
      else if(currChar == letter){
    		var temp = displayedWord.substring(0,i) + letter + displayedWord.substring(i+1,displayedWord.length);
  			displayedWord = temp;
      }
		}
		document.getElementById('hangmanWord').innerHTML = displayedWord;
	}
	else{
		var feedback = document.getElementById('hangmanFeedback').innerHTML;
		if(feedback.length > 3){
			document.getElementById('hangmanFeedback').innerHTML = feedback.substring(0,feedback.length-2);
		}else{ //Failed
			document.getElementById('hangmanFeedback').innerHTML = 'FAILED';
			document.getElementById('hangmanFeedback').style.color = 'crimson';
			setup.updateIndex();
			state.active.variables.currentHelper = 2; //coming from puzzle
			// currHangmanIndex++;
			// if(currHangmanIndex >= hangmanWords.length){
			// 	currHangmanIndex = 0;
			// }
      //currHangmanIndex = Math.floor(Math.random() * Math.floor(hangmanWords.length()));
      //mq.removeListener(WidthChange);
      setTimeout(state.display, 800, 'Passcode');
		}
	}
	var buttons = document.getElementsByTagName('button');
	for (i=0; i<buttons.length; i++) {
		var txt = buttons[i].textContent || buttons[i].innerText;
    if (txt == letterString){
			buttons[i].disabled = true;
		}

  }

	//Word is complete!
	if(document.getElementById('hangmanWord').innerHTML.indexOf('_') == -1){
		document.getElementById('hangmanFeedback').innerHTML = 'SUCCESS';
		document.getElementById('hangmanFeedback').style.color = 'lightgreen';
		// currHangmanIndex++;
		// if(currHangmanIndex >= hangmanWords.length){
		// 	currHangmanIndex = 0;
		// }
		numJaxAttempts++;
    //mq.removeListener(WidthChange);
		setTimeout(state.display, 800, 'Enter');
	}

};


// Fit hangman word inside div if too long
function fitText(longestLine){
//return;
  var defaultAdjust = 7; //vw
  var defaultBig = 60;//px
  var bigScreenThresh = 800; //px

  //mq = window.matchMedia("(min-width: 800px)");
    //mq.addListener(WidthChange);
  //if(currPage == "hangman"){
    var wordDiv = document.getElementById('hangmanWord');
    if(longestLine >= 25){
        //longer than 25
        // if(mq.matches)
        //   wordDiv.style.fontSize = "40px";
        // else
          wordDiv.style.fontSize = "calc(14px + 1.4vw)";
    }else if(longestLine >= 20){
        //longer than 20
          wordDiv.style.fontSize = "calc(16px + 1.6vw)";
    }else if(longestLine >= 15){
          //longer than 15
          wordDiv.style.fontSize = "calc(18px + 1.8vw)";
    }else{
        //shorter than 15
          wordDiv.style.fontSize = "calc(20px + 2vw)";
    }
//  }
}
