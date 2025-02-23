const maxDisplayedCards = 20;
let cardWidth = 200;
let cardHeight = 200;

export function renderDisplayCards(cardsToReview) {
    const cardContainer = document.getElementById("card-stack");
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.firstChild);
    }
    //calculate how many extra cards to display
    let displayedExtraCards = 0;
    if (cardsToReview.size > maxDisplayedCards) {
        displayedExtraCards = maxDisplayedCards-1;
    }
    else {
        displayedExtraCards = cardsToReview.size-1;
    }

    cardWidth = document.querySelector('.card').getBoundingClientRect().width;
    cardHeight = document.querySelector('.card').getBoundingClientRect().height;
    for (let i = 0; i <= displayedExtraCards-1; i++) {
        const displayCard = document.createElement('div');

        if (i === 0) {
            displayCard.setAttribute('class', `first display card`);
        }
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