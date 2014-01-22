
"use strict";
$(document).ready(function() {
    window.quotes = [];
    window.randomQuote = 0;
    countQuotes();
    $("#add").click(addNewQuote);
    $("#wannaAddQuote").click(showAddQuote);
    $("#refresher").click(refreshThatQuote);
});

// this function gets all quotes and puts random quote on the page when user intially visits page.
function countQuotes() {
    $.ajax({
        url: "getQuote.php",
        type: "GET",
        success: function(json) {
            var jsonData = JSON.parse(json);
            for (var m = 0; m < jsonData.length; m++) {
                quotes.push(jsonData[m]);
            }
            randomQuote = getRandomNumber();
            $("#author").append("- ").append(quotes[randomQuote].author);
            $("#quote").append(quotes[randomQuote].message);
        },
        error: function() {
            alert("Please refresh the page.");
        }
    });
}

// once clicked this will show a different quote
function refreshThatQuote() {
    randomQuote++;
    if(typeof quotes[randomQuote] == 'undefined') {
        randomQuote = 0;
    }
    $("#author").empty().append("- ").append(quotes[randomQuote].author);
    $("#quote").empty().append(quotes[randomQuote].message);
}

//generates random # between 0-quotes.length and returns #
function getRandomNumber() {
    var randomQuote = Math.floor(Math.random() * quotes.length);
    return randomQuote;
}

//this function hides "Add a quote" and shows form to fill out quote to be submitted
function showAddQuote() {
    $("#wannaAddQuote").fadeOut("slow", function() {
        $("#wannaAddQuote").removeClass("show").addClass("hide");
        $("#addingQuotesDiv").fadeIn("slow", function() {
                $("#addingQuotesDiv").removeClass("hide").addClass("show");     
        });
    });
}

//adds new quote to DB  and to array
function addNewQuote() {
    //put post.ajax to make ajax request more slim looking
    var quoteToSend = $("#addQuote").val();
    var authorToSend = $("#addAuthor").val();
    //change value to length, see WHAT is being counted as length
    if (quoteToSend.length === 0 || authorToSend.length === 0 || quoteToSend == " ") {
        alert("You can't leave the quote or author field blank.");
    } else {
        $.ajax({
            url: "submitQuote.php",
            type: "POST",
            data: {author: authorToSend , quote: quoteToSend},
            success: function() {
                var lengthOfQuotesArray = Object.keys(quotes).length;
                quotes.push({ author : $('#addAuthor').val(), message: $('#addQuote').val() });
                $("#author").empty().append("- ").append(quotes[lengthOfQuotesArray].author);
                $("#quote").empty().append(quotes[lengthOfQuotesArray].message);
                $("#addQuote").val("");
                $("#addAuthor").val("");
                $("#addingQuotesDiv").removeClass("show").addClass("hide");
                $("#wannaAddQuote").removeClass("hide").addClass("show");
                $("#addQuoteDiv").append("<p id='quoteAdded'>You're quote was added!</p>");
                $("#addQuoteDiv").fadeIn().delay(6000).fadeOut('slow'); 
            },
            error: function() {
                alert("There was a problem. Please try again.");
            }
        });
    }
}
