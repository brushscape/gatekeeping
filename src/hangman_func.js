// phrases for the hangman page
// 	'Be gay, do crime'
// 	'Anarchy'
// 	'Eat the rich'
// 	'People, over profits'
// 	'Silence is, compliance'
// 	'Anonymous'
// 	'Vendetta'
// 	'Money is, a construct'
// 	'All cops, are bastards'
// 	'This machine, kills fascists'
// 	'Liberation'
// 	'No justice, no peace'
//  'Scarcity, is a fallacy'

function startHangman(){
	document.getElementById('hangmanFeedback').style.color = 'darkgrey';
	//randomly pick one of the hangman phrases
	 S.currHangmanIndex = Math.floor(Math.random() * Math.floor(S.hangmanWords.length));
	 var word = S.hangmanWords[S.currHangmanIndex];
	 S.currHangmanWord = word;
	 console.log(word);

	 //make sure phrase is not repeated until all the phrases are used and you can restart
	 S.hangmanWords.splice(S.currHangmanIndex, 1); //remove from main array
	 S.usedWords.push(word);
	 if(S.hangmanWords.length == 0){
		 S.hangmanWords = S.usedWords;
		 S.usedWords = [];
	 }

	 //setup guessing letter board
	 var tempButton = document.getElementById('templateButton');
	 var lineLetters = ['a','b','c','d','e','f','g','h','i','j'];
	 var line = document.getElementById('firstLine');
	 var i;
	 for(i=0; i<lineLetters.length; i++){
		 var letterButton = makeLetterButton(tempButton, lineLetters[i]);
		 line.appendChild(letterButton);
	 }
	 lineLetters = ['k','l','m','n','o','p','q','r','s'];
	 line = document.getElementById('secondLine');
	 for(i =0; i<lineLetters.length; i++){
		 var letterButton = makeLetterButton(tempButton, lineLetters[i]);
		 line.appendChild(letterButton);
	 }
	 lineLetters = ['t','u','v','w','x','y','z'];
	 line = document.getElementById('thirdLine');
	 for(i =0; i<lineLetters.length; i++){
		 var letterButton = makeLetterButton(tempButton, lineLetters[i]);
		 line.appendChild(letterButton);
	 }
	 tempButton.style.display = 'none';


	 var displayWord = '';
	 var hiddenWord = '';
	 var lineStart = 0;
	 var lineLength = 0;
	 var longestLine = 0;
	 //setup hangman board for selected phrase
	 for (var j = 0; j < word.length; j++) {
		 var currChar = word.charAt(j);
		 if(currChar == ','){
			 displayWord += ' <br>';
			 hiddenWord += ' <br>';
			 j++;
			 lineLength = displayWord.length - lineStart - 4;
			 if(lineLength>longestLine){
				 longestLine = lineLength;
			 }
			 lineStart = displayWord.length;
		 }
		 else if(word.charAt(j) == ' '){
			 displayWord += '  ';
			 hiddenWord += '  ';
		 }
		 else{
			 displayWord += ' _';
			 hiddenWord += ' ' + word.charAt(j);
		 }
	 }
	 displayWord += ' ';
	 lineLength = displayWord.length-lineStart;
	 if(lineLength>longestLine){
		 longestLine = lineLength;
	 }
	 S.finalDisplayWord = hiddenWord + ' ';
	 S.finalDisplayWord = S.finalDisplayWord.toUpperCase();
	 fitText(longestLine);

	document.getElementById('hangmanWord').innerHTML = displayWord;
}

//for setting up the letter guessing board
function makeLetterButton(template, letter){
	var newButton = template.cloneNode();
	var upperLetter = letter.toUpperCase();
	newButton.innerHTML = upperLetter;
	newButton.onclick = function () {checkHangman(upperLetter);};
	return newButton;
}

// check for the inputted letter in the hangman phrase and update the user
// function accessible inside the Twine nodes
function checkHangman(letterString){
	var i = 0;
	var letter = letterString.charAt(0);
	var word = S.currHangmanWord.toUpperCase();

	if(word.indexOf(letter) != -1){
		var displayedWord = document.getElementById('hangmanWord').innerHTML;
    for(i = 0; i < S.finalDisplayWord.length; i++)
		{
      var currChar = S.finalDisplayWord.charAt(i);
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
			S.currentHelper = 2; //coming from puzzle
      setTimeout(goto, 800, 'Passcode');
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
		S.numJaxAttempts++;
		setTimeout(goto, 800, 'Enter');
	}

};


// Fit hangman word inside div if too long
function fitText(longestLine){
  var defaultAdjust = 7; //vw
  var defaultBig = 60;//px
  var bigScreenThresh = 800; //px
    var wordDiv = document.getElementById('hangmanWord');
    if(longestLine >= 25){
        //longer than 25
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
