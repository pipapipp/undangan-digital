document.addEventListener('DOMContentLoaded', function () {

    // 1. URL Parameter Guest Name Personalization
    const urlParams = new URLSearchParams(window.location.search);
    const guestNameParam = urlParams.get('to');
    const guestNameElement = document.getElementById('guest-name');
    
    if (guestNameParam) {
        guestNameElement.textContent = decodeURIComponent(guestNameParam);
    } else {
        guestNameElement.textContent = "Tamu Undangan";
    }

    // 2. Cover Screen & Reliable Audio Handling
    const coverSection = document.getElementById('cover-section');
    const mainContent = document.getElementById('main-content');
    const openInvitationBtn = document.getElementById('open-invitation');
    const bgMusic = document.getElementById('bg-music');
    const audioControlBtn = document.getElementById('audio-control');
    const audioIcon = document.getElementById('audio-icon');
    
    let isPlaying = false;

    function playAudio() {
        bgMusic.play().then(() => {
            isPlaying = true;
            audioIcon.classList.remove('bi-volume-mute-fill');
            audioIcon.classList.add('bi-music-note-beamed', 'rotating');
        }).catch(err => {
            console.log("Audio autoplay restricted by browser: ", err);
        });
    }

    function toggleMusic() {
        if (isPlaying) {
            bgMusic.pause();
            audioIcon.classList.remove('bi-music-note-beamed', 'rotating');
            audioIcon.classList.add('bi-volume-mute-fill');
            isPlaying = false;
        } else {
            playAudio();
        }
    }

    openInvitationBtn.addEventListener('click', function () {
        coverSection.classList.add('hidden');
        mainContent.classList.remove('d-none');
        document.body.style.overflow = 'auto';

        // Play Music upon user interaction
        playAudio();

        // Trigger Reveal & Scroll Observers
        initScrollAnimations();
    });

    audioControlBtn.addEventListener('click', toggleMusic);

    // 3. Navbar Scroll Adaptive & ScrollSpy Logic
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.custom-nav-link');
    const sections = document.querySelectorAll('header, section');

    window.addEventListener('scroll', function () {
        // Navbar Background Change
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Navbar Link based on Scroll Position
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + currentSection) {
                link.classList.add('active');
            }
        });
    });

    // 4. Countdown Timer
    const weddingDate = new Date('December 20, 2026 08:00:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // 5. Scroll Animations & Timeline Highlight
    function initScrollAnimations() {
        const revealElements = document.querySelectorAll('.reveal-element');
        const timelineItems = document.querySelectorAll('.timeline-item');

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.15 });

        revealElements.forEach(el => revealObserver.observe(el));

        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                } else {
                    entry.target.classList.remove('active');
                }
            });
        }, { threshold: 0.6 });

        timelineItems.forEach(item => timelineObserver.observe(item));
    }

    const initialReveal = document.querySelectorAll('.cover-section .reveal-element');
    initialReveal.forEach(el => el.classList.add('visible'));

    // RSVP Form Submission Handler
    const rsvpForm = document.getElementById('rsvp-form');

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function (e) {
            e.preventDefault();
            
            // Tampilkan notifikasi berhasil
            alert('Terima kasih! Konfirmasi kehadiran dan ucapan Anda telah berhasil dikirim.');
            
            // Reset form
            rsvpForm.reset();
        });
    }

    renderWishes();

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    // 7. Copy to Clipboard
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const textToCopy = this.getAttribute('data-clipboard');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = this.innerHTML;
                this.innerHTML = `<i class="bi bi-check2 me-1"></i> Berhasil Disalin!`;
                this.classList.remove('btn-outline-sage');
                this.classList.add('btn-success');
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.classList.remove('btn-success');
                    this.classList.add('btn-outline-sage');
                }, 2000);
            });
        });
    });
});