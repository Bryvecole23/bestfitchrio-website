document.addEventListener('DOMContentLoaded', function () {

    // MOBILE NAVIGATION

    const hamburger =
        document.querySelector('.hamburger');

    const navMenu =
        document.querySelector('.nav-menu');

    const navLinks =
        document.querySelectorAll('.nav-menu a');


    if (hamburger && navMenu) {

        hamburger.addEventListener('click', function () {

            const open =
                navMenu.classList.toggle('active');

            hamburger.classList.toggle(
                'active',
                open
            );

            hamburger.setAttribute(
                'aria-expanded',
                open
            );

        });

    }


    navLinks.forEach(function (link) {

        link.addEventListener('click', function () {

            if (navMenu) {
                navMenu.classList.remove('active');
            }

            if (hamburger) {

                hamburger.classList.remove('active');

                hamburger.setAttribute(
                    'aria-expanded',
                    'false'
                );

            }

        });

    });


    // SMOOTH SCROLL

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(function (link) {

            link.addEventListener(
                'click',
                function (event) {

                    const href =
                        this.getAttribute('href');

                    if (
                        !href ||
                        href === '#'
                    ) {
                        return;
                    }

                    const target =
                        document.querySelector(href);

                    if (!target) {
                        return;
                    }

                    event.preventDefault();

                    const navbar =
                        document.querySelector('.navbar');

                    const offset =
                        navbar
                            ? navbar.offsetHeight
                            : 0;

                    const position =
                        target.getBoundingClientRect().top +
                        window.scrollY -
                        offset;

                    window.scrollTo({
                        top: position,
                        behavior: 'smooth'
                    });

                }
            );

        });


    // ACTIVE NAVIGATION

    const sections =
        document.querySelectorAll('section[id]');


    function updateNavigation() {

        let current = 'home';

        sections.forEach(function (section) {

            const top =
                section.offsetTop - 150;

            if (window.scrollY >= top) {

                current =
                    section.getAttribute('id');

            }

        });


        navLinks.forEach(function (link) {

            link.classList.toggle(
                'active',
                link.getAttribute('href') ===
                '#' + current
            );

        });

    }


    window.addEventListener(
        'scroll',
        updateNavigation,
        { passive: true }
    );

    updateNavigation();


    // FOOTER YEAR

    const year =
        document.getElementById('year');

    if (year) {

        year.textContent =
            new Date().getFullYear();

    }


    // BOOKING

    const bookingForm =
        document.getElementById(
            'contact-form'
        );

    const submitButton =
        document.getElementById(
            'submit-button'
        );


    if (
        bookingForm &&
        submitButton
    ) {

        bookingForm.addEventListener(
            'submit',
            function () {

                submitButton.disabled = true;

                submitButton.textContent =
                    'Opening Booking...';

            }
        );

    }


    // GOOGLE REVIEWS

    const reviewContainer =
        document.getElementById(
            'google-reviews'
        );

    const googleReviewsLink =
        document.getElementById(
            'google-reviews-link'
        );


    function escapeHtml(value) {

        return String(value).replace(
            /[&<>'"]/g,
            function (character) {

                const characters = {
                    '&': '&amp;',
                    '<': '&lt;',
                    '>': '&gt;',
                    "'": '&#039;',
                    '"': '&quot;'
                };

                return characters[character];

            }
        );

    }


    function renderReviews(data) {

        if (
            !reviewContainer ||
            !data ||
            !Array.isArray(data.reviews)
        ) {
            return;
        }


        const reviews =
            data.reviews
                .filter(function (review) {

                    return (
                        Number(review.rating) >= 4
                    );

                })
                .slice(0, 3);


        if (!reviews.length) {
            return;
        }


        reviewContainer.innerHTML =
            reviews.map(function (review) {

                const author =
                    escapeHtml(
                        review.author ||
                        'Google Reviewer'
                    );

                const reviewText =
                    escapeHtml(
                        review.text ||
                        ''
                    );

                const time =
                    escapeHtml(
                        review.relativeTime ||
                        ''
                    );

                const rating =
                    Math.min(
                        5,
                        Math.max(
                            0,
                            Math.round(
                                Number(
                                    review.rating
                                ) || 0
                            )
                        )
                    );


                return `
                    <article class="review-card">

                        <strong>
                            ${author}
                        </strong>

                        <div class="review-stars">
                            ${'★'.repeat(rating)}
                        </div>

                        <p>
                            ${reviewText}
                        </p>

                        <small>
                            ${time}
                        </small>

                    </article>
                `;

            }).join('');


        if (
            googleReviewsLink &&
            data.googleUrl
        ) {

            googleReviewsLink.href =
                data.googleUrl;

        }

    }


    if (reviewContainer) {

        fetch('/api/google-reviews')

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        'Reviews backend unavailable'
                    );

                }

                return response.json();

            })

            .then(renderReviews)

            .catch(function () {

                /*
                    Placeholder stays visible until
                    the Google Reviews backend
                    is connected.
                */

            });

    }

});