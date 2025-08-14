// Check for user name and redirect if not found
const playerName = localStorage.getItem('playerName');
if (!playerName) {
    window.location.href = 'login.html';
}

// Display user name and profile initial
document.getElementById('user-name-display').textContent = playerName;
document.getElementById('bottom-username').textContent = playerName;
document.getElementById('profile-initial').textContent = playerName.charAt(0).toUpperCase();

// Game state variables
let points = 0;
let rewardsClaimed = 0;
const rewardCost = 10;
const clickValue = 1;

// DOM element references
const pointsDisplay = document.getElementById('points-display');
const tapButton = document.getElementById('tap-button');
const rewardButton = document.getElementById('reward-button');
const rewardsClaimedDisplay = document.getElementById('rewards-claimed-display');
const totalEarningsDisplay = document.getElementById('total-earnings');
const gameMessageBox = document.getElementById('message-box');

// Modal DOM elements
const profileBtn = document.getElementById("profile-btn");
const profileModal = document.getElementById("profile-modal");
const closeModalBtn = document.getElementById("close-modal");
const walletBtn = document.getElementById("wallet-btn");
const closeWalletBtn = document.getElementById("close-wallet");
const walletModal = document.getElementById("wallet-modal");
const detailBtn = document.getElementById("detail-btn");
const closeDetailBtn = document.getElementById("close-detail");
const detailModal = document.getElementById("detail-modal");
const helpBtn = document.getElementById("help-btn");
const closeHelpBtn = document.getElementById("close-help");
const helpModal = document.getElementById("help-modal");
const logoutBtn = document.getElementById("logout-btn");
const deleteBtn = document.getElementById("delete-account-btn"); // Correctly targets the button

// Functions
function updateDisplays() {
    pointsDisplay.textContent = points;
    rewardsClaimedDisplay.textContent = rewardsClaimed;
    totalEarningsDisplay.textContent = rewardsClaimed;
}

function checkRewardStatus() {
    rewardButton.disabled = points < rewardCost;
    rewardButton.className = points >= rewardCost
        ? 'w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white font-bold rounded-xl shadow-md cursor-pointer'
        : 'w-full px-6 py-3 bg-gray-300 text-gray-500 font-bold rounded-xl shadow-md cursor-not-allowed';
}

function showMessage(message, color) {
    gameMessageBox.className = `h-8 text-center font-semibold transition-opacity duration-300 opacity-100 ${color}`;
    gameMessageBox.textContent = message;
    setTimeout(() => {
        gameMessageBox.classList.replace('opacity-100', 'opacity-0');
    }, 1500);
}

// Event Listeners for main game logic
tapButton.addEventListener('click', () => {
    points += clickValue;
    updateDisplays();
    checkRewardStatus();
    showMessage(`+${clickValue} Point!`, 'text-blue-500');
});

rewardButton.addEventListener('click', () => {
    if (points >= rewardCost) {
        points -= rewardCost;
        rewardsClaimed++;
        updateDisplays();
        checkRewardStatus();
        showMessage('Reward Claimed!', 'text-green-500');
    }
});

// Function for daily tasks
function completeTask(taskPoints, successMessage) {
    points += taskPoints;
    updateDisplays();
    checkRewardStatus();
    showMessage(`+${taskPoints} Points! ${successMessage}`, 'text-green-500');
}

// Event Listeners for modals
profileBtn.addEventListener("click", () => {
    profileModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    profileModal.classList.add("hidden");
});

profileModal.addEventListener("click", (e) => {
    if (e.target === profileModal) {
        profileModal.classList.add("hidden");
    }
});

walletBtn.addEventListener("click", () => {
    walletModal.classList.remove("hidden");
    profileModal.classList.add("hidden");
});

closeWalletBtn.addEventListener("click", () => {
    walletModal.classList.add("hidden");
});

walletModal.addEventListener("click", (e) => {
    if (e.target === walletModal) {
        walletModal.classList.add("hidden");
    }
});

detailBtn.addEventListener("click", () => {
    detailModal.classList.remove("hidden");
    profileModal.classList.add("hidden");
});

closeDetailBtn.addEventListener("click", () => {
    detailModal.classList.add("hidden");
});

detailModal.addEventListener("click", (e) => {
    if (e.target === detailModal) {
        detailModal.classList.add("hidden");
    }
});

helpBtn.addEventListener("click", () => {
    helpModal.classList.remove("hidden");
    profileModal.classList.add("hidden");
});

closeHelpBtn.addEventListener("click", () => {
    helpModal.classList.add("hidden");
});

helpModal.addEventListener("click", (e) => {
    if (e.target === helpModal) {
        helpModal.classList.add("hidden");
    }
});

// Logout and Delete Account logic
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("playerName");
    window.location.href = "login.html";
});

deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
        localStorage.clear();
        window.location.href = "login.html";
    }
});



// Initial calls
updateDisplays();
checkRewardStatus();
