const toLightColor = `#ccc9bf`;

export function cardBehindToNextCard(cardIndex, cardsToReview) {
    const cardBehind = document.querySelector('.first.display.card');
    //console.log("card behind is ", cardsToReview.get(cardIndex));
    const frontOfCard = cardsToReview.get(cardIndex).front;
    //set the inner text of card behind to the front of nextCard
    cardBehind.innerText = frontOfCard;
    cardBehind.style.backgroundColor = toLightColor;
}

export function getRightOfLastCard(displayCards) {
    let rightOfLastCard;
    if (displayCards.length > 2) {

        rightOfLastCard = displayCards[displayCards.length-2].getBoundingClientRect().right;
    }
    else {
        rightOfLastCard = displayCards[displayCards.length-1].getBoundingClientRect().right;

    }
    return window.innerWidth - rightOfLastCard;
}