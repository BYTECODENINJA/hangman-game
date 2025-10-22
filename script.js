document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const wordDisplay = document.getElementById('word-display');
    const keyboard = document.getElementById('keyboard');
    const remainingGuessesEl = document.getElementById('remaining-guesses');
    const hintsRemainingEl = document.getElementById('hints-remaining');
    const gameMessageEl = document.getElementById('game-message');
    const resetBtn = document.getElementById('reset-btn');
    const hintBtn = document.getElementById('hint-btn');

    // Hangman SVG parts
    const hangmanParts = {
        head: document.getElementById('head'),
        body: document.getElementById('body'),
        leftArm: document.getElementById('left-arm'),
        rightArm: document.getElementById('right-arm'),
        leftLeg: document.getElementById('left-leg'),
        rightLeg: document.getElementById('right-leg'),
        face: document.getElementById('face')
    };

    // Game variables
    let selectedWord = '';
    let correctLetters = [];
    let wrongLetters = [];
    let remainingGuesses = 6;
    let gameOver = false;
    let hintsUsed = 0;
    const maxHints = 2;

    // Categories and words
    const wordCategories = {
        animals: [
            'ELEPHANT', 'GIRAFFE', 'KANGAROO', 'DOLPHIN', 'CHEETAH', 'TIGER', 'ZEBRA', 'PENGUIN', 'RHINOCEROS', 'OCTOPUS', 'LEOPARD', 'GORILLA', 'HIPPOPOTAMUS', 'CROCODILE', 'BUFFALO', 'ANTEATER', 'ARMADILLO', 'BUTTERFLY', 'CHAMELEON', 'COYOTE', 'FLAMINGO', 'HUMMINGBIRD', 'JELLYFISH', 'KOMODO', 'LOBSTER', 'MEERKAT', 'NARWHAL', 'ORANGUTAN', 'PEACOCK', 'QUOKKA', 'RACCOON', 'SCORPION', 'SEAGULL', 'SLOTH', 'STARFISH', 'TURTLE', 'VIPER', 'WALRUS', 'WHALE', 'WOLVERINE', 'YAK', 'AXOLOTL', 'BADGER', 'BEAVER', 'BOBCAT', 'CONDOR', 'FERRET', 'IGUANA', 'MANATEE', 'PLATYPUS'
        ],
        countries: [
            'CANADA', 'BRAZIL', 'FRANCE', 'JAPAN', 'EGYPT',
            'INDIA', 'ITALY', 'MEXICO', 'SPAIN', 'TURKEY',
            'GERMANY', 'CHINA', 'RUSSIA', 'AUSTRALIA', 'NIGERIA',
            'SWEDEN', 'NORWAY', 'POLAND', 'GREECE', 'ISRAEL',
            'FINLAND', 'DENMARK', 'IRELAND', 'PORTUGAL', 'AUSTRIA',
            'BELGIUM', 'HUNGARY', 'CROATIA', 'ICELAND', 'MOROCCO',
            'KENYA', 'GHANA', 'UGANDA', 'ZAMBIA', 'TUNISIA',
            'ARGENTINA', 'CHILE', 'PERU', 'COLOMBIA', 'ECUADOR',
            'THAILAND', 'VIETNAM', 'MALAYSIA', 'SINGAPORE', 'INDONESIA',
            'PHILIPPINES', 'NEWZEALAND', 'SOUTHKOREA', 'UKRAINE', 'ROMANIA'
        ],
        fruits: [
            'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'MANGO',
            'PEACH', 'PEAR', 'PLUM', 'CHERRY', 'LEMON',
            'LIME', 'KIWI', 'PAPAYA', 'GUAVA', 'FIG',
            'DATE', 'APRICOT', 'COCONUT', 'PINEAPPLE', 'WATERMELON',
            'STRAWBERRY', 'RASPBERRY', 'BLUEBERRY', 'BLACKBERRY', 'CRANBERRY',
            'CANTALOUPE', 'HONEYDEW', 'NECTARINE', 'TANGERINE', 'GRAPEFRUIT',
            'POMEGRANATE', 'PASSIONFRUIT', 'STARFRUIT', 'LYCHEE', 'RAMBUTAN',
            'MULBERRY', 'BOYSENBERRY', 'ELDERBERRY', 'GOOSEBERRY', 'KIWIFRUIT',
            'DRAGONFRUIT', 'PERSIMMON', 'QUINCE', 'CARAMBOLA', 'FEIJOA',
            'MANGOSTEEN', 'SALAK', 'JACKFRUIT', 'BREADFRUIT', 'CASHEW'
        ],
        carBrands: [
            'TOYOTA', 'FORD', 'HONDA', 'BMW', 'AUDI',
            'VOLVO', 'NISSAN', 'MAZDA', 'SUBARU', 'LEXUS',
            'JEEP', 'FERRARI', 'LAMBORGHINI', 'PORSCHE', 'MERCEDES',
            'BENTLEY', 'ROLLSROYCE', 'JAGUAR', 'LANDROVER', 'MINI',
            'TESLA', 'CHEVROLET', 'DODGE', 'CHRYSLER', 'CADILLAC',
            'BUICK', 'GMC', 'ACURA', 'INFINITI', 'MITSUBISHI',
            'SUZUKI', 'KIA', 'HYUNDAI', 'GENESIS', 'ALFA',
            'MASERATI', 'FISKER', 'RIVIAN', 'LUCID', 'SAAB',
            'RENAULT', 'PEUGEOT', 'CITROEN', 'FIAT', 'SEAT',
            'SKODA', 'DUCATI', 'LOTUS', 'MCLAREN', 'ASTONMARTIN','KOENIGSEGG'
        ],
        sports: [
            'BASEBALL', 'BASKETBALL', 'FOOTBALL', 'HANDBALL', 'SOCCER',
            'VOLLEYBALL', 'TENNIS', 'RACQUETBALL', 'SWIMMING', 'SKIING',
            'CYCLING', 'GOLF', 'TABLETTENNIS', 'WRESTLING', 'BOXING',
            'KABADDI', 'JAZZ', 'KARATE', 'KIDSPLAY', 'KITEFIGHTING',
            'MMA', 'POLO', 'RUGBY', 'SQUASH', 'TANDEM'
        ],
        colors: [
            'RED', 'BLUE', 'GREEN', 'YELLOW', 'PURPLE',
            'ORANGE', 'PINK', 'BROWN', 'BLACK', 'WHITE',
            'GRAY', 'SILVER', 'TEAL', 'MAROON', 'NAVY',
            'OLIVE', 'LIME', 'AQUA', 'TEAL', 'SILVER',
            'GOLD', 'BROWN', 'BLACK', 'WHITE', 'GRAY',
            'SILVER', 'TEAL', 'MAROON', 'NAVY', 'OLIVE',
            'LIME', 'AQUA'
        ],
        foods: [
            'PIZZA', 'PASTA', 'BURGER', 'TACO', 'SUSHI',
            'LASAGNA', 'NOODLES', 'RICE', 'BREAD', 'CHEESE',
            'BUTTER', 'YOGURT', 'POTATO', 'TOMATO', 'ONION',
            'GARLIC', 'PEPPER', 'SALAD', 'SOUP', 'STEAK',
            'CHICKEN', 'FISH', 'EGG', 'BACON', 'SAUSAGE',
            'PANCAKE', 'WAFFLE', 'OATMEAL', 'CEREAL', 'TOAST',
            'DONUT', 'MUFFIN', 'BAGEL', 'CROISSANT', 'TORTILLA',
            'HUMMUS', 'GUACAMOLE', 'SALAMI', 'PEANUT', 'ALMOND',
            'AVOCADO', 'CARROT', 'CORN', 'BEANS', 'OLIVE',
            'HONEY', 'JAM', 'SYRUP', 'MUSTARD', 'KETCHUP'
        ]
    };

    // Utility function to check if all letters are guessed
    function checkWin() {
        return selectedWord.split('').every(letter => correctLetters.includes(letter));
    }

    // Utility function to update the visible letters
    function updateWordDisplay() {
        document.querySelectorAll('.word-letter').forEach(el => {
            const letter = el.dataset.letter;
            if (correctLetters.includes(letter)) {
                el.textContent = letter;
            } else {
                el.textContent = '_'; // Show underscore for unguessed letters
            }
        });
    }

    // Utility function to draw the hangman part
    function updateHangmanDrawing() {
        switch (wrongLetters.length) {
            case 1: hangmanParts.head.style.display = 'block'; break;
            case 2: hangmanParts.body.style.display = 'block'; break;
            case 3: hangmanParts.leftArm.style.display = 'block'; break;
            case 4: hangmanParts.rightArm.style.display = 'block'; break;
            case 5: hangmanParts.leftLeg.style.display = 'block'; break;
            case 6: hangmanParts.rightLeg.style.display = 'block'; break;
        }
    }

    // Handle letter guess logic
    function handleGuess(letter) {
        // Guard clause
        if (gameOver || wrongLetters.includes(letter) || correctLetters.includes(letter)) return;

        if (selectedWord.includes(letter)) {
            // Correct guess
            correctLetters.push(letter);
            updateWordDisplay();

            // Mark keyboard letter as correct
            document.querySelector(`.keyboard-letter[data-letter="${letter}"]`).classList.add('correct', 'used');

            // Check if player won
            if (checkWin()) {
                gameOver = true;
                gameMessageEl.textContent = 'Congratulations! You won!';
                gameMessageEl.style.color = 'green';
                hintBtn.disabled = true;
            }
        } else {
            // Wrong guess
            wrongLetters.push(letter);
            remainingGuesses--;
            remainingGuessesEl.textContent = `Remaining guesses: ${remainingGuesses}`;

            // Mark keyboard letter as wrong
            document.querySelector(`.keyboard-letter[data-letter="${letter}"]`).classList.add('wrong', 'used');

            // Show hangman part
            updateHangmanDrawing();

            // Check if player lost
            if (remainingGuesses === 0) {
                gameOver = true;
                gameMessageEl.textContent = `Game Over! The word was: ${selectedWord}`;
                gameMessageEl.style.color = 'red';

                // Show face
                if (hangmanParts.face) { // Check if element exists before accessing style
                    hangmanParts.face.style.display = 'block';
                }
                hintBtn.disabled = true;
            }
        }
    }

    // Handle hint logic
    function handleHint() {
        if (gameOver || hintsUsed >= maxHints) return;

        // Find unguessed letters
        const unguessedLetters = selectedWord.split('').filter(letter => !correctLetters.includes(letter));
        if (unguessedLetters.length === 0) return; // All letters guessed

        // Pick a random unguessed letter
        const randomLetter = unguessedLetters[Math.floor(Math.random() * unguessedLetters.length)];
        correctLetters.push(randomLetter);
        updateWordDisplay(); // This maps/places the letter in the correct placeholder positions

        // Mark keyboard letter as correct (since hint reveals it)
        document.querySelector(`.keyboard-letter[data-letter="${randomLetter}"]`).classList.add('correct', 'used');

        // Debug: Log the revealed letter
        console.log(`Hint revealed: ${randomLetter}`);

        hintsUsed++;
        hintsRemainingEl.textContent = `Hints Remaining: ${maxHints - hintsUsed}`;

        // Disable hint button if max hints used
        if (hintsUsed >= maxHints) {
            hintBtn.disabled = true;
        }

        // Check if player won after hint
        if (checkWin()) {
            gameOver = true;
            gameMessageEl.textContent = 'Congratulations! You won!';
            gameMessageEl.style.color = 'green';
            hintBtn.disabled = true;
        }
    }

    // Initialize game function
    function initGame() {
        // Reset game state
        correctLetters = [];
        wrongLetters = [];
        remainingGuesses = 6;
        gameOver = false;
        hintsUsed = 0;
        gameMessageEl.textContent = '';
        gameMessageEl.style.color = 'var(--primary)'; // Reset color

        // Select random category and word
        const categories = Object.keys(wordCategories);
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const words = wordCategories[randomCategory];
        selectedWord = words[Math.floor(Math.random() * words.length)];

        // Update UI
        const categoryEl = document.getElementById('category');
        if (categoryEl) { // Added check for safety
            categoryEl.textContent = `Category: ${randomCategory.charAt(0).toUpperCase() + randomCategory.slice(1)}`;
        }
        remainingGuessesEl.textContent = `Remaining guesses: ${remainingGuesses}`;
        hintsRemainingEl.textContent = `Hints Remaining: ${maxHints - hintsUsed}`;

        // Enable hint button
        hintBtn.disabled = false;

        // Hide all hangman parts
        Object.values(hangmanParts).forEach(part => {
            if (part) { // Added check for safety
                part.style.display = 'none';
            }
        });

        // Create word display
        wordDisplay.innerHTML = '';
        for (let i = 0; i < selectedWord.length; i++) {
            const letterEl = document.createElement('div');
            letterEl.classList.add('word-letter');
            letterEl.dataset.letter = selectedWord[i];
            letterEl.textContent = '_'; // Initialize with underscore
            wordDisplay.appendChild(letterEl); // Appended element
        }

        // Create keyboard
        keyboard.innerHTML = '';
        for (let i = 65; i <= 90; i++) {
            const letter = String.fromCharCode(i);
            const keyEl = document.createElement('button');
            keyEl.classList.add('keyboard-letter');
            keyEl.textContent = letter;
            keyEl.dataset.letter = letter;
            keyEl.addEventListener('click', () => handleGuess(letter));
            keyboard.appendChild(keyEl);
        }
    }

    // Keyboard event listener
    document.addEventListener('keydown', e => {
        // Regular expression to test if key is an alphabet letter
        if (/^[a-z]$/i.test(e.key)) {
            handleGuess(e.key.toUpperCase());
        }
    });

    // Hint button event listener
    hintBtn.addEventListener('click', handleHint);

    // Reset button
    resetBtn.addEventListener('click', initGame);

    // Start the game
    initGame();
});
