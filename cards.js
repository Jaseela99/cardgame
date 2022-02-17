let blackjackGame = {
  suites: ["♠", "♦", "♣", "♥"],                  //spades,diamonds,clubs,hearts
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "K", "J", "Q", "A"],    //13 ranks of a suit
  cardMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11],
  },

  you: {
    scoreSpan: "#Player-Result",       
    div: "#Player-box",
    score: 0,
  },

  dealer: {
    scoreSpan: "#Dealer-Result",
    div: "#Dealer-box",
    score: 0,
  },
  
  
  Player: 0,
  Tie: 0,
  Dealer: 0,
  isStand: false,                                          
  turnsOver: false,
};

const YOU = blackjackGame["you"];           
const DEALER = blackjackGame["dealer"];

//events added to the buttons

document.querySelector("#hitButton").addEventListener("click", hits);
document.querySelector("#standButton").addEventListener("click", stands);
document.querySelector("#dealButton").addEventListener("click", deals);

//when button hit is clicked

function hits() {
  if (blackjackGame["isStand"] === false) {
    let card = randomCard();  //player's card is chosen
    showCard(card, YOU);      //card is shown
    updateScore(card, YOU);   //score updated
    showScore(YOU);           //score shown
  }
}

//to choose a random card

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);  //math.random integer values from 0 to 1,math.floor floors the value
  return blackjackGame["cards"][randomIndex];
}

//to show card

function showCard(card, activePlayer) {

  if (activePlayer["score"] <= 21) {
    let cardFace = document.createElement("div");        //created a div with class name card
    let randomIndexSuit = Math.floor( Math.random() * 4);  //number of suites is 4
    let singleSuit = blackjackGame["suites"][randomIndexSuit]; //to create a random suit
    cardFace.className = "card";
    let key = Object.keys(blackjackGame["cardMap"]);              // it creates an array of objects with keys
    for (let i = 0; i < key.length; i++) {
      if (key[i] == card){
        cardFace.innerHTML = card + `<div id=suites>${singleSuit}</div>`;          
      }
    }
    document.querySelector(activePlayer["div"]).appendChild(cardFace);       //created div is appended to playerbox div
  }
}

// function to add the score of cards displayed.

function updateScore(card, activePlayer) {
  
  if (card === "A") {
    if (activePlayer["score"] + blackjackGame["cardMap"][card][1] <= 21) {      //if score +value less than 21 ,then value of A will be 11
      activePlayer["score"] += blackjackGame["cardMap"][card][1];               
    } else {
      activePlayer["score"] += blackjackGame["cardMap"][card][0];               //else it will be 1
    }
  } else {
    activePlayer["score"] += blackjackGame["cardMap"][card];                    //value is same as in cardMap
  }
}

// to show score

function showScore(activePlayer) {

  if (activePlayer["score"] > 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "Try again!";         //0 will be changed to tryagain
    document.querySelector(activePlayer["scoreSpan"]).style.color = "brown";
  } else {
    document.querySelector(activePlayer["scoreSpan"]).textContent = activePlayer["score"];    //else score will be same
  }
}


//to set timer for dealer

function sleep(ms) {                                         //The setTimeout() method calls a function after a number of milliseconds.
 return new Promise((resolve) => setTimeout(resolve, ms));   // Promise allows you to associate handlers with an asynchronous action's eventual success value or failure reason. 
} 

//when button stand is clicked 
async function stands() {                                                  //to make a function asynchronous
  blackjackGame["isStand"] = true;                

  while (DEALER["score"] < 16 && blackjackGame["isStand"] === true) {      //while loop  runs infinetly if the condition is true else the loop breaks
    let card = randomCard();                                               //dealer's card is chosen
    showCard(card, DEALER);
    updateScore(card, DEALER);
    showScore(DEALER);
    await sleep(700);                                                       //Await expressions make promise-returning functions behave as though they're synchronous by suspending execution until the returned promise is fulfilled or rejected.
  }
  // Automate such that it shows cards until score > 15
  blackjackGame["turnsOver"] = true;
  showResult(checkWinner());
}
// find winner

function checkWinner() {                                  //winner is declared since let has block scope it is used under different conditions

  let winner;

  if (YOU["score"] <= 21) {
    if (YOU["score"] > DEALER["score"] || DEALER["score"] > 21) {  //|| stands for OR
      blackjackGame["Player"]++;
      winner = YOU;                                                //player wins
    } else if (YOU["score"] < DEALER["score"]) {
      blackjackGame["Dealer"]++;
      winner = DEALER;                                             //dealer wins
    } else if (YOU["score"] === DEALER["score"]) {
      blackjackGame["Tie"]++;                                       //tie
    }
  } else if (YOU["score"] > 21 && DEALER["score"] <= 21) {          //&& reprsents and
    blackjackGame["Dealer"]++;
    winner = DEALER;
  } else if (YOU["score"] > 21 && DEALER["score"] > 21) {
    blackjackGame["Tie"]++;
  }

  return winner;
}

 //result of the whole game

function showResult(winner) {
  
  let result;  //result is declared

  if (blackjackGame["turnsOver"] === true) {                                  
    if (winner === YOU) {
      document.querySelector("#wins").textContent = blackjackGame["Player"];  //score is added to player
      result = "You won..!";

    } else if (winner === DEALER) {
      document.querySelector("#losses").textContent = blackjackGame["Dealer"]; //score added to dealer
      result = "You lose..!";

    } else {
      document.querySelector("#draws").textContent = blackjackGame["Tie"];   //tie
      result = "Its a Tie..!";
    
    }
    document.querySelector("#heading").textContent = result;   //lets play is changed in to result
  }      
}

 // function to start next set of the game 
 
function deals() {                                           
  let yourImages = document                          
      .querySelector("#Player-box")                              //all the div inside the player box is removed
      .querySelectorAll("div");
      for (var i = 0; i < yourImages.length; i++) {
        yourImages[i].remove();                                  
       }
      YOU["score"] = 0;                                          //score changed back to 0
      document.querySelector("#Player-Result").textContent = 0;        //content changed back to 0
      document.querySelector("#Player-Result").style.color = "#ffffff"; //color changed back to white
      

  if (blackjackGame["turnsOver"] === true) {
    blackjackGame["isStand"] = false;

    let dealerImages = document
      .querySelector("#Dealer-box")
      .querySelectorAll("div");

     for (var i = 0; i < dealerImages.length; i++) {
      dealerImages[i].remove();
     }
    DEALER["score"] = 0;
    document.querySelector("#Dealer-Result").textContent = 0;
    document.querySelector("#Dealer-Result").style.color = "#ffffff";
    document.querySelector("#heading").textContent = "Let's play!";           //heading is changed back to lets play
    blackjackGame["turnsOver"] = false;
  }
}

//alerting to rotate device

let alertOnce = false;
let limitFunc = function () { //alerts to rotate device when opened in smaller devices

  if (window.innerWidth <= 1000 && alertOnce === false) {
    alert("Rotate Your Device");
    alertOnce = true;
  }
};

window.addEventListener("resize", limitFunc); //it occurs when window size is resized
window.addEventListener("onload", limitFunc); //The onload event can be used to check the visitor's browser type and browser version, and load the proper version of the web page based on the information
