
const SPRITE_DEFAULT = 'images/sprite_0.png';


const SPRITE_GROUPS = {
    spin: [
        'sprite_spin',
        'sprite_spin2',
        'sprite_spin3',
        'sprite_spin4',
        'sprite_spin5'
    ],

    loss: [
        'sprite_no_win',
        'sprite_no_win2',
        'sprite_no_win3',
        'sprite_no_win4',
        'sprite_no_win5',
        'sprite_no_win6',
        'sprite_no_win7',
        'sprite_no_win8'
    ],

    win: [
        'sprite_win',
        'sprite_win2',
        'sprite_win3'
    ],

    fourAcross: [
        'sprite_four_across',
        'sprite_four_across2',
        'sprite_four_across3'
    ],

    fiveAcross: [
        'sprite_five_across',
        'sprite_five_across2',
        'sprite_five_across3'
    ],

    fullScreen: [
        'sprite_full_screen'

    ],

    multipleWin: [
        'sprite_multiple_win',
        'sprite_multiple_win2',
        'sprite_multiple_win3'
    ]
};


function getRandomSprite(group) {
    const sprites = SPRITE_GROUPS[group];

    return sprites[Math.floor(Math.random() * sprites.length)];
}

let spriteResetTimer;

function changeSprite(imageName, duration = 2000) {
    const sprite = document.getElementById('slotSprite');

    if (!sprite) return;

    clearTimeout(spriteResetTimer);

    sprite.src = `images/${imageName}.png`;

    spriteResetTimer = setTimeout(() => {
        sprite.src = SPRITE_DEFAULT;
    }, duration);
}

const introSprites = [
    'sprite_intro1',
    'sprite_intro2',
    'sprite_intro3'
];

const introMessages = [
    'Welcome to my Slot Machine! Extra content is hidden in these Reels...',
    'Match at least 3 symbols any direction to win special cards.',
    'Alright, thats pretty much it. Click SPIN to start your first round. Good luck!'
];

let introIndex = 0;
let introActive = false;

function playSpriteIntro() {
    const sprite = document.getElementById('slotSprite');
    const text = document.getElementById('introText');

    if (!sprite || !text) return;

    introIndex = 0;
    introActive = true;

    sprite.src = `images/${introSprites[introIndex]}.png`;
    text.textContent = introMessages[introIndex];

    document.addEventListener('click', advanceSpriteIntro);
}

function advanceSpriteIntro(event) {
    if (!introActive) return;

    // Let the SPIN button work normally.
    if (event.target.closest('.start-button')) return;

    const sprite = document.getElementById('slotSprite');
    const text = document.getElementById('introText');

    if (!sprite || !text) return;

    introIndex++;

    if (introIndex >= introSprites.length) {
        stopSpriteIntro();

        sprite.src = SPRITE_DEFAULT;
        text.textContent = 'Ready to play! Click SPIN to begin.';
        return;
    }

    sprite.src = `images/${introSprites[introIndex]}.png`;
    text.textContent = introMessages[introIndex];
}

function stopSpriteIntro() {
    introActive = false;
    document.removeEventListener('click', advanceSpriteIntro);
}

document.addEventListener('DOMContentLoaded', playSpriteIntro);


const ICONS = [
    'apple',
    'apricot',
    'banana',
    'big_win',
    'cherry',
    'grapes',
    'lemon',
    'lucky_seven',
    'orange',
    'pear',
    'strawberry',
    'watermelon'
];

const WIN_PAGES = {
    apple: 'apple.html',
    apricot: 'apricot.html',
    banana: 'banana.html',
    big_win: 'big-win.html',
    cherry: 'cherry.html',
    grapes: 'grapes.html',
    lemon: 'lemon.html',
    lucky_seven: 'lucky-seven.html',
    orange: 'orange.html',
    pear: 'pear.html',
    strawberry: 'strawberry.html',
    watermelon: 'watermelon.html'
};

const MULTIPLE_WIN_PAGE = 'multiple-fruits.html';

const BASE_SPINNING_DURATION = 2.0;
const COLUMN_SPINNING_DURATION = 0.3;

let cols;
let currentResults = [];

window.addEventListener('DOMContentLoaded', function () {
    cols = document.querySelectorAll('.col');
    setInitialItems();
});

function setInitialItems() {
    const baseItemAmount = 40;

    for (let i = 0; i < cols.length; ++i) {
        const col = cols[i];
        const amountOfItems = baseItemAmount + (i * 3);

        let elms = '';
        let firstThreeElms = '';

        for (let x = 0; x < amountOfItems; x++) {
            const icon = getRandomIcon();

            const item =
                '<div class="icon" data-item="' +
                icon +
                '">' +
                '<img src="items/' +
                icon +
                '.png">' +
                '</div>';

            elms += item;

            if (x < 3) {
                firstThreeElms += item;
            }
        }

        col.innerHTML = elms + firstThreeElms;
    }
}

function spin(elem) {

// Hide tutorial messages when SPIN is clicked
const introText = document.getElementById('introText');
const continueText = document.getElementById('continueText');

introText?.classList.add('hidden');
continueText?.classList.add('hidden');

// Stop the intro tutorial

    stopSpriteIntro();
    clearTimeout(spriteResetTimer);

    let duration = BASE_SPINNING_DURATION + randomDuration();

    for (let col of cols) {
        duration += COLUMN_SPINNING_DURATION + randomDuration();
        col.style.animationDuration = duration + "s";
    }

changeSprite(getRandomSprite('spin'), duration * 500 + 500);

    elem.setAttribute('disabled', true);

    clearWinningHighlights();

    const oldPopup = document.querySelector('.win-message');

    if (oldPopup) {
        oldPopup.remove();
    }

    document.getElementById('container').classList.add('spinning');

    window.setTimeout(
        setResult,
        BASE_SPINNING_DURATION * 1000 / 2
    );

    window.setTimeout(function () {
        document.getElementById('container').classList.remove('spinning');

        elem.removeAttribute('disabled');

        const winningLines = checkForMatches();

        if (winningLines.length === 0) {
            // No winning combinations.
changeSprite(getRandomSprite('loss'), 2500);

        } else if (winningLines.some(line => line.type === 'full-screen')) {
            // Every visible symbol matches.
changeSprite(getRandomSprite('fullScreen'), 5000);

} else if (winningLines.some(line => line.type === 'five-across')) {
    changeSprite(getRandomSprite('fiveAcross'), 4000);

} else if (winningLines.some(line => line.type === 'four-across')) {
    changeSprite(getRandomSprite('fourAcross'), 3500);

} else if (winningLines.length >= 2) {
    changeSprite(getRandomSprite('multipleWin'), 3500);

        } else {
            // One regular winning pattern.
changeSprite(getRandomSprite('win'), 3000);
        }

        if (winningLines.length > 0) {
            const totalBounceTime = highlightWinningSymbols(winningLines);

            setTimeout(function () {
                showWinMessage(winningLines);
            }, totalBounceTime);
        }

    }.bind(elem), duration * 1000);
}

function applyActiveMultiplierCombo(results) {
    const active = window.activeMultipliers || {};
    const randomSymbol = () =>
        ICONS[Math.floor(Math.random() * ICONS.length)];

    // Full-screen jackpot: 0.5% chance per spin when active.
    if (
        active["full-screen.html"] &&
        Math.random() < 0.005
    ) {
        const symbol = randomSymbol();

        for (let col = 0; col < 5; col++) {
            for (let row = 0; row < 3; row++) {
                results[col][row] = symbol;
            }
        }

        return "full-screen";
    }

    // Five across: 2.5% chance per spin when active.
    if (
        active["five-across.html"] &&
        Math.random() < 0.025
    ) {
        const symbol = randomSymbol();
        const row = Math.floor(Math.random() * 3);

        for (let col = 0; col < 5; col++) {
            results[col][row] = symbol;
        }

        return "five-across";
    }

    // Four across: 5% chance per spin when active.
    if (
        active["four-across.html"] &&
        Math.random() < 0.05
    ) {
        const symbol = randomSymbol();
        const row = Math.floor(Math.random() * 3);

        for (let col = 0; col < 4; col++) {
            results[col][row] = symbol;
        }

        return "four-across";
    }

    // Multiple fruits: 10% chance per spin when active.
    if (
        active["multiple-fruits.html"] &&
        Math.random() < 0.10
    ) {
        const firstSymbol = randomSymbol();

        let secondSymbol = randomSymbol();

        while (secondSymbol === firstSymbol) {
            secondSymbol = randomSymbol();
        }

        // Two separate horizontal matches on different rows.
        for (let col = 0; col < 3; col++) {
            results[col][0] = firstSymbol;
        }

        for (let col = 2; col < 5; col++) {
            results[col][1] = secondSymbol;
        }

        return "multiple-fruits";
    }

    return null;
}

function setResult() {
    currentResults = [];

    for (let col = 0; col < cols.length; col++) {
        currentResults.push([
            getRandomIcon(),
            getRandomIcon(),
            getRandomIcon()
        ]);
    }

    // Apply an active special combo, if triggered.
    const forcedCombo = applyActiveMultiplierCombo(currentResults);

    // Update the visible symbols to match the final results.
    for (let colIndex = 0; colIndex < cols.length; colIndex++) {
        const icons = cols[colIndex].querySelectorAll(".icon img");

        for (let row = 0; row < 3; row++) {
            const src = "items/" + currentResults[colIndex][row] + ".png";

            if (icons[row]) {
                icons[row].src = src;
            }

            const duplicate = icons[icons.length - 3 + row];

            if (duplicate) {
                duplicate.src = src;
            }
        }
    }

    return forcedCombo;
}

function checkForMatches() {
    const width = currentResults.length;
    const height = 3;
    const winningLines = [];

    if (width === 0) {
        return winningLines;
    }

    for (let col = 0; col < width; col++) {
        for (let row = 0; row < height; row++) {
            const symbol = currentResults[col][row];

            // HORIZONTAL
            if (
                col + 2 < width &&
                currentResults[col + 1][row] === symbol &&
                currentResults[col + 2][row] === symbol
            ) {
                winningLines.push({
                    type: 'horizontal',
                    symbol: symbol,
                    positions: [
                        [col, row],
                        [col + 1, row],
                        [col + 2, row]
                    ]
                });
            }

            // VERTICAL
            if (
                row + 2 < height &&
                currentResults[col][row + 1] === symbol &&
                currentResults[col][row + 2] === symbol
            ) {
                winningLines.push({
                    type: 'vertical',
                    symbol: symbol,
                    positions: [
                        [col, row],
                        [col, row + 1],
                        [col, row + 2]
                    ]
                });
            }

            // DIAGONAL DOWN
            if (
                col + 2 < width &&
                row + 2 < height &&
                currentResults[col + 1][row + 1] === symbol &&
                currentResults[col + 2][row + 2] === symbol
            ) {
                winningLines.push({
                    type: 'diagonal',
                    symbol: symbol,
                    positions: [
                        [col, row],
                        [col + 1, row + 1],
                        [col + 2, row + 2]
                    ]
                });
            }

            // DIAGONAL UP
            if (
                col + 2 < width &&
                row - 2 >= 0 &&
                currentResults[col + 1][row - 1] === symbol &&
                currentResults[col + 2][row - 2] === symbol
            ) {
                winningLines.push({
                    type: 'diagonal',
                    symbol: symbol,
                    positions: [
                        [col, row],
                        [col + 1, row - 1],
                        [col + 2, row - 2]
                    ]
                });
            }
        }
    }

    // FIVE ACROSS
    if (width >= 5) {
        for (let row = 0; row < height; row++) {
            const symbol = currentResults[0][row];

            const isFiveAcross = currentResults
                .slice(0, 5)
                .every(col => col[row] === symbol);

            if (isFiveAcross) {
                winningLines.push({
                    type: 'five-across',
                    symbol: symbol,
                    positions: [
                        [0, row],
                        [1, row],
                        [2, row],
                        [3, row],
                        [4, row]
                    ]
                });
            }
        }
    }

    // FOUR ACROSS
if (width >= 4) {
    for (let row = 0; row < height; row++) {
        const symbol = currentResults[0][row];

        const isFourAcross = currentResults
            .slice(0, 4)
            .every(col => col[row] === symbol);

        if (isFourAcross) {
            winningLines.push({
                type: 'four-across',
                symbol: symbol,
                positions: [
                    [0, row],
                    [1, row],
                    [2, row],
                    [3, row]
                ]
            });
        }
    }
}

    // FULL-SCREEN JACKPOT
    if (width === 5) {
        const symbol = currentResults[0][0];

        const isFullScreen = currentResults.every(
            col => col.every(item => item === symbol)
        );

        if (isFullScreen) {
            const positions = [];

            for (let col = 0; col < width; col++) {
                for (let row = 0; row < height; row++) {
                    positions.push([col, row]);
                }
            }

            winningLines.push({
                type: 'full-screen',
                symbol: symbol,
                positions: positions
            });
        }
    }

    const uniqueWins = removeDuplicateWins(winningLines);

    // Full-screen jackpot overrides every other win.
    if (uniqueWins.some(line => line.type === 'full-screen')) {
        return uniqueWins.filter(line => line.type === 'full-screen');
    }

// Five across overrides smaller patterns.
if (uniqueWins.some(line => line.type === 'five-across')) {
    return uniqueWins.filter(line => line.type === 'five-across');
}

// Four across overrides regular patterns.
if (uniqueWins.some(line => line.type === 'four-across')) {
    return uniqueWins.filter(line => line.type === 'four-across');
}

// Otherwise, return the normal wins.
return uniqueWins;
}

function removeDuplicateWins(lines) {
    const unique = [];
    const seen = new Set();

    for (const line of lines) {
        const key =
            line.type +
            '-' +
            line.symbol +
            '-' +
            JSON.stringify(line.positions);

        if (!seen.has(key)) {
            seen.add(key);
            unique.push(line);
        }
    }

    return unique;
}

function highlightWinningSymbols(winningLines) {
    clearWinningHighlights();

    const winningIcons = [];
    const seenIcons = new Set();

    for (const winningLine of winningLines) {
        for (const [colIndex, rowIndex] of winningLine.positions) {
            const col = cols[colIndex];
            const icons = col.querySelectorAll('.icon');

            const winningIcon = icons[
                icons.length - 3 + rowIndex
            ];

            if (winningIcon && !seenIcons.has(winningIcon)) {
                seenIcons.add(winningIcon);
                winningIcons.push(winningIcon);
            }
        }
    }

    winningIcons.forEach(function (icon) {
        icon.classList.add('winning');
    });

    let delay = 0;

    const bounceTime = 300;
    const gapTime = 450;

    winningIcons.forEach(function (icon) {
        setTimeout(function () {
            icon.classList.remove('winning-bounce');

            void icon.offsetWidth;

            icon.classList.add('winning-bounce');
        }, delay);

        delay += bounceTime + gapTime;
    });

    return delay;
}

function clearWinningHighlights() {
    document
        .querySelectorAll('.icon.winning')
        .forEach(function (icon) {
            icon.classList.remove('winning');
            icon.classList.remove('winning-bounce');
        });
}

function getWinningSymbols(winningLines) {
    const symbols = [];

    for (const line of winningLines) {
        if (!symbols.includes(line.symbol)) {
            symbols.push(line.symbol);
        }
    }

    return symbols;
}

function getWinningPage(winningLines) {
    // Full-screen jackpot has the highest priority.
    if (winningLines.some(line => line.type === 'full-screen')) {
        return 'full-screen.html';
    }

    // Five-across jackpot takes priority over smaller wins.
    if (winningLines.some(line => line.type === 'five-across')) {
        return 'five-across.html';
    }

    if (winningLines.some(line => line.type === 'four-across')) {
    return 'four-across.html';
    }

    // Count separate three-symbol winning patterns.
    if (winningLines.length >= 2) {
        return MULTIPLE_WIN_PAGE;
    }

    // One winning pattern: use its symbol's page.
    const symbol = winningLines[0]?.symbol;

    return WIN_PAGES[symbol] || 'default.html';
}

function showWinMessage(winningLines) {
    const oldPopup = document.querySelector('.win-message');

    if (oldPopup) {
        oldPopup.remove();
    }

    const winningSymbols = getWinningSymbols(winningLines);
    const destination = getWinningPage(winningLines);

    // Save prizes to the signed-in player's account.
if (typeof window.saveUnlockedPage === "function") {
    window.saveUnlockedPage(destination).catch(console.error);
}

    const message = document.createElement('div');
    message.className = 'win-message';

    const symbolText = winningSymbols
        .map(function (symbol) {
            return symbol;
        })
        .join(', ');

    // Change the message depending on the type of win.
    const hasFullScreen = winningLines.some(
        line => line.type === 'full-screen'
    );

    const hasFiveAcross = winningLines.some(
        line => line.type === 'five-across'
    );

    const hasFourAcross = winningLines.some(
    line => line.type === "four-across"
);

    let title;
    let description;

    if (hasFullScreen) {
        title = '🌟 FULL SCREEN JACKPOT! 🌟';
        description = 'Every symbol matches!';

} else if (hasFiveAcross) {
    title = '🎰 FIVE ACROSS JACKPOT! 🎰';
    description = 'You matched all five reels!';

} else if (hasFourAcross) {
    title = '🎰 FOUR ACROSS! 🎰';
    description = 'You matched four symbols across!';

} else if (winningLines.length >= 2) {
        title = '🎉 MULTIPLE WIN! 🎉';
        description = 'You matched multiple winning patterns!';

    } else {
        title = 'JACKPOT';
        description =
            'You matched at least 3 ' +
            winningSymbols[0] +
            ' symbols!';
    }

    message.innerHTML = `
        <div class="win-box">
            <h2>${title}</h2>
            <p>${description}</p>
            <p><strong>${symbolText}</strong></p>
            <button class="continue-win">YOUR PRIZE</button>
            <button class="close-win">CLOSE</button>
        </div>
    `;

    document.body.appendChild(message);

    const continueButton = message.querySelector('.continue-win');

    continueButton.addEventListener('click', function () {
        window.location.href = destination;
    });

    const closeButton = message.querySelector('.close-win');

    closeButton.addEventListener('click', function () {
        message.remove();
        clearWinningHighlights();
    });
}

function getRandomIcon() {
    const weightedIcons = [];

    ICONS.forEach(symbol => {
        const page = WIN_PAGES[symbol];
        const isActive = window.activeMultipliers?.[page] === true;
        const weight = isActive ? 3 : 1;

        for (let i = 0; i < weight; i++) {
            weightedIcons.push(symbol);
        }
    });

    return weightedIcons[
        Math.floor(Math.random() * weightedIcons.length)
    ];
}

function randomDuration() {
    const roll = Math.random();

    // 75% of spins: normal variation
    if (roll < 0.75) {
        return Math.random() * 0.4 - 0.2;
    }

    // 20% of spins: noticeably longer
    if (roll < 0.95) {
        return Math.random() * 0.8 + 0.2;
    }

    // 5% of spins: very long
    return Math.random() * 1.2 + 0.8;
}