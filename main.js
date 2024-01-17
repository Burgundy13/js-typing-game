let startBtn = $(".start__btn");
let mainInput = $(".main__input");
let allLines = $(".line");
let reset = $(".restart");
let displayResult = $(".display__result");

let allText = [];
let score = 0;
let speed = 1;
let textLength = 3;
let gameEnd = false;
let lvl = 6;
let typingWords;
$(reset).hide();

startBtn.on("click", startGame);

function checkInputTyping() {
	let inputVal = $(this).val();
	let self = $(this);
	if (allText.includes(inputVal)) {
		let index = allText.indexOf(inputVal);
		allText.splice(index, 1);
		$("span")
			.filter(function () {
				return $(this).text() == inputVal;
			})
			.css("background", "lightblue")
			.fadeOut(100, function () {
				$(this).remove();
			});
		self.val("");
		score++;
		displayResult.html(score);
	}
}

//insert spans
function insertSpans() {
	if (gameEnd) return;
	for (var i = 0; i < allLines.length; i++) {
		let rand = Math.floor(Math.random() * 20);
		if (rand <= lvl) {
			let text = chooseText();
			allText.push(text);
			$(allLines[i]).append(`<span>${text}</span>`);
		}
	}
	setTimeout(insertSpans, 7000);
}

function chooseText() {
	let rand = Math.floor(Math.random() * typingWords.length);
	let savedText = typingWords[rand];
	typingWords.splice(rand, 1);

	return savedText;
}

function startGame() {
	$(this).hide();
	$(reset).show();
	mainInput.focus();

	//setup
	typingWords = words.filter((word) => word.length == textLength);

	let speedUp = setInterval(function () {
		textLength++;
		typingWords = words.filter((word) => word.length == textLength);
	}, 20000);

	mainInput.on("keyup", checkInputTyping);
	insertSpans();

	//animacija spanova
	let moveAll = setInterval(function () {
		let allSpans = $("span");
		allSpans.css({
			left: "+=" + speed,
		});

		//testiranje
		$.each(allSpans, (index, el) => {
			let position = $(el).position().left;
			if (position > 850) {
				clearAllIntervals();
				gameEnd = true;
			} else if (position > 700 && position < 710) {
				$(el).addClass("danger");
			}
		});
	}, 100);

	function clearAllIntervals() {
		clearInterval(moveAll);
		clearInterval(speedUp);
	}

	if (gameEnd) {
		clearAllIntervals();
		gameEnd = false;
	}
}

reset.on("click", function () {
	gameEnd = true;
	displayResult.html(0);
	$("span").remove();
	allText = [];
	score = 0;
	speed = 1;
	textLength = 3;
	startGame();
});
