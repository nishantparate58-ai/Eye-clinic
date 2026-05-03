document.addEventListener('DOMContentLoaded', () => {

    /* ── GSAP Setup ─────────────────────────────────────────── */
    gsap.registerPlugin(ScrollTrigger);

    /* ── Cursor Follower ────────────────────────────────────── */
    const cursor = document.getElementById('cursorFollower');
    if (cursor) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.6, ease: 'power2.out' });
        });
    }

    /* ── Hero Entrance Animation ────────────────────────────── */
    const heroTl = gsap.timeline({ delay: 0.2 });
    heroTl
        .from('.hero h1',      { y: 80,  opacity: 0, duration: 1,   ease: 'power4.out' })
        .from('.hero p',       { y: 40,  opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .from('.hero-btns',    { y: 40,  opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .from('.iris-scan',    { scale: 0.7, opacity: 0, duration: 1.2, ease: 'back.out(1.5)' }, '-=1.2');

    /* ── Scroll-Triggered Section Reveals ───────────────────── */
    gsap.utils.toArray('.glass-card, .section-header, .stat-item, .testimonial-card, .contact-detail').forEach((el, i) => {
        gsap.from(el, {
            scrollTrigger: { trigger: el, start: 'top 88%' },
            y: 50, opacity: 0, duration: 0.9,
            delay: (i % 3) * 0.1,
            ease: 'power3.out'
        });
    });

    /* ── About Section Reveal ───────────────────────────────── */
    gsap.from('.about-image img', {
        scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
        x: -60, opacity: 0, duration: 1.1, ease: 'power3.out'
    });
    gsap.from('.about-text', {
        scrollTrigger: { trigger: '.about-grid', start: 'top 80%' },
        x: 60, opacity: 0, duration: 1.1, ease: 'power3.out'
    });

    /* ── Vision / Comparison Slider ─────────────────────────── */
    const visionContainer = document.querySelector('.vision-container');
    const sliderBar       = document.getElementById('sliderBar');
    const imageReveal     = document.getElementById('imageReveal');

    if (visionContainer && sliderBar && imageReveal) {
        let isDragging = false;

        const moveSlider = (clientX) => {
            const rect = visionContainer.getBoundingClientRect();
            let pct = ((clientX - rect.left) / rect.width) * 100;
            pct = Math.min(Math.max(pct, 1), 99);
            sliderBar.style.left     = pct + '%';
            imageReveal.style.clipPath = `inset(0 0 0 ${pct}%)`;
        };

        // Mouse
        sliderBar.addEventListener('mousedown', () => isDragging = true);
        document.addEventListener('mouseup',   () => isDragging = false);
        visionContainer.addEventListener('mousemove', (e) => {
            if (isDragging) moveSlider(e.clientX);
        });
        // Also allow click-to-move anywhere on the container
        visionContainer.addEventListener('click', (e) => moveSlider(e.clientX));

        // Touch
        sliderBar.addEventListener('touchstart', () => isDragging = true, { passive: true });
        document.addEventListener('touchend',    () => isDragging = false);
        visionContainer.addEventListener('touchmove', (e) => {
            if (isDragging) moveSlider(e.touches[0].clientX);
        }, { passive: true });
    }

    /* ── Animated Counters ──────────────────────────────────── */
    document.querySelectorAll('.stat-number').forEach(counter => {
        const target = +counter.getAttribute('data-target');
        let triggered = false;

        ScrollTrigger.create({
            trigger: counter,
            start: 'top 90%',
            onEnter: () => {
                if (triggered) return;
                triggered = true;
                let count = 0;
                const duration   = 2000; // ms
                const steps      = 80;
                const increment  = target / steps;
                const stepTime   = duration / steps;

                const updateCount = () => {
                    count += increment;
                    if (count < target) {
                        counter.textContent = Math.ceil(count).toLocaleString();
                        setTimeout(updateCount, stepTime);
                    } else {
                        // Append suffix where needed
                        const suffix = (target === 99) ? '%' : '+';
                        counter.textContent = target.toLocaleString() + suffix;
                    }
                };
                updateCount();
            }
        });
    });

    /* ── Booking Form ───────────────────────────────────────── */
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name  = document.getElementById('patientName').value;
            const phone = document.getElementById('patientPhone').value;
            if (!name || !phone) {
                alert('Please fill in at least your name and phone number.');
                return;
            }
            // WhatsApp redirect with pre-filled message
            const service = document.getElementById('appointmentService').value || 'Eye Consultation';
            const date    = document.getElementById('appointmentDate').value  || 'flexible';
            const msg = encodeURIComponent(
                `Hello Infinity Eye Hospital,\n\nI'd like to book an appointment.\n\nName: ${name}\nPhone: ${phone}\nService: ${service}\nDate: ${date}\n\nPlease confirm my slot. Thank you!`
            );
            window.open(`https://wa.me/919876543210?text=${msg}`, '_blank');
            bookingForm.reset();
        });
    }

    /* ── Parallax on Iris ───────────────────────────────────── */
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth  / 2) / 60;
        const moveY = (e.clientY - window.innerHeight / 2) / 60;
        gsap.to('.iris-main', { x: moveX, y: moveY, duration: 1, ease: 'power2.out' });
    });

    /* ── Smooth active nav link highlighting ────────────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
        });
        navLinks.forEach(link => {
            link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--accent-cyan)' : '';
        });
    }, { passive: true });

});
