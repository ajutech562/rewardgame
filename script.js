tapBtn.addEventListener('click', () => {
    tapBtn.classList.add('tap-effect');
    setTimeout(() => tapBtn.classList.remove('tap-effect'), 200);
    points++;
    tapCount++;
    updateDisplays();
});


// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.remove('scale-100', 'opacity-100');
        profileMenu.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            profileMenu.classList.add('hidden');
        }, 200);
    }
});
const profileBtn = document.getElementById('profile-btn');
const profileMenu = document.getElementById('profile-menu');

profileBtn.addEventListener('click', () => {
    if (profileMenu.classList.contains('hidden')) {
        profileMenu.classList.remove('hidden');
        setTimeout(() => {
            profileMenu.classList.remove('scale-95', 'opacity-0');
            profileMenu.classList.add('scale-100', 'opacity-100');
        }, 10);
    } else {
        profileMenu.classList.remove('scale-100', 'opacity-100');
        profileMenu.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            profileMenu.classList.add('hidden');
        }, 200); // match transition duration
    }
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
        profileMenu.classList.remove('scale-100', 'opacity-100');
        profileMenu.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
            profileMenu.classList.add('hidden');
        }, 200);
    }
});
