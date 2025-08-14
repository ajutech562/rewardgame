// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAwkiDkSEZMJTYTftsJHgIF2mOUICPiRXE",
    authDomain: "rewardgame-e49eb.firebaseapp.com",
    databaseURL: "https://rewardgame-e49eb-default-rtdb.firebaseio.com",
    projectId: "rewardgame-e49eb",
    storageBucket: "rewardgame-e49eb.firebasestorage.app",
    messagingSenderId: "657633540613",
    appId: "1:657633540613:web:9951b138dddad4b8667a6c",
    measurementId: "G-3G294207G4"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// Get the current user ID from localStorage
const userId = localStorage.getItem('userId');
let userData = {};

document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is on the login page
    if (document.getElementById('login-form')) {
        handleLogin();
    } else {
        // If the user is on the main game page, check if they are logged in
        if (!userId) {
            window.location.href = 'login.html';
        } else {
            loadUserData();
        }
    }
});

function handleLogin() {
    const loginForm = document.getElementById('login-form');
    const playerNameInput = document.getElementById('player-name-input');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const playerName = playerNameInput.value.trim();
        if (playerName) {
            findOrCreateUser(playerName);
        }
    });
}

function findOrCreateUser(playerName) {
    const usersRef = database.ref('users');
    usersRef.orderByChild('name').equalTo(playerName).once('value', snapshot => {
        if (snapshot.exists()) {
            // User exists, prevent account creation
            alert('This name is already taken. Please choose another name.');
        } else {
            // New user, create a new entry
            const newUserRef = usersRef.push();
            const newUserId = newUserRef.key;
            
            const initialData = {
                name: playerName,
                points: 0,
                rewardsClaimed: 0,
                profile: {
                    number: '',
                    upiId: ''
                },
                tasks: {
                    youtubeTaskCompleted: false,
                    instaTaskCompleted: false,
                },
                referrals: {
                    count: 0,
                    completed: false
                }
            };
            
            newUserRef.set(initialData).then(() => {
                localStorage.setItem('userId', newUserId);
                window.location.href = 'index.html';
            });
        }
    });
}

function loadUserData() {
    const userRef = database.ref('users/' + userId);
    userRef.on('value', (snapshot) => {
        userData = snapshot.val();
        if (!userData) {
            // Data not found, redirect to login
            localStorage.removeItem('userId');
            window.location.href = 'login.html';
            return;
        }

        // Assign data to local variables and update UI
        points = userData.points || 0;
        rewardsClaimed = userData.rewardsClaimed || 0;
        referralCount = userData.referrals.count || 0;
        
        updateDisplays();
        checkRewardStatus();
        checkDailyTasks();
        checkReferralStatus();

        // Update profile details and user ID
        document.getElementById('user-name-display').textContent = userData.name;
        document.getElementById('bottom-username').textContent = userData.name;
        document.getElementById('profile-initial').textContent = userData.name.charAt(0).toUpperCase();
        document.getElementById('user-id-display').textContent = userId;
        document.getElementById('profile-name-input').value = userData.name;
        document.getElementById('profile-number-input').value = userData.profile.number;
        document.getElementById('upi-input').value = userData.profile.upiId;
    });
}

// Game state variables
let points = 0;
let rewardsClaimed = 0;
const rewardCost = 10;
const clickValue = 1;

// DOM element references (Same as before)
const pointsDisplay = document.getElementById('points-display');
const tapButton = document.getElementById('tap-button');
const rewardButton = document.getElementById('reward-button');
const rewardsClaimedDisplay = document.getElementById('rewards-claimed-display');
const totalEarningsDisplay = document.getElementById('total-earnings');
const gameMessageBox = document.getElementById('message-box');

// Modal DOM elements (Same as before)
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
const deleteBtn = document.getElementById("delete-account-btn");

// New DOM elements for editing and saving (Same as before)
const profileNameInput = document.getElementById('profile-name-input');
const profileNumberInput = document.getElementById('profile-number-input');
const saveDetailsBtn = document.getElementById('save-details-btn');
const upiInput = document.getElementById('upi-input');
const saveUpiBtn = document.getElementById('save-upi-btn');

// Task Buttons (Same as before)
const youtubeTaskBtn = document.getElementById("youtube-task");
const instaTaskBtn = document.getElementById("insta-task");
const referBtn = document.getElementById("refer-btn");

// Refer & Earn Modal Elements (Same as before)
const referModal = document.getElementById("refer-modal");
const closeReferBtn = document.getElementById("close-refer");
const referralLinkInput = document.getElementById("referral-link");
const copyBtn = document.getElementById("copy-btn");
const progressBar = document.getElementById("progress-bar");
const referralCountDisplay = document.getElementById("referral-count");

// Refer & Earn Variables
let referralCount = 0;
const referralGoal = 5;
const referralReward = 20;

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

// Function to handle daily task completion for non-link buttons
window.completeTask = function(taskPoints, successMessage, taskId) {
    if (userData.tasks[taskId]) {
        return;
    }
    
    // New: Ask for confirmation before giving the reward
    if (confirm("Have you completed this task?")) {
        points += taskPoints;
        const updates = {
            points: points,
            [`tasks/${taskId}`]: true // Update specific task status in Firebase
        };
        database.ref('users/' + userId).update(updates).then(() => {
            showMessage(`+${taskPoints} Points! ${successMessage}`, 'text-green-500');
        });
    }
}

// Function to update the referral progress bar and count
function updateReferralProgress() {
    const percentage = (referralCount / referralGoal) * 100;
    progressBar.style.width = `${percentage}%`;
    referralCountDisplay.textContent = `${referralCount}/${referralGoal}`;

    if (referralCount >= referralGoal && !userData.referrals.completed) {
        points += referralReward;
        const updates = {
            points: points,
            'referrals/completed': true
        };
        database.ref('users/' + userId).update(updates).then(() => {
            showMessage(`+${referralReward} Points! Referral Goal Reached!`, 'text-green-500');
        });
    }
}

function checkDailyTasks() {
    if (userData.tasks.youtubeTaskCompleted) {
        youtubeTaskBtn.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-red-500', 'hover:scale-105');
        youtubeTaskBtn.classList.add('bg-gray-400', 'text-gray-600', 'cursor-not-allowed');
        youtubeTaskBtn.innerHTML = '<span>✅ Completed!</span>';
    }

    if (userData.tasks.instaTaskCompleted) {
        instaTaskBtn.disabled = true;
        instaTaskBtn.classList.remove('bg-gradient-to-r', 'from-green-500', 'to-blue-500', 'hover:scale-105');
        instaTaskBtn.classList.add('bg-gray-400', 'text-gray-600', 'cursor-not-allowed');
        instaTaskBtn.textContent = '✅ Completed!';
    }
    
    if (userData.referrals.completed) {
        referBtn.disabled = true;
        referBtn.classList.remove('bg-gradient-to-r', 'from-yellow-500', 'to-orange-500', 'hover:scale-105');
        referBtn.classList.add('bg-gray-400', 'text-gray-600', 'cursor-not-allowed');
        referBtn.textContent = '✅ Referral Goal Completed!';
    }
}

function checkReferralStatus() {
    referralCount = userData.referrals.count || 0;
    updateReferralProgress();
}


// Event listener for the YouTube task
youtubeTaskBtn.addEventListener("click", () => {
    if (userData.tasks.youtubeTaskCompleted) {
        return;
    }
    // New: Ask for confirmation before redirecting to the link and giving points
    if (confirm("Did you subscribe to the YouTube channel? You will be redirected now.")) {
        points += 50;
        const updates = {
            points: points,
            'tasks/youtubeTaskCompleted': true
        };
        database.ref('users/' + userId).update(updates).then(() => {
            showMessage('+50 Points! Subscribed to YouTube!', 'text-green-500');
        });
    } else {
        // If the user cancels, prevent the redirect
        event.preventDefault();
    }
});


// Event Listeners for main game logic
tapButton.addEventListener('click', () => {
    points += clickValue;
    database.ref('users/' + userId).update({ points: points }).then(() => {
        showMessage(`+${clickValue} Point!`, 'text-blue-500');
    });
});

rewardButton.addEventListener('click', () => {
    if (points >= rewardCost) {
        points -= rewardCost;
        rewardsClaimed++;
        const updates = {
            points: points,
            rewardsClaimed: rewardsClaimed
        };
        database.ref('users/' + userId).update(updates).then(() => {
            showMessage('Reward Claimed!', 'text-green-500');
        });
    }
});

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

// New event listeners for saving details
saveDetailsBtn.addEventListener("click", () => {
    const updates = {
        name: profileNameInput.value,
        'profile/number': profileNumberInput.value
    };
    database.ref('users/' + userId).update(updates).then(() => {
        window.location.reload(); 
    });
});

saveUpiBtn.addEventListener("click", () => {
    database.ref('users/' + userId).update({ 'profile/upiId': upiInput.value }).then(() => {
        alert('UPI ID saved successfully!');
    });
});


// Logout and Delete Account logic
logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("userId");
    window.location.href = "login.html";
});

deleteBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
        database.ref('users/' + userId).remove().then(() => {
            localStorage.removeItem("userId");
            window.location.href = "login.html";
        });
    }
});

// Refer & Earn Modal Logic
referBtn.addEventListener("click", () => {
    // Generate a simulated unique referral link
    const referralLink = `https://yourapp.com/refer?id=${userId}`;
    referralLinkInput.value = referralLink;
    
    // Show the modal
    referModal.classList.remove("hidden");
});

closeReferBtn.addEventListener("click", () => {
    referModal.classList.add("hidden");
});

referModal.addEventListener("click", (e) => {
    if (e.target === referModal) {
        referModal.classList.add("hidden");
    }
});

copyBtn.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText(referralLinkInput.value);
        alert('Link copied to clipboard!');
        
        // This is a simulation: when they copy the link, we'll increment the count
        if (referralCount < referralGoal) {
            referralCount++;
            database.ref('users/' + userId + '/referrals/count').set(referralCount).then(() => {
                updateReferralProgress();
            });
        }
    } catch (err) {
        console.error('Failed to copy text: ', err);
        alert('Failed to copy link. Please copy manually.');
    }
});
