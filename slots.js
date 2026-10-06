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


/*
 * Page for each individual winning symbol.
 */
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


/*
 * Page used when multiple DIFFERENT symbols
 * win during the same spin.
 */
const MULTIPLE_WIN_PAGE = 'multiple-fruits.html';


/**
 * Minimum spin time in seconds.
 */
const BASE_SPINNING_DURATION = 2.0;


/**
 * Additional duration for each column.
 */
const COLUMN_SPINNING_DURATION = 0.3;


let cols;


/*
 * Stores the final 3 symbols for every reel.
 */
let currentResults = [];


window.addEventListener('DOMContentLoaded', function () {

    cols = document.querySelectorAll('.col');

    setInitialItems();

});


/**
 * Fill the reels with random symbols.
 */
function setInitialItems() {

    const baseItemAmount = 40;

    for (let i = 0; i < cols.length; ++i) {

        const col = cols[i];

        const amountOfItems =
            baseItemAmount + (i * 3);

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


            /*
             * Save the first three items.
             */
            if (x < 3) {
                firstThreeElms += item;
            }
        }


        /*
         * Put the reel together.
         */
        col.innerHTML =
            elms + firstThreeElms;
    }
}


/**
 * Called when the SPIN button is pressed.
 */
function spin(elem) {

    let duration =
        BASE_SPINNING_DURATION +
        randomDuration();


    /*
     * Give each reel a slightly different
     * spinning duration.
     */
    for (let col of cols) {

        duration +=
            COLUMN_SPINNING_DURATION +
            randomDuration();


        col.style.animationDuration =
            duration + "s";
    }


    /*
     * Disable the spin button.
     */
    elem.setAttribute(
        'disabled',
        true
    );


    /*
     * Remove previous winning highlights.
     */
    clearWinningHighlights();


    /*
     * Remove an old popup if one exists.
     */
    const oldPopup =
        document.querySelector('.win-message');

    if (oldPopup) {
        oldPopup.remove();
    }


    /*
     * Start the spinning animation.
     */
    document
        .getElementById('container')
        .classList.add('spinning');


    /*
     * Generate the results while
     * the reels are spinning.
     */
    window.setTimeout(
        setResult,
        BASE_SPINNING_DURATION *
        1000 / 2
    );


    /*
     * Wait until the reels stop.
     */
    window.setTimeout(function () {

        document
            .getElementById('container')
            .classList.remove('spinning');


        /*
         * Re-enable the spin button.
         */
        elem.removeAttribute(
            'disabled'
        );


        /*
         * Find ALL winning combinations.
         */
        const winningLines =
            checkForMatches();


        /*
         * If there are winners...
         */
        if (winningLines.length > 0) {

            /*
             * Make ALL winning symbols
             * bounce together.
             */
const totalBounceTime =
    highlightWinningSymbols(
        winningLines
    );


setTimeout(function () {

    showWinMessage(
        winningLines
    );

}, totalBounceTime);

        }

    }.bind(elem), duration * 1000);
}


/**
 * Generate the final result for every reel.
 */
function setResult() {

    currentResults = [];


    for (let col of cols) {

        /*
         * Generate three symbols.
         */
        const results = [

            getRandomIcon(),

            getRandomIcon(),

            getRandomIcon()

        ];


        /*
         * Save the results.
         */
        currentResults.push(results);


        /*
         * Find all images in this reel.
         */
        const icons =
            col.querySelectorAll('.icon img');


        /*
         * Put the results at the beginning
         * and end of the reel.
         */
        for (let x = 0; x < 3; x++) {

            icons[x].setAttribute(
                'src',
                'items/' +
                results[x] +
                '.png'
            );


            icons[
                icons.length - 3 + x
            ].setAttribute(
                'src',
                'items/' +
                results[x] +
                '.png'
            );
        }
    }
}


/**
 * Find ALL groups of three.
 *
 * Returns an array instead of just
 * returning the first match.
 */
function checkForMatches() {

    const width =
        currentResults.length;

    const height = 3;


    const winningLines = [];


    if (width === 0) {
        return winningLines;
    }


    /*
     * Check every position.
     */
    for (
        let col = 0;
        col < width;
        col++
    ) {

        for (
            let row = 0;
            row < height;
            row++
        ) {

            const symbol =
                currentResults[col][row];


            /*
             * ==================================
             * HORIZONTAL
             * ==================================
             */
            if (
                col + 2 < width &&

                currentResults[col + 1][row]
                    === symbol &&

                currentResults[col + 2][row]
                    === symbol
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


            /*
             * ==================================
             * VERTICAL
             * ==================================
             */
            if (
                row + 2 < height &&

                currentResults[col][row + 1]
                    === symbol &&

                currentResults[col][row + 2]
                    === symbol
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


            /*
             * ==================================
             * DIAGONAL DOWN
             * ==================================
             */
            if (
                col + 2 < width &&

                row + 2 < height &&

                currentResults[col + 1][row + 1]
                    === symbol &&

                currentResults[col + 2][row + 2]
                    === symbol
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


            /*
             * ==================================
             * DIAGONAL UP
             * ==================================
             */
            if (
                col + 2 < width &&

                row - 2 >= 0 &&

                currentResults[col + 1][row - 1]
                    === symbol &&

                currentResults[col + 2][row - 2]
                    === symbol
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


    /*
     * Remove duplicate winning lines.
     */
    return removeDuplicateWins(
        winningLines
    );
}


/**
 * Remove duplicate winning combinations.
 */
function removeDuplicateWins(lines) {

    const unique = [];

    const seen = new Set();


    for (const line of lines) {

        const key =
            line.type +
            '-' +
            line.symbol +
            '-' +
            JSON.stringify(
                line.positions
            );


        if (!seen.has(key)) {

            seen.add(key);

            unique.push(line);
        }
    }


    return unique;
}


/**
 * Highlight ALL winning symbols
 * and make them bounce one at a time ONCE.
 */
function highlightWinningSymbols(winningLines) {

    /*
     * Remove previous highlights.
     */
    clearWinningHighlights();


    /*
     * Store every unique winning icon.
     *
     * Set prevents the same icon from being
     * animated twice if it belongs to multiple
     * winning lines.
     */
    const winningIcons = [];

    const seenIcons = new Set();


    /*
     * Find every winning position.
     */
    for (const winningLine of winningLines) {

        for (const [
            colIndex,
            rowIndex
        ] of winningLine.positions) {

            const col =
                cols[colIndex];


            const icons =
                col.querySelectorAll('.icon');


            /*
             * The final three icons are the
             * actual result symbols.
             */
            const winningIcon =
                icons[
                    icons.length -
                    3 +
                    rowIndex
                ];


            /*
             * Only add each actual icon once.
             */
            if (
                winningIcon &&
                !seenIcons.has(winningIcon)
            ) {

                seenIcons.add(winningIcon);

                winningIcons.push(
                    winningIcon
                );
            }
        }
    }


    /*
     * Animate the winning symbols
     * ONE AT A TIME.
     */
    winningIcons.forEach(function (icon) {

        icon.classList.add(
            'winning'
        );
    });


    /*
     * Start the sequential animation.
     */
    let delay = 0;

    const bounceTime = 300;
    const gapTime = 450;


    winningIcons.forEach(function (icon) {

        setTimeout(function () {

            /*
             * Start this symbol's bounce.
             */
            icon.classList.remove(
                'winning-bounce'
            );

            /*
             * Force animation restart.
             */
            void icon.offsetWidth;

            icon.classList.add(
                'winning-bounce'
            );

        }, delay);


        /*
         * Wait for this symbol to finish
         * before starting the next one.
         */
        delay += bounceTime + gapTime;
    });


    /*
     * Return the total animation time
     * so the popup can wait for everything.
     */
    return delay;
}



/**
 * Remove all winning highlights.
 */
function clearWinningHighlights() {

    document
        .querySelectorAll(
            '.icon.winning'
        )
        .forEach(function (icon) {

            icon.classList.remove(
                'winning'
            );

            icon.classList.remove(
                'winning-bounce'
            );
        });
}


/**
 * Get the different symbols that won.
 */
function getWinningSymbols(
    winningLines
) {

    const symbols = [];


    for (const line
        of winningLines) {

        if (
            !symbols.includes(
                line.symbol
            )
        ) {

            symbols.push(
                line.symbol
            );
        }
    }


    return symbols;
}


/**
 * Determine which page to use.
 */
function getWinningPage(
    winningLines
) {

    /*
     * Get every unique winning symbol.
     */
    const winningSymbols =
        getWinningSymbols(
            winningLines
        );


    /*
     * If MORE THAN ONE DIFFERENT
     * symbol won, use the special page.
     */
    if (winningSymbols.length > 1) {

        return MULTIPLE_WIN_PAGE;
    }


    /*
     * Otherwise use the page belonging
     * to the individual symbol.
     */
    const symbol =
        winningSymbols[0];


    return WIN_PAGES[symbol]
        || 'default.html';
}


/**
 * Show the win popup.
 */
function showWinMessage(
    winningLines
) {

    /*
     * Remove an existing popup.
     */
    const oldPopup =
        document.querySelector(
            '.win-message'
        );


    if (oldPopup) {
        oldPopup.remove();
    }


    /*
     * Get all different winning symbols.
     */
    const winningSymbols =
        getWinningSymbols(
            winningLines
        );


    /*
     * Determine destination page.
     */
    const destination =
        getWinningPage(
            winningLines
        );


    /*
     * Create popup.
     */
    const message =
        document.createElement(
            'div'
        );


    message.className =
        'win-message';


    /*
     * Display the winning symbols.
     */
    const symbolText =
        winningSymbols
            .map(function (symbol) {

                return symbol;

            })
            .join(', ');


    /*
     * Change the message depending
     * on whether there was one or
     * multiple different winners.
     */
    let title;

    let description;


    if (winningSymbols.length > 1) {

        title =
            '🎉 MULTIPLE WIN! 🎉';

        description =
            'You matched multiple different symbols!';

    } else {

        title =
            'JACKPOT';

        description =
            'You matched at least 3 ' +
            winningSymbols[0] +
            ' symbols!';
    }


    message.innerHTML = `

        <div class="win-box">

            <h2>
                ${title}
            </h2>

            <p>
                ${description}
            </p>

            <p>
                <strong>
                    ${symbolText}
                </strong>
            </p>

            <button class="continue-win">
                YOUR PRIZE
            </button>

            <button class="close-win">
                CLOSE
            </button>

        </div>
    `;


    document.body.appendChild(
        message
    );


    /*
     * CONTINUE button.
     */
    const continueButton =
        message.querySelector(
            '.continue-win'
        );


    continueButton.addEventListener(
        'click',
        function () {

            window.location.href =
                destination;
        }
    );


    /*
     * CLOSE button.
     */
    const closeButton =
        message.querySelector(
            '.close-win'
        );


    closeButton.addEventListener(
        'click',
        function () {

            message.remove();

            clearWinningHighlights();
        }
    );
}


/**
 * Get a random symbol.
 */
function getRandomIcon() {

    return ICONS[
        Math.floor(
            Math.random() *
            ICONS.length
        )
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