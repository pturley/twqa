$(document).ready(function() {

  var numberOfQuestionsToAsk = 3;
  var questionsData;
  var timer = new Timer();
  var attemptedQuestionsLog = new Array();

  $('#clock').hide();
  setInterval(function() {
    $('#clock').text( timer.formatMilliseconds() )
  }, 0);

  function loadQuestions(callBack) {
    $.get("/questions/questions.json", function(data) {
      questionsData = data;
      callBack();
    });
  }

  function renderQuestions(data, num) {
    $("#questions .question").remove();
    var toRender = $.shuffle(data).slice(0, num);
    $.each(toRender, function(index, item) {

      var template =
              "<div class='question'>" +
                      "<div class='question_id'>{{question_id}}</div>" +
                      "<h2 class='question_text'>{{question}}</h2>" +
                      "<div class='options'>" +
                      "<ol class='choices'>" +
                      "{{#choices}}" +
                      "<li>" +
                      "<a href='#' class='btn large primary'>{{.}}</a>" +
                      "</li>" +
                      "{{/choices}}" +
                      "</ol>" +
                      "</div>" +
                      "<div class='answer'>{{correct_choice}}</div>" +
                      "</div>";

      var question = Mustache.to_html(template, item);
      $("#questions").append(question);
    });
  }

  function play() {
    $("#win").hide();
    $("#lose").hide();
    $("#incorrect_questions .incorrect_question").remove();
    attemptedQuestionsLog = [];
 	$('#clock').show();
    renderQuestions(questionsData, numberOfQuestionsToAsk);
	timer.start();
    ask($(".question").first(), 0, 0);
  }


  function ask(question, questionsAsked, score) {
    if (questionsAsked === numberOfQuestionsToAsk) {
      mark(score);
      attemptedQuestion();
    } else {
      question.toggle();
    }

    question.on("click", ".choices a", function(event) {
      var chosenAnswer = $(this).text();
      var correctAnswer = question.find(".answer").text();

      if (chosenAnswer === correctAnswer) {
        score += 1;
        correct_attempt(question);
      }
      else {
        recordIncorrectQuestion(question);
        incorrect_attempt(question);
      }

      question.toggle();
      ask(question.next(), questionsAsked += 1, score);
    });
  }

  function mark(score) {
    timer.stop();
    if (score === numberOfQuestionsToAsk) {
	  $.post('/timers/'+$('#player_id').text()+'/record',{time_seconds:timer.elapsedSeconds()})
		.success(function() {
			$.get('/leaderboard/player_position/'+$('#player_id').text(), function(data) {
				$('#leaderboard-position').text('Leaderboard position is #' + data)
			});
		});
      $("#win").toggle();
    } else {
      $("#lose").toggle();
    }
  }

  function recordIncorrectQuestion(question) {
      var questionText = question.find(".question_text").text();
      var answer = question.find(".answer").text();
      var template =
        "<div class='incorrect_question'>" +
        "<h3>" + questionText + "</h3>" +
        "<div>Answer: " + answer + "</div>" +
        "</div>";

      var questionWithCorrectAnswer = Mustache.to_html(template);
      $("#incorrect_questions").append(questionWithCorrectAnswer);
  }

  function correct_attempt(question) {
    hash_data = {"question_id":question.find(".question_id").text(),
                 "answered_correctly":true};
    attemptedQuestionsLog.push(hash_data);
  }

  function incorrect_attempt(question) {
    hash_data = {"question_id":question.find(".question_id").text(),
                 "answered_correctly":false};
    attemptedQuestionsLog.push(hash_data);
  }

  function attemptedQuestion () {
	  $.post('/attempted_questions/'+$('#player_id').text()+'/record', {attempted_questions:attemptedQuestionsLog});
  }

  $(".alert-actions a:nth-child(1)").on("click", function(event) {
    play();
  });

  loadQuestions(play);
});
