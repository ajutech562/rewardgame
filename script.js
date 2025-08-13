<script>
    // Use `window.onload` to ensure all HTML elements are loaded before the script runs.
    window.onload = function() {
        // --- UI Elements ---
        const loginContainer = document.getElementById('login-container');
        const gameAndProfileContainer = document.getElementById('game-and-profile-container');
        const userNameInput = document.getElementById('user-name-input');
        const startButton = document.getElementById('start-button');
        const logoutButton = document.getElementById('logout-button');
        const loginMessageBox = document.getElementById('login-message-box');

        const userNameDisplay = document.getElementById('user-name-display');
        const profileUserNameDisplay = document.getElementById('profile-user-name');
        const pointsDisplay = document.getElementById('points-display');
        const tapButton = document.getElementById('tap-button');
        const rewardButton = document.getElementById('reward-button');
        const rewardsClaimedDisplay = document.getElementById('rewards-claimed-display');
        const gameMessageBox = document.getElementById('message-box');
        const dailyTasksList = document.getElementById('daily-tasks-list');
        const dailyTasksTitle = document.getElementById('daily-tasks-title');

        // New elements for profile toggle
        const profileInfoSection = document.getElementById('profile-info-section');
        const profileOptions = document.getElementById('profile-options');

        // --- Game State Variables ---
        let userName = '';
        let points = 0;
        let rewardsClaimed = 0;
        let dailyTasksClaimedCount = 0;
        let tapCount = 0;
        const rewardCost = 10;
        const clickValue = 1;
        let lastLoginDate = null; // New variable to store the last login date

        // New state flags for the new daily tasks
        let videoWatched = false;
        let youtubeSubscribed = false;

        // Updated daily tasks array with the new tasks
        const dailyTasks = [
            { id: 'tap-task', text: 'Tap 50 times', points: 10, completed: false, check: () => tapCount >= 50 },
            { id: 'reward-task', text: 'Daily bonus 5Rs', points: 5, completed: false, check: () => rewardsClaimed >= 1 },
            { id: 'video-task', text: 'Subcribe the channel 8Rs', points: 8, completed: false, check: () => videoWatched },
            { id: 'youtube-task', text: 'Subscribe to our YouTube channel 8Rs', points: 8, completed: false, check: () => youtubeSubscribed }
        ];

        // --- Utility Functions ---

        /**
         * Saves the game state to localStorage.
         */
        function saveGameState() {
            const gameState = {
                userName,
                points,
                rewardsClaimed,
                dailyTasksClaimedCount,
                tapCount,
                videoWatched,
                youtubeSubscribed,
                lastLoginDate, // Save the last login date
                dailyTasks: dailyTasks.map(task => ({
                    id: task.id,
                    completed: task.completed
                }))
            };
            localStorage.setItem('tapAndEarnGameState', JSON.stringify(gameState));
        }

        /**
         * Loads the game state from localStorage.
         */
        function loadGameState() {
            const savedState = localStorage.getItem('tapAndEarnGameState');
            if (savedState) {
                const gameState = JSON.parse(savedState);
                userName = gameState.userName;
                points = gameState.points;
                rewardsClaimed = gameState.rewardsClaimed;
                dailyTasksClaimedCount = gameState.dailyTasksClaimedCount;
                tapCount = gameState.tapCount;
                videoWatched = gameState.videoWatched;
                youtubeSubscribed = gameState.youtubeSubscribed;
                lastLoginDate = gameState.lastLoginDate ? new Date(gameState.lastLoginDate) : null; // Load and parse the date
                
                // Update daily tasks from saved state
                gameState.dailyTasks.forEach(savedTask => {
                    const taskToUpdate = dailyTasks.find(task => task.id === savedTask.id);
                    if (taskToUpdate) {
                        taskToUpdate.completed = savedTask.completed;
                    }
                });

                return true; // Return true if a state was loaded
            }
            return false; // Return false if no state was found
        }
        
        /**
         * Resets the daily bonus task's completed status.
         */
        function resetDailyBonusTask() {
             const bonusTask = dailyTasks.find(task => task.id === 'reward-task');
             if (bonusTask) {
                bonusTask.completed = false;
             }
        }
        
        /**
         * Checks for and awards the daily bonus if a new day has started.
         */
        function checkDailyBonus() {
            const now = new Date();
            const today = now.toDateString(); // Get a string like "Wed Aug 13 2025"

            const bonusTask = dailyTasks.find(task => task.id === 'reward-task');
            
            // If it's the first time logging in or a new day has passed since the last login
            if (!lastLoginDate || lastLoginDate.toDateString() !== today) {
                // Award the bonus
                points += bonusTask.points;
                showMessage(gameMessageBox, `Daily bonus of +${bonusTask.points} points claimed!`, 'text-green-500');
                
                // Mark the task as completed for today
                bonusTask.completed = true;
                
                // Update the last login date to today
                lastLoginDate = now;
                
                // Save the new state
                saveGameState();
                updateDisplays();
                renderDailyTasks();
            } else {
                // If the user already logged in today, ensure the task is marked as completed
                bonusTask.completed = true;
                renderDailyTasks();
            }
        }


        /**
         * Displays a message in a specified message box for a short duration.
         * @param {HTMLElement} messageBox The element to display the message in.
         * @param {string} message The message to display.
         * @param {string} color The Tailwind text color class (e.g., 'text-red-500').
         */
        function showMessage(messageBox, message, color) {
            // Clear previous classes and set the new ones
            messageBox.className = `h-8 text-center font-semibold transition-opacity duration-300 opacity-100 ${color}`;
            messageBox.textContent = message;

            // Fade out the message after 1.5 seconds
            setTimeout(() => {
                messageBox.classList.remove('opacity-100');
                messageBox.classList.add('opacity-0');
            }, 1500);
        }

        /**
         * Renders the daily tasks into the UI.
         */
        function renderDailyTasks() {
            dailyTasksList.innerHTML = '';
            dailyTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = `flex items-center justify-between p-4 rounded-xl shadow-sm transition-all duration-200 ${task.completed ? 'bg-green-100 dark:bg-green-900' : 'bg-white dark:bg-gray-700'}`;
                
                const taskText = document.createElement('span');
                taskText.className = `font-medium ${task.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-700 dark:text-gray-300'}`;
                taskText.textContent = task.text;

                taskElement.appendChild(taskText);

                if (task.completed) {
                    const checkmark = document.createElement('span');
                    checkmark.className = 'text-green-500 text-2xl';
                    checkmark.textContent = '✅';
                    taskElement.appendChild(checkmark);
                } else {
                    // Check if the task is a link-based task
                    if (task.id === 'video-task' || task.id === 'youtube-task') {
                        const linkButton = document.createElement('a');
                        linkButton.textContent = (task.id === 'video-task') ? 'Subscribe 10Rs' : 'Subscribe 10Rs';
                        linkButton.href = (task.id === 'video-task') ? 'https://www.youtube.com/@SetupC' : 'https://www.youtube.com/@sharpengraphics912';
                        linkButton.target = '_blank';
                        linkButton.className = 'px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none';

                        linkButton.addEventListener('click', () => {
                            // Mark the task as completed and give points
                            if (task.id === 'video-task') {
                                videoWatched = true;
                            } else if (task.id === 'youtube-task') {
                                youtubeSubscribed = true;
                            }
                            task.completed = true;
                            points += task.points;
                            dailyTasksClaimedCount++; // Increment daily task claimed count
                            showMessage(gameMessageBox, `+${task.points} Bonus Points!`, 'text-yellow-500');
                            updateDisplays();
                            renderDailyTasks();
                            saveGameState(); // Save state after completing a task
                        });
                        taskElement.appendChild(linkButton);
                    } else if (task.id === 'reward-task') {
                         // The daily bonus task is now handled automatically
                         // so it doesn't need a claim button if it's not completed
                         const claimInfo = document.createElement('span');
                         claimInfo.textContent = 'Auto-claimed';
                         claimInfo.className = 'text-gray-500 dark:text-gray-400 text-sm';
                         taskElement.appendChild(claimInfo);
                    } else {
                        // These are the original tasks that require a condition to be met
                        const completeButton = document.createElement('button');
                        completeButton.textContent = `Claim +${task.points}`;
                        completeButton.className = 'px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none';
                        
                        if (!task.check()) {
                            completeButton.disabled = true;
                            completeButton.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
                        }
                        completeButton.addEventListener('click', () => {
                            if (task.check()) {
                                task.completed = true;
                                points += task.points;
                                dailyTasksClaimedCount++; // Increment daily task claimed count
                                showMessage(gameMessageBox, `+${task.points} Bonus Points!`, 'text-yellow-500');
                                updateDisplays();
                                renderDailyTasks();
                                saveGameState(); // Save state after claiming points
                            }
                        });
                        taskElement.appendChild(completeButton);
                    }
                }
                dailyTasksList.appendChild(taskElement);
            });
        }

        // --- Login/Logout Logic ---

        function resetGameState() {
            points = 0;
            rewardsClaimed = 0;
            dailyTasksClaimedCount = 0;
            tapCount = 0;
            videoWatched = false;
            youtubeSubscribed = false;
            userNameInput.value = '';
            dailyTasks.forEach(task => task.completed = false);
            localStorage.removeItem('tapAndEarnGameState'); // Clear the saved state
            updateDisplays();
            checkRewardStatus();
            renderDailyTasks();
            profileOptions.classList.add('hidden');
        }

        startButton.addEventListener('click', () => {
            const inputName = userNameInput.value.trim();
            if (inputName === '') {
                showMessage(loginMessageBox, 'Please enter your name!', 'text-red-500');
            } else {
                userName = inputName;
                loginContainer.classList.add('hidden');
                gameAndProfileContainer.classList.remove('hidden');
                
                userNameDisplay.textContent = userName;
                profileUserNameDisplay.textContent = userName;
                
                // When starting, check for the daily bonus
                checkDailyBonus();
                
                renderDailyTasks();
                saveGameState();
            }
        });

        logoutButton.addEventListener('click', () => {
            gameAndProfileContainer.classList.add('hidden');
            loginContainer.classList.remove('hidden');
            
            resetGameState();
        });

        // --- Game Logic ---

        /**
         * Updates the points and rewards displays on the page.
         */
        function updateDisplays() {
            pointsDisplay.textContent = points;
            rewardsClaimedDisplay.textContent = rewardsClaimed + dailyTasksClaimedCount; // Display total rewards
        }

        /**
         * Checks if the user has enough points to claim a reward and updates the reward button state.
         */
        function checkRewardStatus() {
            if (points >= rewardCost) {
                rewardButton.disabled = false;
                // Change button styling for active state
                rewardButton.classList.remove('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
                rewardButton.classList.add('bg-gradient-to-r', 'from-pink-500', 'to-red-500', 'text-white', 'cursor-pointer');
            } else {
                rewardButton.disabled = true;
                // Change button styling for disabled state
                rewardButton.classList.remove('bg-gradient-to-r', 'from-pink-500', 'to-red-500', 'text-white', 'cursor-pointer');
                rewardButton.classList.add('bg-gray-300', 'text-gray-500', 'cursor-not-allowed');
            }
        }

        // Event listener for the tap button
        tapButton.addEventListener('click', () => {
            points += clickValue;
            tapCount++;
            updateDisplays();
            checkRewardStatus();
            showMessage(gameMessageBox, `+${clickValue} Point!`, 'text-blue-500');

            tapButton.classList.add('tap-effect');
            setTimeout(() => {
                tapButton.classList.remove('tap-effect');
            }, 200);

            renderDailyTasks();
            saveGameState(); // Save state on every tap
        });

        // Event listener for the reward button
        rewardButton.addEventListener('click', () => {
            if (points >= rewardCost) {
                points -= rewardCost;
                rewardsClaimed++;
                updateDisplays();
                checkRewardStatus();
                showMessage(gameMessageBox, 'Reward Claimed!', 'text-green-500');
                renderDailyTasks();
                saveGameState(); // Save state after claiming reward
            } else {
                showMessage(gameMessageBox, 'Not enough points!', 'text-red-500');
            }
        });
        
        // Event listener for toggling the profile options
        profileInfoSection.addEventListener('click', () => {
            profileOptions.classList.toggle('hidden');
            profileOptions.classList.toggle('scale-95');
            profileOptions.classList.toggle('opacity-0');
            
            // Animate the menu's appearance
            if (!profileOptions.classList.contains('hidden')) {
                setTimeout(() => {
                    profileOptions.classList.add('scale-100', 'opacity-100');
                    profileOptions.classList.remove('scale-95', 'opacity-0');
                }, 10);
            }
        });

        // --- Initial setup on page load ---
        if (loadGameState()) {
            // If a saved state exists, show the game container
            loginContainer.classList.add('hidden');
            gameAndProfileContainer.classList.remove('hidden');
            userNameDisplay.textContent = userName;
            profileUserNameDisplay.textContent = userName;
            
            // Check for daily bonus when a user with a saved state logs in
            checkDailyBonus();
            
        } else {
            // Otherwise, show the login screen
            loginContainer.classList.remove('hidden');
            gameAndProfileContainer.classList.add('hidden');
            resetDailyBonusTask(); // Ensure the task is not marked as complete for new users
        }

        updateDisplays();
        checkRewardStatus();
        renderDailyTasks();
    };
</script>
