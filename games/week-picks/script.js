document.addEventListener('DOMContentLoaded', () => {
    const screens = document.querySelectorAll('.screen');
    const makeSelectionsBtn = document.getElementById('make-selections-btn');
    const confirmAllSelectionsBtn = document.getElementById('confirm-all-selections-btn');

    const selectionBtns = document.querySelectorAll('.selection-btn');
    const closeButtons = document.querySelectorAll('.modal .close-button');
    const confirmModalBtns = document.querySelectorAll('.confirm-modal-btn');
    const selectItemBtns = document.querySelectorAll('.select-item-btn');

    const leaderboardViewBtns = document.querySelectorAll('.view-selections-btn');
    const userSelectionsModal = document.getElementById('modal-user-selections');
    const userSelectionsModalTitle = document.getElementById('modal-user-selections-title');
    const userSelectionsModalContent = document.getElementById('modal-user-selections-content');
    const userSelectionsModalTotalPoints = document.getElementById('modal-user-total-points');

    // Store user selections globally
    const userSelections = {
        teamsToWin: [],
        playersToScore: [],
        playersToAssist: [],
        playersToCard: [],
        teamsToCleanSheet: []
    };

    // Hardcoded dummy selections for leaderboard users
    const leaderboardData = {
        stu: {
            name: 'Stu',
            points: 200,
            selections: [
                { type: 'Team to Win', name: 'Arsenal', status: 'finished', outcome: 'correct', points: 50 },
                { type: 'Player to Score', name: 'Bukayo Saka', status: 'finished', outcome: 'correct', points: 50 },
                { type: 'Player to Assist', name: 'Martin Ødegaard', status: 'in-play', outcome: 'pending', points: 0 },
                { type: 'Player to Get Card', name: 'Granit Xhaka', status: 'finished', outcome: 'incorrect', points: 0 },
                { type: 'Clean Sheet', name: 'Chelsea', status: 'upcoming', outcome: 'pending', points: 0 }
            ]
        },
        dave: {
            name: 'Dave',
            points: 150,
            selections: [
                { type: 'Team to Win', name: 'Man Utd', status: 'finished', outcome: 'correct', points: 50 },
                { type: 'Player to Score', name: 'Marcus Rashford', status: 'finished', outcome: 'correct', points: 50 },
                { type: 'Player to Assist', name: 'Bruno Fernandes', status: 'in-play', outcome: 'correct', points: 50 },
                { type: 'Player to Get Card', name: 'Casemiro', status: 'finished', outcome: 'incorrect', points: 0 },
                { type: 'Clean Sheet', name: 'Man City', status: 'upcoming', outcome: 'pending', points: 0 }
            ]
        },
        si: {
            name: 'Si',
            points: 100,
            selections: [
                { type: 'Team to Win', name: 'Liverpool', status: 'finished', outcome: 'correct', points: 50 },
                { type: 'Player to Score', name: 'Darwin Núñez', status: 'finished', outcome: 'incorrect', points: 0 },
                { type: 'Player to Assist', name: 'Trent Alexander-Arnold', status: 'in-play', outcome: 'correct', points: 50 },
                { type: 'Player to Get Card', name: 'Fabinho', status: 'finished', outcome: 'incorrect', points: 0 },
                { type: 'Clean Sheet', name: 'Arsenal', status: 'upcoming', outcome: 'pending', points: 0 }
            ]
        },
        anj: {
            name: 'Anj',
            points: 75,
            selections: [
                { type: 'Team to Win', name: 'Tottenham', status: 'finished', outcome: 'correct', points: 50 },
                { type: 'Player to Score', name: 'Harry Kane', status: 'finished', outcome: 'correct', points: 50 }, // For demo, assume Kane is still there :)
                { type: 'Player to Assist', name: 'Son Heung-min', status: 'in-play', outcome: 'incorrect', points: 0 },
                { type: 'Player to Get Card', name: 'Cristian Romero', status: 'finished', outcome: 'incorrect', points: 0 },
                { type: 'Clean Sheet', name: 'Man Utd', status: 'upcoming', outcome: 'pending', points: 0 }
            ]
        },
        barry: {
            name: 'Barry',
            points: 50,
            selections: [
                { type: 'Team to Win', name: 'Aston Villa', status: 'finished', outcome: 'correct', points: 50 },
                { type: 'Player to Score', name: 'Ollie Watkins', status: 'finished', outcome: 'incorrect', points: 0 },
                { type: 'Player to Assist', name: 'Douglas Luiz', status: 'in-play', outcome: 'incorrect', points: 0 },
                { type: 'Player to Get Card', name: 'John McGinn', status: 'finished', outcome: 'incorrect', points: 0 },
                { type: 'Clean Sheet', name: 'Liverpool', status: 'upcoming', outcome: 'pending', points: 0 }
            ]
        }
    };


    // --- Screen Navigation ---
    function showScreen(screenId) {
        screens.forEach(screen => {
            screen.classList.remove('active-screen');
        });
        document.getElementById(screenId).classList.add('active-screen');
        // Update URL hash without refreshing
        window.history.pushState(null, '', `#${screenId}`);
    }

    // Handle initial screen load based on URL hash
    const initialHash = window.location.hash.substring(1);
    if (initialHash && document.getElementById(initialHash)) {
        showScreen(initialHash);
    } else {
        showScreen('homescreen'); // Default to homescreen
    }

    makeSelectionsBtn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent default link behavior
        showScreen('selections');
    });

    confirmAllSelectionsBtn.addEventListener('click', (event) => {
        event.preventDefault();
        updateUserInPlaySelections(); // Populate user selections before showing in-play
        showScreen('in-play');
    });

    // --- Modal Logic ---
    selectionBtns.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modal;
            document.getElementById(modalId).style.display = 'block';

            // Reset selected items and enable all select buttons in this modal
            const modal = document.getElementById(modalId);
            const selectButtonsInModal = modal.querySelectorAll('.select-item-btn');
            selectButtonsInModal.forEach(btn => {
                btn.classList.remove('selected', 'disabled');
                btn.textContent = 'Select';
            });

            // Set current selections in modal
            const category = modal.id.replace('modal-', '').replace(/-/g, ''); // e.g., 'teamswin', 'playerscore'
            let currentSelectionsArray;
            if (category === 'teamswin') currentSelectionsArray = userSelections.teamsToWin;
            else if (category === 'playerscore') currentSelectionsArray = userSelections.playersToScore;
            else if (category === 'playersassist') currentSelectionsArray = userSelections.playersToAssist;
            else if (category === 'playerscard') currentSelectionsArray = userSelections.playersToCard;
            else if (category === 'teamscleansheet') currentSelectionsArray = userSelections.teamsToCleanSheet;

            currentSelectionsArray.forEach(selectedItem => {
                const itemElement = modal.querySelector(`[data-team-id="${selectedItem.id}"]`) || modal.querySelector(`[data-player-id="${selectedItem.id}"]`);
                if (itemElement) {
                    const selectBtn = itemElement.querySelector('.select-item-btn');
                    selectBtn.classList.add('selected');
                    selectBtn.textContent = 'Selected';
                }
            });

            // Update confirm button state on modal open
            updateConfirmButtonState(modal);
        });
    });

    closeButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal');
            modal.style.display = 'none';
        });
    });

    confirmModalBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const modal = event.target.closest('.modal');
            modal.style.display = 'none';

            const category = modal.id.replace('modal-', '').replace(/-/g, ''); // e.g., 'teamswin', 'playerscore'
            let targetSelectedItemsId;
            let currentSelectionsArray;

            if (category === 'teamswin') {
                targetSelectedItemsId = 'selected-teams-win';
                currentSelectionsArray = userSelections.teamsToWin;
            } else if (category === 'playerscore') {
                targetSelectedItemsId = 'selected-players-score';
                currentSelectionsArray = userSelections.playersToScore;
            } else if (category === 'playersassist') {
                targetSelectedItemsId = 'selected-players-assist';
                currentSelectionsArray = userSelections.playersToAssist;
            } else if (category === 'playerscard') {
                targetSelectedItemsId = 'selected-players-card';
                currentSelectionsArray = userSelections.playersToCard;
            } else if (category === 'teamscleansheet') {
                targetSelectedItemsId = 'selected-teams-cleansheet';
                currentSelectionsArray = userSelections.teamsToCleanSheet;
            }

            renderSelectedItems(currentSelectionsArray, document.getElementById(targetSelectedItemsId), category);
        });
    });

    // --- Selection Logic within Modals ---
    selectItemBtns.forEach(button => {
        button.addEventListener('click', (event) => {
            const itemElement = event.target.closest('.team-item') || event.target.closest('.player-item');
            const modal = event.target.closest('.modal');
            const selectBtn = event.target;

            const category = modal.id.replace('modal-', '').replace(/-/g, '');
            let maxSelections = 3; // All categories require 3 picks

            let currentSelectionsArray;
            if (category === 'teamswin') currentSelectionsArray = userSelections.teamsToWin;
            else if (category === 'playerscore') currentSelectionsArray = userSelections.playersToScore;
            else if (category === 'playersassist') currentSelectionsArray = userSelections.playersToAssist;
            else if (category === 'playerscard') currentSelectionsArray = userSelections.