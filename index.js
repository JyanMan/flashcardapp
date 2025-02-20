const addBtn = document.getElementById('add-card-btn');
const saveBtn = document.getElementById('save-card-btn');
const cardTab = document.querySelector('.card-tab');
const closeTabBtn = document.getElementById('close-nct-btn');
const addCardBtn = document.getElementById('add-new-card-btn');
const newFrontCard = document.querySelector('.new.card-front');
const newBackCard = document.querySelector('.new.card-back');
const cardList = document.getElementById('card-list');
const cardTabBackground = document.querySelector('.card-tab-backg');

const storedCards = sessionStorage.getItem("globalCards");
const cards = (!storedCards) ? [
    {id: 0,
        front: 'frog',
        back: 'amphibian'
    },
    {id: 1,
        front: 'dog',
        back: 'mammal'
    },
    {id: 2, 
        front: 'cat',
        back: 'mammal'
    },
    {id: 3,
        front: 'Watashi',
        back: `It's me`
    },
    {id: 4,
        front: 'Kore',
        back: `This`
    }, 
    {id: 5,
        front: 'Yamete',
        back: `stop`
    },
] : JSON.parse(storedCards);

function saveToGlobal() {
    sessionStorage.setItem("globalCards", JSON.stringify(cards));
}
saveToGlobal();

const getNewCard = (id) => {
    return {
        id: id,
        front: newFrontCard.value,
        back: newBackCard.value
    };
}

function cardIsEmpty(front, back) {
    return front.value === '' || back.value === '';
}

const addCard = () => {
    
    if (newFrontCard.value === '' || newBackCard.value === '') {
        alert('Please fill out both sides of the card');
        return;
    }
    const newCard = getNewCard(cards.length);

    cards.push(newCard);
    console.log(cards);
    renderCards();
    saveToGlobal();
}


const saveCard = (id) => {
    const card = cards[id];
    if (cardIsEmpty(card.front, card.back)) {
        alert('Please fill out both sides of the card');
        return;
    }
    const newCard = getNewCard(id);

    cards[id] = newCard;
    console.log(cards);
    renderCards();
    //closeCardTab();
    saveToGlobal();
}

const removeCard = (id) => {
    console.log(cards);
    console.log("removed");
    if (cards.length === 1) {
        cards.pop();
    }
    console.log("BEFORE", cards);
    cards.splice(id, 1);
    renderCards();
    saveToGlobal();
    console.log("AFTER", cards);
    //rearrange card id
    for (let i = 0; i <= cards.length-1; i++) {
        cards[i].id = i;
    }
    openAddCardTab();
}

const renderCards = () => {
    //cardList.innerHTML = '';

    while (cardList.firstChild) {
        cardList.removeChild(cardList.firstChild);
    }

    if (cards) {

        cards.forEach(card => {
            const cardElement = document.createElement('li');
            cardElement.className = 'card';
            const cardContent = document.createTextNode(card.front + ' - ' + card.back);
            cardElement.appendChild(cardContent);
    
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.onclick = () => removeCard(card.id);
    
            cardElement.addEventListener('click', () => {openEditCardTab(card)});
    
            cardElement.appendChild(deleteBtn);
            cardList.appendChild(cardElement);
        })
    }
}

const closeCardTab = () => {
    cardTab.style.display = 'none';
}

let saveHandler;
const openEditCardTab = (card) => {
    //console.log("opned");
    if (cards.includes(card) === false) {
        return;
    }
    console.log("openedcard tab");
    //console.log(cards);
    cardTab.style.display = 'flex';
    newBackCard.value = card.back;
    newFrontCard.value = card.front;
    addCardBtn.style.display = 'none';
    saveBtn.style.display = 'block';

    if (saveHandler) {
        saveBtn.removeEventListener('click', saveHandler);
    }
    saveHandler = () => saveCard(card.id);
    saveBtn.addEventListener('click', saveHandler);
    resizeCardTab();
}

const openAddCardTab = () =>  {
    cardTab.style.display = 'flex';
    newFrontCard.value = '';
    newBackCard.value = '';
    addCardBtn.style.display = 'block';
    saveBtn.style.display = 'none';
    resizeCardTab();
}

//add draggability of card tab
function dragElement() {
    const moveArea = document.getElementById("move-card-tab");
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    const dragMouseDown = (e) => {
        if (cardTab.style.position !== 'absolute') {
            cardTab.style.position = 'absolute';
        }
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    const elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();

        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        cardTab.style.top = (cardTab.offsetTop - pos2) + "px";
        cardTab.style.left = (cardTab.offsetLeft - pos1) + "px";
        
        if (elementOverElement(moveArea, cardTab.parentElement)) {
            cardTab.style.opacity = '0.5';
        }
        else {
            cardTab.style.opacity = '1';
        }
    }
    const closeDragElement = () => {
        document.onmouseup = null;
        document.onmousemove = null;
        if (elementOverElement(moveArea, cardTab.parentElement)) {
            cardTab.style.position = 'static';
            cardTab.style.left = '0px';
            cardTab.style.top = '0px';
            cardTab.style.opacity = '1';
        }
    }
    if (moveArea) {
        moveArea.onmousedown = dragMouseDown;
    }
}

function elementOverElement(el1, el2) {
    const topRect = el1.getBoundingClientRect();
    const bottomRect = el2.getBoundingClientRect();

    return (
        topRect.left >= bottomRect.left &&
        topRect.right <= bottomRect.right &&
        topRect.top >= bottomRect.top &&
        topRect.bottom <= bottomRect.bottom
    );
}

dragElement();

function resizeCardTab() {
    cardTab.style.width = cardTabBackground.getBoundingClientRect().width+"px";
}

window.addEventListener('resize', resizeCardTab);

if (addCardBtn) {
    
    addCardBtn.addEventListener('click', addCard);
    addBtn.addEventListener('click', openAddCardTab);
    closeTabBtn.addEventListener('click', closeCardTab);
    
    renderCards();
}