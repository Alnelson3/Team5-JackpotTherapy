// Title screen elements
let startButton = document.getElementById('startButton');
let titleText = document.getElementById('titleText');
let welcomeSign = document.getElementById('welcomeSign');
let slotMachineTitle = document.getElementById('slotMachineTitle');
let subtitle = document.querySelector('.subtitle');
let titleScreenContainer = document.querySelector('.title-screen-container');

// Profile screen elements
let createNewProfile = document.getElementById('createNewProfile');
let profileText = document.getElementById('profileText');
let selectButton = document.getElementById('selectButton');
let selectLeftButton = document.getElementById('selectLeftButton');
let selectRightButton = document.getElementById('selectRightButton');
// avatarSelectMid appears in main and profile screens
let avatarSelectMid = document.getElementById('avatarSelectMid');
let avatarSelectLeft = document.getElementById('avatarSelectLeft');
let avatarSelectRight = document.getElementById('avatarSelectRight');

// Main screen elements
let profileNameElement = document.getElementById('profileName');
let balanceElement = document.getElementById('balance');
let slot1 = document.getElementById('slot1');
let slot2 = document.getElementById('slot2');
let slot3 = document.getElementById('slot3');
let spinButton = document.getElementById('spinButton');
let loanButton = document.getElementById('loanButton');
let betButton = document.getElementById('betButton');
let betAmount = document.getElementById('betAmount');
let amountOptions = document.getElementById('amountOptions');
let bet10 = document.getElementById('bet10');
let bet100 = document.getElementById('bet100');
let bet1000 = document.getElementById('bet1000');
let betAll = document.getElementById('betAll');
let spinSound = document.getElementById("spinSound")
let jackpotSound = document.getElementById("jackpotSound")
let debtElement = document.getElementById('debtElement');
let debtNum = document.getElementById('debtNum');
let loseScreen = document.getElementById('loseScreen');
// Elements that appear in every screen
let music = document.getElementById('music');
let background = document.getElementById('background');
let clickSound = document.getElementById('clickSound');
let backOrQuitButton = document.getElementById('backOrQuitButton');

// variables
let profilePic = 1;
let profileName = "";
let currentScreen = "title";
// this is where all profiles will be stored, using key value pairs for each profile for the name, avatar, and balance
let profileMatrix = [{name: "Default", avatar: 1, balance: 1000}];
let slotArray = [1,1,1];
let spinningCheck = [false];
let brokeCheckInterval = null;
//change these variable to be assigned to the selected profile when loading a profile
let balance = 1000;
let name = "Default";
let avatar = 1;
balanceElement.innerHTML = "Balance: $" + balance;
// for the profile selection screen, 0 is the create new profile option, 1+ are the saved profiles, 
// starts at -1 since no profile is selected
let selectedProfileTemp = 0;





// onload function to set music controls to true then false to get music to start playing

document.onload = function() {
    // The music doesnt start without this for some reason
    music.controls = true;
    music.controls = false;
    music.play();
}



startButton.onmousedown = function() {
    buttonClick(startButton, profileScreen);
    if (music.paused) {
        music.play();
    }
};

selectButton.onmousedown = function() {
    buttonClick(selectButton, function() {
        if (currentScreen == "profile-name") {
            profileName = profileText.innerHTML;
            profileNameElement.innerHTML = profileName;
            mainScreen();
        } else if (currentScreen == "profile-character") {
            avatarSelectLeft.style.display = 'none';
            avatarSelectRight.style.display = 'none';
            selectLeftButton.style.display = 'none';
            selectRightButton.style.display = 'none';
            console.log("Character Selected: " + profilePic)
            profileText.innerHTML = "Enter Name";
            currentScreen = "profile-name";
            profileText.setAttribute('style', 'display: block;width: 600px;height: 20px;margin-left: 560px;margin-bottom: 100px;');
            profileText.focus();
            profileText.style.textBoxTrimming = 'none';
            profileText.contentEditable = 'true';
        } else if (currentScreen == "profile-select") {
            if (selectedProfileTemp == 0) {
                // create new profile
                profileScreen();
            } else if (selectedProfileTemp > 0) {
                // load selected profile
                let selectedProfile = profileMatrix[selectedProfileTemp -1];
                profileName = selectedProfile.name;
                profilePic = selectedProfile.avatar;
                let balance = selectedProfile.balance;
                profileNameElement.innerHTML = profileName;
                balanceElement.innerHTML = "Balance: $" + balance;
                avatarSelectMid.setAttribute('src', '../images/Avatars/' + profilePic + '.png');
                mainScreen();
            }
        }
    });
};

selectLeftButton.onmousedown = function() {
    buttonClick(selectLeftButton, function() {
        if (profilePic == 1) {
            avatarSelectLeft.setAttribute('src', '../images/Avatars/9.png');
            avatarSelectMid.setAttribute('src', '../images/Avatars/10.png');
            avatarSelectRight.setAttribute('src', '../images/Avatars/1.png');
            profilePic = 10;
        } else if (profilePic == 2) {
            avatarSelectLeft.setAttribute('src', '../images/Avatars/10.png');
            avatarSelectMid.setAttribute('src', '../images/Avatars/1.png');
            avatarSelectRight.setAttribute('src', '../images/Avatars/2.png');
            profilePic = 1;
        } else if (profilePic == 10) {
            avatarSelectLeft.setAttribute('src', '../images/Avatars/8.png');
            avatarSelectMid.setAttribute('src', '../images/Avatars/9.png');
            avatarSelectRight.setAttribute('src', '../images/Avatars/10.png');
            profilePic = 9;
        } else {
            let newPic = profilePic - 1;
            avatarSelectLeft.setAttribute('src', '../images/Avatars/' + (newPic - 1) + '.png');
            avatarSelectMid.setAttribute('src', '../images/Avatars/' + newPic + '.png');
            avatarSelectRight.setAttribute('src', '../images/Avatars/' + (newPic + 1) + '.png');
            profilePic = newPic;
        }
    });
};

selectRightButton.onmousedown = function() {
    buttonClick(selectRightButton, function() {
        if (profilePic == 9) {
            avatarSelectLeft.setAttribute('src', '../images/Avatars/9.png');
            avatarSelectMid.setAttribute('src', '../images/Avatars/10.png');
            avatarSelectRight.setAttribute('src', '../images/Avatars/1.png');
            profilePic = 10;
        } else if (profilePic == 10) {
            avatarSelectLeft.setAttribute('src', '../images/Avatars/10.png');
            avatarSelectMid.setAttribute('src', '../images/Avatars/1.png');
            avatarSelectRight.setAttribute('src', '../images/Avatars/2.png');
            profilePic = 1;
        } else if (profilePic == 1) {
            avatarSelectLeft.setAttribute('src', '../images/Avatars/1.png');
            avatarSelectMid.setAttribute('src', '../images/Avatars/2.png');
            avatarSelectRight.setAttribute('src', '../images/Avatars/3.png');
            profilePic = 2;
        } else {
            let newPic = profilePic + 1;
            avatarSelectLeft.setAttribute('src', '../images/Avatars/' + (newPic - 1) + '.png');
            avatarSelectMid.setAttribute('src', '../images/Avatars/' + newPic + '.png');
            avatarSelectRight.setAttribute('src', '../images/Avatars/' + (newPic + 1) + '.png');
            profilePic = newPic;
        }
    });
};

loanButton.onmousedown = function() {
    buttonClick(loanButton, function() {
        if (loanButton.innerHTML == "Pay Back") {
            console.log("Loan Payback Clicked");
            balance -= parseInt(debtNum.innerHTML);
            debtNum.innerHTML = 0;
            loanButton.innerHTML = "Loan";
            loanButton.style.top = "93%";
            loanButton.style.left = "93%";
            loanButton.style.width = "150px";
            debtElement.style.left = "88%";
            balanceElement.innerHTML = "Balance: $" + balance;
            return;
        } else {
            loanButton.style.left = "90%";
            loanButton.style.width = "300px";
            debtElement.style.left = "85%";
            console.log("Loan Button Clicked");
            balance += 500;
            debtNum.innerHTML = parseInt(debtNum.innerHTML) + 750;
            loanButton.innerHTML = "Pay Back";
            balanceElement.innerHTML = "Balance: $" + balance;
            if (balance < debtNum.innerHTML) { 
                loanButton.style.display = 'none';
            }
        }
        if (balance < betAmount.innerHTML) {
            spinButton.style.display = 'none';
            spinButton.setAttribute('class', 'open');
            spinButton.setAttribute('class', 'disabled');
        } else {
            spinButton.style.display = 'block';
            spinButton.setAttribute('class', 'open');
        }
    });
}

createNewProfile.onmousedown = function() {
    // I don't use the buttonClick function for profile select elements because they 
    // should not be assigned to the open and closed classes, those are for buttons only
    // profile classes are img elements
    clickSound.src = '../sounds/click.mp3';
    clickSound.currentTime = 0;
    clickSound.play();
    createNewProfile.onmouseup = function() {
        clickSound.src = '../sounds/unclick.mp3';
        clickSound.currentTime = 0;
        clickSound.play();
        createNewProfile.setAttribute('class', 'profileIconSelected');
        selectedProfileTemp = 0;
        selectButton.style.display = 'block';
    };
};

backOrQuitButton.onmousedown = function() {
    buttonClick(backOrQuitButton, function() {
        if (currentScreen == "title") {
            // quit game
            console.log("Quit Game");
            window.close();
        } else {
            resetGame();
            loanButton.innerHTML = "Loan";
            loanButton.style.top = "93%";
            loanButton.style.left = "93%";
            loanButton.style.width = "150px";
            debtElement.style.left = "88%";
            backOrQuitButton.style.left = "7%";
            backOrQuitButton.innerHTML = "Quit";
            // go back to title screen
            console.log("Back to Title Screen");
            // reset all elements to title screen
            createNewProfile.style.display = 'none';
            amountOptions.style.display = 'none';
            debtElement.style.display = 'none';
            profileText.style.display = 'none';
            selectLeftButton.style.display = 'none';
            selectRightButton.style.display = 'none';
            avatarSelectLeft.style.display = 'none';
            avatarSelectMid.style.display = 'none';
            avatarSelectRight.style.display = 'none';
            selectButton.style.display = 'none';
            profileNameElement.style.display = 'none';
            balanceElement.style.display = 'none';
            slot1.style.display = 'none';
            slot2.style.display = 'none';
            slot3.style.display = 'none';
            spinButton.style.display = 'none';
            loanButton.style.display = 'none';
            betButton.style.display = 'none';
            // Show title screen elements
            titleScreenContainer.style.display = 'flex';
            startButton.style.display = 'block';
            titleText.style.display = 'block';
            welcomeSign.style.display = 'block';
            slotMachineTitle.style.display = 'block';
            subtitle.style.display = 'block';
            background.setAttribute('src', '../images/TitleScreen.jpg');
            currentScreen = "title";
            profileText.contentEditable = 'false';
        }
        if (currentScreen != "main") {
        if (spinSound.paused == false) {
            spinSound.pause();
            return;
        }
        return;
    }
    });
}

betButton.onmousedown = function() {
    buttonClick(betButton, function() {
        let bet = betAmount.innerHTML;
        if (amountOptions.style.display == 'none') {
            amountOptions.style.display = 'block';
            betButton.innerHTML = '↑  Bet: <strong>$</strong><strong id="betAmount">' + bet + '</strong>  ↑'
        } else {
            amountOptions.style.display = 'none';
            betButton.innerHTML = '↓  Bet: <strong>$</strong><strong id="betAmount">' + bet + '</strong>  ↓'
        }
    });
}

bet10.onmousedown = function() {
    buttonClick(bet10, function() {
        betAmount.innerHTML = '10';
        amountOptions.style.display = 'none';
        betButton.innerHTML = '↓  Bet: <strong>$</strong><strong id="betAmount">10</strong>  ↓'
    });
    if (balance < 10) {
        spinButton.style.display = 'none';
        spinButton.setAttribute('class', 'open');
        spinButton.setAttribute('class', 'disabled');
    } else {
        spinButton.style.display = 'block';
        spinButton.setAttribute('class', 'open');
    }
}

bet100.onmousedown = function() {
    buttonClick(bet100, function() {
        betAmount.innerHTML = '100';
        amountOptions.style.display = 'none';
        betButton.innerHTML = '↓  Bet: <strong>$</strong><strong id="betAmount">100</strong>  ↓'
    });
    if (balance < 100) {
        spinButton.style.display = 'none';
        spinButton.setAttribute('class', 'open');
        spinButton.setAttribute('class', 'disabled');
    } else {
        spinButton.style.display = 'block';
        spinButton.setAttribute('class', 'open');
    }
}

bet1000.onmousedown = function() {
    buttonClick(bet1000, function() {
        betAmount.innerHTML = '1000';
        amountOptions.style.display = 'none';
        betButton.innerHTML = '↓  Bet: <strong>$</strong><strong id="betAmount">1000</strong>  ↓'
    });
    if (balance < 1000) {
        spinButton.style.display = 'none';
        spinButton.setAttribute('class', 'open');
        spinButton.setAttribute('class', 'disabled');
    } else {
        spinButton.style.display = 'block';
        spinButton.setAttribute('class', 'open');
    }
}

betAll.onmousedown = function() {
    buttonClick(betAll, function() {
        betAmount.innerHTML = 'ALL IN';
        amountOptions.style.display = 'none';
        betButton.innerHTML = '↓  Bet: <strong>$</strong><strong id="betAmount">ALL IN</strong>  ↓'
    });
    if (balance <= 0) {
        spinButton.style.display = 'none';
        spinButton.setAttribute('class', 'open');
        spinButton.setAttribute('class', 'disabled');
    } else {
        spinButton.style.display = 'block';
        spinButton.setAttribute('class', 'open');
    }
}

// this has all the logic for the spinning of the slots and winning/losing
spinButton.onmousedown = function() {
    buttonClick(spinButton, function() {
        let bet = betAmount.innerHTML;
        if (bet == 'ALL IN') {
            bet = balance;
        }
        if (balance < debtNum.innerHTML) { 
            loanButton.style.display = 'none';
        }
        balance -= parseInt(bet);
        balanceElement.innerHTML = "Balance: $" + balance;
        console.log("Spin Button Clicked");
        spinSound.currentTime = 0;
        spinSound.play();
        spinButton.setAttribute('class', 'disabled');
        spinButton.style.display = 'none';
        brokeCheckInterval = clearInterval(brokeCheckInterval);
        spinningCheck[0] = true;
        betButton.style.display = 'none';
        backOrQuitButton.style.display = 'none';
        loanButton.style.display = 'none';
        // while loop to simulate spinning slots
        while (true) {
            let spinInterval = setInterval(function() {
                slotArray[0] = Math.floor(Math.random() * 10) + 1;
                slotArray[1] = Math.floor(Math.random() * 10) + 1;
                slotArray[2] = Math.floor(Math.random() * 10) + 1;
                slot1.setAttribute('src', '../images/Icons/' + slotArray[0] + '.png');
                slot2.setAttribute('src', '../images/Icons/' + slotArray[1] + '.png');
                slot3.setAttribute('src', '../images/Icons/' + slotArray[2] + '.png');
            }, 100);
            // break condition to stop spinning after 3 seconds
            setTimeout(function() {
                if (currentScreen == "main") {
                    betButton.style.display = 'block';
                    backOrQuitButton.style.display = 'block';
                    if (balance > 0 && balance >= bet) {
                        spinButton.setAttribute('class', 'open');
                        spinButton.style.display = 'block';
                    } else {
                        spinButton.setAttribute('class', 'disabled');
                        spinButton.style.display = 'none';
                    }
                    if (balance < debtNum.innerHTML) { 
                        loanButton.style.display = 'none';
                        loanButton.setAttribute('class', 'disabled');
                    } else {
                        loanButton.style.display = 'block';
                        loanButton.setAttribute('class', 'open');
                        loanButton.disabled = false;
                    }
                    spinButton.setAttribute('class', 'open');
                    spinInterval = clearInterval(spinInterval);
                    if (slotArray[0] == slotArray[1] && slotArray[1] == slotArray[2]) {
                        console.log("Jackpot! Three of a kind: ");
                        jackpotSound.currentTime = 0;
                        jackpotSound.play();
                        // right now the user wins 10x their bet for hitting the jackpot
                        balance += parseInt(bet) * 10;
                        balanceElement.innerHTML = "Balance: $" + balance;
                    } else if (slotArray[0] == slotArray[1] || slotArray[1] == slotArray[2] || slotArray[0] == slotArray[2]) {
                        // user wins 2x their bet for two of a kind
                        console.log("Two of a kind!");
                        jackpotSound.currentTime = 0;
                        jackpotSound.play();
                        balance += parseInt(bet) * 2;
                        balanceElement.innerHTML = "Balance: $" + balance;
                    } else {
                        console.log("No match.");
                    }
                    
                    let brokeCheckInterval = setInterval(brokeCheck, 10);
                } else {
                    spinSound.pause();
                    spinInterval = clearInterval(spinInterval);
                }
            }, 4000);
            spinningCheck[0] = false;
            break; 
        }
    });
}

function resetGame() {
    // reset all elements to title screen
        themeButton.style.display = "none";
        themeManager.style.display = "none";
        createNewProfile.style.display = 'none';
        amountOptions.style.display = 'none';
        debtElement.style.display = 'none';
        profileText.style.display = 'none';
        selectLeftButton.style.display = 'none';
        selectRightButton.style.display = 'none';
        avatarSelectLeft.style.display = 'none';
        avatarSelectMid.style.display = 'none';
        avatarSelectRight.style.display = 'none';
        selectButton.style.display = 'none';
        profileNameElement.style.display = 'none';
        balanceElement.style.display = 'none';
        slot1.style.display = 'none';
        slot2.style.display = 'none';
        slot3.style.display = 'none';
        spinButton.style.display = 'none';
        loanButton.style.display = 'none';
        betButton.style.display = 'none';
        // Show title screen elements
        titleScreenContainer.style.display = 'flex';
        startButton.style.display = 'block';
        titleText.style.display = 'block';
        welcomeSign.style.display = 'block';
        slotMachineTitle.style.display = 'block';
        subtitle.style.display = 'block';
        background.setAttribute('src', '../images/TitleScreen.jpg');
        currentScreen = "title";
        balance = 1000;
        loanButton.innerHTML = "Loan";
        loanButton.style.top = "93%";
        loanButton.style.left = "93%";
        loanButton.style.width = "150px";
        debtElement.style.left = "88%";
        backOrQuitButton.style.left = "7%";
        backOrQuitButton.innerHTML = "Quit";
        profileText.contentEditable = 'false';
        loanButton.disabled = false;
        balanceElement.innerHTML = "Balance: $" + balance;
        debtNum.innerHTML = 0;
        loseScreen.style.display = 'none';
        music.play();
}

loseScreen.onmousedown = function() {
        // go back to title screen with 1000 balance
        console.log("Back to Title Screen from Lose Screen");
        resetGame();
}

// this is a big ass function of general things that get checked every 10th of a second
// in an interval called brokeCheckInterval. This also runs at the end of every spin.

// spinningCheck is a variable that I use to check whether the slots are currently spinning so that 
// broke check is not run during the spin, that can cause issues like the game over screen appearing after 
// an ALL IN bet.
function brokeCheck() {
    if (currentScreen != "main") {
        if (spinSound.paused == false) {
            spinSound.pause();
            return;
        }
        return;
    }
    if (spinningCheck[0]) {
        return;
    } else {
        if (spinSound.paused == true) {
            console.log("Broke check running.");
            if (balance < betAmount.innerHTML) {
                spinButton.style.display = 'none';
                spinButton.setAttribute('class', 'open');
                spinButton.setAttribute('class', 'disabled');
            } else {
                spinButton.style.display = 'block';
                spinButton.setAttribute('class', 'open');
            }
            if (balance <= 0) {
                spinButton.setAttribute('class', 'disabled');
                spinButton.style.display = 'none';
                if (debtNum.innerHTML > 0) {
                    // show lose screen
                    console.log("User has lost the game.");
                    loseScreen.style.display = 'block';
                    balance = 0;
                    balanceElement.innerHTML = "Balance: $" + balance;
                    music.pause();

                }
            } else {
                loseScreen.style.display = 'none';
                spinButton.setAttribute('class', 'open');
            }
            if (debtNum.innerHTML <= balance) {
                loanButton.disabled = false;
                loanButton.style.display = 'block';
                loanButton.setAttribute('class', 'open');
            } else {
                loanButton.disabled = true;
                loanButton.style.display = 'none';
                loanButton.setAttribute('class', 'disabled');
            }
        }
    }
}


// function for button clicking, does the clicking animation, plays the click sound, and when you 
// release the mouse it does the specified action. button parameter is the button element. action parameter 
// is the function to call on mouseup.
// Call this function in a mousedown event for a button. dont need a mouseup event since its handled here.
function buttonClick(button, action) {
    button.setAttribute('class', 'closed');
    clickSound.src = '../sounds/click.mp3';
    clickSound.currentTime = 0;
    clickSound.play();
    button.onmouseup = function() {
        button.setAttribute('class', 'open');
        clickSound.src = '../sounds/unclick.mp3';
        clickSound.currentTime = 0;
        clickSound.play();
        action();
    };
}
 
function profileScreen() {
    backOrQuitButton.innerHTML = "Back";
    console.log("Profile Screen Opened");
    selectButton.style.display = 'block';
    if (currentScreen == "title" || currentScreen == 'main') {
        // Remove objects from title screen and main screen and goes to the profile select screen
        profileText.innerHTML = "Select Profile";
        selectButton.style.display = 'none';
        // Hide title screen elements
        titleScreenContainer.style.display = 'none';
        startButton.style.display = 'none';
        titleText.style.display = 'none';
        welcomeSign.style.display = 'none';
        slotMachineTitle.style.display = 'none';
        subtitle.style.display = 'none';
        // Show profile elements
        createNewProfile.style.display = 'block';
        profileText.style.display = 'block';
        profileNameElement.style.display = 'none';
        balanceElement.style.display = 'none';
        slot1.style.display = 'none';
        slot2.style.display = 'none';
        slot3.style.display = 'none';
        spinButton.style.display = 'none';
        loanButton.style.display = 'none';
        betButton.style.display = 'none';
        currentScreen = "profile-select"

        // TODO: make a function that iterates through all of the profiles and either checks if they are in the 
        // profileIconSelected class or makes it so they are all not in that class

        // I want to implament that function here in the future so that it resets all the profile icons everytime you go to the 
        // profile select page
        // for now I have manually set the createNewProfile to be 
        // unselected when going to profile select screen
        createNewProfile.setAttribute('class', 'avatar2');
    } else if (currentScreen == "profile-select") {
        avatarSelectMid.setAttribute('class', 'avatar1')
        // removes objects from profile select screen and goes to avatar select screen
        createNewProfile.style.display = 'none';
        profileText.style.display = 'block';
        selectLeftButton.style.display = 'block';
        selectRightButton.style.display = 'block';
        avatarSelectLeft.style.display = 'block';
        avatarSelectMid.style.display = 'block';
        avatarSelectRight.style.display = 'block';
        profileText.innerHTML = "Select an Avatar";
        currentScreen = "profile-character";
    }

    

    // change background to profile screen
    background.setAttribute('src', '../images/ProfileScreen.jpg');

    
   
}


function mainScreen(){
    if (balance > 0) {
        spinButton.setAttribute('class', 'open');
        spinButton.style.display = 'block';
    } else {
        spinButton.setAttribute('class', 'disabled');
        spinButton.style.display = 'none';
    }
    backOrQuitButton.innerHTML = "Save and Quit";
    backOrQuitButton.style.left = "12%";
    console.log("Main Screen Opened");
    if (currentScreen == "profile-name") {
        // Remove objects from profile screen
        profileText.style.display = 'none';
        selectButton.style.display = 'none';
        avatarSelectMid.setAttribute('class', 'avatar3')
    }
    // Hide title screen elements
    themeButton.style.display = "block";
    titleScreenContainer.style.display = 'none';
    welcomeSign.style.display = 'none';
    slotMachineTitle.style.display = 'none';
    subtitle.style.display = 'none';
    // Show main screen elements
    profileNameElement.style.display = 'block';
    balanceElement.style.display = 'block';
    slot1.style.display = 'block';
    slot2.style.display = 'block';
    slot3.style.display = 'block';
    spinButton.style.display = 'block';
    loanButton.style.display = 'block';
    betButton.style.display = 'block';
    currentScreen = "main";
    debtElement.style.display = 'block';
    // change background to main screen
    background.setAttribute('src', '../images/MainScreen.jpg');
}

// Theme Manager Elements
let themeButton = document.getElementById("themeButton");
let themeManager = document.getElementById("themeManager");
let closeThemeManager = document.getElementById("closeThemeManager");

// Theme buttons
let themePurple = document.getElementById("themePurple");
let themeBlue = document.getElementById("themeBlue");
let themeDark = document.getElementById("themeDark");

// Helper: apply a theme without removing other body classes
function applyTheme(themeName) {
    document.body.classList.remove("theme-purple", "theme-blue", "theme-dark");
    document.body.classList.add(themeName);

    // Glow automatically updates because CSS variables change
}

// Open Theme Manager
themeButton.onmousedown = function () {
    buttonClick(themeButton, function () {
        themeManager.style.display = "block";
    });
};

// Close Theme Manager
closeThemeManager.onmousedown = function () {
    buttonClick(closeThemeManager, function () {
        themeManager.style.display = "none";
    });
};

// Select Themes
themePurple.onmousedown = function () {
    buttonClick(themePurple, function () {
        applyTheme("theme-purple");
    });
};

themeBlue.onmousedown = function () {
    buttonClick(themeBlue, function () {
        applyTheme("theme-blue");
    });
};

themeDark.onmousedown = function () {
    buttonClick(themeDark, function () {
        applyTheme("theme-dark");
    });
};
