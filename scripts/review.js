//import {cards} from '../scripts/index.js';
const storedCards = sessionStorage.getItem("globalCards");
const cardsToReview = storedCards ? JSON.parse(storedCards) : [];

const nextBtn = document.getElementById('next-btn');
//const cardsToReview = [...cards];

let currentCardIndex = 0;
let flipped = false;

const maxDisplayedCards = 20;
let cardWidth = 200;
let cardHeight = 200;

const toDarkColor = '#629161';
const toLightColor = `#ccc9bf`;

//LEARNED SIMPLE BACKEND LEZZ GOOO!!!

const flipCard = (id) => {
    flipped = true;
    const cardBack = document.querySelector('.first.card').querySelector('.card-back');
    cardBack.style.display = (cardBack.style.display === 'none') ? 'block' : 'none';
}

const renderCards = (front, back, id) => {
    flipped = false;
    currentCardIndex = id;
    //console.log("rendercardID", currentCardIndex);
    const reviewCardContainer = document.getElementById('card-to-review');
    const cardElement = document.createElement('div');

    //setup the first card (the card that is being reviewed)
    cardElement.setAttribute('class', 'first card');
    cardElement.id = id;
    cardElement.style.zIndex = 21;
    cardElement.addEventListener('click', () => flipCard(id));
    cardElement.innerHTML = `
        <div class="card-front">${front}</div>
        <div class="card-back" style="display: none;">${back}</div>`;
    //replace the first card if it already exists
    // otherwise add the first card
    if (reviewCardContainer.firstChild) {
        reviewCardContainer.replaceChild(cardElement, reviewCardContainer.firstChild);
    }
    else {
        reviewCardContainer.appendChild(cardElement);
    }
    if (cardsToReview.length === 1) {
        console.log("canceled");
        return;
    }

    renderDisplayCards();
}

const renderDisplayCards = () => {
    const cardContainer = document.getElementById("card-stack");
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }
    //calculate how many extra cards to display
    let displayedExtraCards = 0;
    if (cardsToReview.length > maxDisplayedCards) {
        displayedExtraCards = maxDisplayedCards-1;
    }
    else {
        displayedExtraCards = cardsToReview.length-1;
    }

    cardWidth = document.querySelector('.card').getBoundingClientRect().width;
    cardHeight = document.querySelector('.card').getBoundingClientRect().height;
    for (let i = 0; i <= displayedExtraCards-1; i++) {
        const displayCard = document.createElement('div');

        if (i === 0) displayCard.setAttribute('class', `first display card`);
        else displayCard.setAttribute('class', `display card`);
        //displayCard.innerText = 'dCard ' + i;
        displayCard.style.width = `${cardWidth}px`;
        displayCard.style.height =  `${cardHeight}px`;

        //get the 100%
        //subtract that by the width
        const widthFromEnd = `(${100}% - ${cardWidth}px)`;
        //you get that difference and divide it by the amount of cards
        //the result is the amount of spaces for each card
        const cardLeft = `(${widthFromEnd} / ${displayedExtraCards-1})`;
        
        displayCard.style.left = `calc(${i} * ${cardLeft})`;
        displayCard.style.zIndex = `${maxDisplayedCards-i}`;
        if (i === 0) {
            displayCard.style.zIndex = maxDisplayedCards;
        }

        cardContainer.appendChild(displayCard);
    }
}

window.addEventListener("resize", () => 
    renderDisplayCards());

let animated = false;
async function nextCard() {
    animated = false;
    let currentCard = cardsToReview[currentCardIndex];

    if (flipped === false) {
        flipCard(currentCard.id);
        return;
    }

    //change card 1 on display to the next review card
    
    
    if (!animated) {
        if (currentCardIndex === cardsToReview.length-1) {
            currentCardIndex = 0;
        }
        else {
            currentCardIndex++;
        }
        cardBehindToNextCard(currentCardIndex);
        currentCard = cardsToReview[currentCardIndex];
        await animate();
        renderCards(currentCard.front, currentCard.back, currentCard.id);
    }
}

const cardBehindToNextCard = (cardIndex) => {
    const cardBehind = document.querySelector('.first.display.card');
    const frontOfCard = cardsToReview[cardIndex].front;
    //set the inner text of card behind to the front of nextCard
    cardBehind.innerText = frontOfCard;
    cardBehind.style.backgroundColor = toLightColor;
}

const getRightOfLastCard = () => {
    const displayCards =  document.querySelectorAll('.display.card');
    let rightOfLastCard;
    if (displayCards.length > 2) {

        rightOfLastCard = displayCards[displayCards.length-2].getBoundingClientRect().right;
    }
    else {
        rightOfLastCard = displayCards[displayCards.length-1].getBoundingClientRect().right;

    }
    return window.innerWidth - rightOfLastCard;
}


const reviewSection = document.getElementById("review-section");
const animate = () => {
    const increment = 15;
    const displayCardPos = 100/cardsToReview.length;
    const interval = displayCardPos/increment;
    
    const reviewCard = document.querySelector('.first.card');
    const reviewCardWidth = reviewCard.getBoundingClientRect().width;
    const firstDisplayCard = document.querySelector('.first.display.card');
    const displayCard = document.querySelectorAll('.display.card');
    const reviewCardLastLeft = reviewCard.getBoundingClientRect().left;
    const displayCardLastLeft = firstDisplayCard.getBoundingClientRect().left;
    const reviewToDisplayDist = displayCardLastLeft-reviewCardLastLeft;

    const winWidth = window.innerWidth;
    const rightOfLastCard = getRightOfLastCard();
    const theIncrement = (winWidth-reviewCardWidth)/increment;
    return new Promise((resolve) => {

        //move the first card to the end
        let pos1 = reviewCardLastLeft;
        //needed the left of review section to subtract it to most values
        //as setting its css style to relative made the cards left 0 be shifted
        const reviewSectionLeft = reviewSection.getBoundingClientRect().left;
        const goBackWidth = winWidth-rightOfLastCard-reviewSectionLeft;
        let pos2 = pos1;
        
        function step() {
            pos2 = pos1

            //This whole section of code sucks
            if (pos1 < winWidth-(reviewCardWidth*(-0.5))) {
                const reviewCardCurrentLeft = reviewCard.getBoundingClientRect().left
                                            - reviewSectionLeft;
                const displayCardCurrentLeft = firstDisplayCard.getBoundingClientRect().left-displayCardLastLeft;

                console.log(reviewCardCurrentLeft);
                if (pos1 >= goBackWidth) {
                    reviewCard.style.left = `calc(${reviewCardCurrentLeft-(theIncrement*0.5)}px)`;
                }
                else {
                    reviewCard.style.left = `calc(${reviewCardCurrentLeft+theIncrement}px)`;
                } 
                pos1 += theIncrement;

                //moves the display cards
                if (pos1 >= goBackWidth *0.8) { //mulitplying by .8 is not ideal, algorithm I made is just bad
                    reviewCard.style.zIndex = 1;
                    reviewCard.style.backgroundColor = toDarkColor;
                }
                if (firstDisplayCard.getBoundingClientRect().left > reviewCardLastLeft)
                    firstDisplayCard.style.left = `${displayCardCurrentLeft - (reviewToDisplayDist/increment*0.8)}px`;
                
                //this prevents the display cards to go out of the card stack
                if (displayCard.length > 1) {
                    //console.log(displayCard.length, displayCard)
                    if (displayCard[1].getBoundingClientRect().left > displayCardLastLeft) {
                        displayCard.forEach((card) => {
                            if (card !== firstDisplayCard) {
                                
                                card.style.left = `calc(${card.style.left} - ${interval}%)`;
                            }
                            //console.log(card.innerText, card.style.left);
                        });
                    }
                }
                requestAnimationFrame(step);
            }
            else {
                animated = true;
                resolve();
            }
        }
        requestAnimationFrame(step);
    })
}

if (cardsToReview && cardsToReview.length > 0) {

    renderCards(cardsToReview[0].front, cardsToReview[0].back, cardsToReview[0].id);
    nextBtn.addEventListener('click', nextCard);
}
else {
    alert("You have no cards to review");
    nextBtn.addEventListener('click', function() {
        alert("Add cards to your deck to have cards to review");
    });
}

