(function () {
    const page = document.body.dataset.page || 'index';
    const base = document.body.dataset.base || '';
    const url404 = base + '404.html';

    const mainContent = document.getElementById('mainContent');
    const registrationPage = document.getElementById('auth') || document.getElementById('registrationPage');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const burgerToggle = document.getElementById('burgerToggle');
    const sidebarClose = document.getElementById('sidebarClose');
    const openRegistrationBtn = document.getElementById('openRegistrationBtn');

    function go404() {
        window.location.href = url404;
    }

    document.querySelectorAll('.open-404-page, .link-404, .nav-link-404, .footer-link-404').forEach(function (el) {
        if (el.closest('.sitemap-board, .sitemap-compact')) return;
        if (el.tagName === 'A') {
            const href = el.getAttribute('href');
            if (href && href !== '#' && !href.startsWith('javascript:')) return;
        }
        el.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            go404();
        });
    });

    function toggleSidebar() {
        if (!sidebar || !overlay) return;
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        const regOpen = registrationPage && registrationPage.classList.contains('active');
        if (!regOpen) {
            document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
        }
    }

    if (burgerToggle) burgerToggle.addEventListener('click', toggleSidebar);
    if (sidebarClose) sidebarClose.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // Сайдбар
    document.querySelectorAll('.side-item.has-sub > .side-link').forEach(function (link) {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 900) {
                e.preventDefault();
                e.stopPropagation();
                const parent = link.parentElement;
                const dropdown = parent.querySelector('.side-dropdown');
                const isOpen = parent.classList.contains('dropdown-open');
                
                parent.classList.toggle('dropdown-open', !isOpen);
                if (dropdown) {
                    if (!isOpen) {
                        dropdown.style.maxHeight = '1000px';
                    } else {
                        dropdown.style.maxHeight = '0';
                    }
                }
                
                // Закрыть другие списки
                const siblings = parent.parentElement.children;
                for (const sib of siblings) {
                    if (sib !== parent && sib.classList.contains('dropdown-open')) {
                        sib.classList.remove('dropdown-open');
                        const sibDrop = sib.querySelector('.side-dropdown');
                        if (sibDrop) sibDrop.style.maxHeight = '0';
                    }
                }
            }
        });
    });

    function showRegistrationPage() {
        if (!registrationPage || !mainContent) return;
        mainContent.classList.add('hidden');
        registrationPage.classList.add('active');
        document.title = 'Паспорт шефа — регистрация | CookCraft';
        document.body.style.overflow = 'hidden';
        window.scrollTo(0, 0);
        if (typeof updateRegSummary === 'function') updateRegSummary();
    }

    function showMainPage() {
        if (!registrationPage || !mainContent) return;
        mainContent.classList.remove('hidden');
        registrationPage.classList.remove('active');
        document.title = 'CookCraft | Кулинарный сайт — рецепты, курсы, вдохновение';
        document.body.style.overflow = '';
    }

    if (openRegistrationBtn && page === 'index') {
        openRegistrationBtn.addEventListener('click', function (e) {
            e.preventDefault();
            showRegistrationPage();
        });
    }

    const regBackToHome = document.getElementById('regBackToHome');
    if (regBackToHome && page === 'index') {
        regBackToHome.addEventListener('click', function (e) {
            if (registrationPage && registrationPage.classList.contains('active')) {
                e.preventDefault();
                showMainPage();
            }
        });
    }

    if (page === 'index' && location.hash === '#auth') {
        showRegistrationPage();
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape' || !sidebar) return;
        if (registrationPage && registrationPage.classList.contains('active')) {
            showMainPage();
        } else if (sidebar.classList.contains('active')) {
            toggleSidebar();
        }
    });

    /* Регистрация */
    const spiceSlider = document.getElementById('spiceSlider');
    const spiceDisplay = document.getElementById('spiceDisplay');
    const archetypeGrid = document.getElementById('archetypeGrid');
    const cuisineTags = document.getElementById('cuisineTags');
    const regPanels = document.querySelectorAll('.reg-step-panel');
    const regDots = document.querySelectorAll('.reg-step-dot');
    const regPrevBtn = document.getElementById('regPrevBtn');
    const regNextBtn = document.getElementById('regNextBtn');
    const regBodyEl = document.querySelector('.reg-body');
    let regCurrentStep = 0;

    const spiceLabels = [
        { max: 20, text: 'Огурец без соли', icon: 'fa-seedling' },
        { max: 45, text: 'Щадящий базилик', icon: 'fa-leaf' },
        { max: 70, text: 'Уверенное чили', icon: 'fa-pepper-hot' },
        { max: 100, text: 'Дыхание дракона', icon: 'fa-fire' }
    ];

    function getSpiceLabel(val) {
        const v = Number(val);
        for (const item of spiceLabels) {
            if (v <= item.max) return item;
        }
        return spiceLabels[spiceLabels.length - 1];
    }

    function updateSpiceDisplay() {
        if (!spiceSlider || !spiceDisplay) return;
        const info = getSpiceLabel(spiceSlider.value);
        spiceDisplay.innerHTML = '<i class="fas ' + info.icon + '"></i> Уровень: ' + info.text;
        const sumSpice = document.getElementById('sumSpice');
        if (sumSpice) sumSpice.textContent = info.text;
    }

    function updateRegSummary() {
        if (!archetypeGrid) return;
        const arch = archetypeGrid.querySelector('.archetype-card.selected');
        const sumArch = document.getElementById('sumArch');
        if (sumArch && arch) sumArch.textContent = arch.dataset.arch;
        updateSpiceDisplay();
        if (!cuisineTags) return;
        const cuisines = [...cuisineTags.querySelectorAll('.cuisine-tag.selected')].map(function (t) {
            return t.textContent.trim();
        });
        const sumCuisines = document.getElementById('sumCuisines');
        if (sumCuisines) sumCuisines.textContent = cuisines.length ? cuisines.join(', ') : '—';
    }

    function goRegStep(step) {
        if (!regPanels.length) return;
        regCurrentStep = Math.max(0, Math.min(step, regPanels.length - 1));
        regPanels.forEach(function (p, i) {
            p.classList.toggle('active', i === regCurrentStep);
        });
        if (regBodyEl) regBodyEl.scrollTop = 0;
        regDots.forEach(function (d, i) {
            d.classList.remove('active', 'done');
            if (i < regCurrentStep) d.classList.add('done');
            if (i === regCurrentStep) d.classList.add('active');
        });
        if (regPrevBtn) regPrevBtn.style.visibility = regCurrentStep === 0 ? 'hidden' : 'visible';
        if (regNextBtn) {
            if (regCurrentStep === regPanels.length - 1) {
                regNextBtn.innerHTML = '<i class="fas fa-stamp"></i> Выдать паспорт';
                updateRegSummary();
            } else {
                regNextBtn.innerHTML = 'Далее <i class="fas fa-arrow-right"></i>';
            }
        }
    }

    if (spiceSlider) {
        spiceSlider.addEventListener('input', updateSpiceDisplay);
        updateSpiceDisplay();
    }

    if (archetypeGrid) {
        archetypeGrid.addEventListener('click', function (e) {
            const card = e.target.closest('.archetype-card');
            if (!card) return;
            archetypeGrid.querySelectorAll('.archetype-card').forEach(function (c) {
                c.classList.remove('selected');
            });
            card.classList.add('selected');
            const sumArch = document.getElementById('sumArch');
            if (sumArch) sumArch.textContent = card.dataset.arch;
        });
    }

    if (cuisineTags) {
        cuisineTags.addEventListener('click', function (e) {
            const tag = e.target.closest('.cuisine-tag');
            if (!tag) return;
            const selected = cuisineTags.querySelectorAll('.cuisine-tag.selected');
            if (tag.classList.contains('selected')) {
                tag.classList.remove('selected');
            } else if (selected.length < 3) {
                tag.classList.add('selected');
            } else {
                tag.classList.add('selected');
                selected[0].classList.remove('selected');
            }
            updateRegSummary();
        });
    }

    if (regPrevBtn) {
        regPrevBtn.addEventListener('click', function () {
            goRegStep(regCurrentStep - 1);
        });
    }

    if (regNextBtn) {
        regNextBtn.addEventListener('click', function () {
            if (regCurrentStep < regPanels.length - 1) {
                goRegStep(regCurrentStep + 1);
            } else {
                go404();
            }
        });
    }

    /* Игра 404 */
    const gameTime404 = document.getElementById('gameTime404');
    const gameScore404 = document.getElementById('gameScore404');
    const gameBest404 = document.getElementById('gameBest404');
    const gameNote404 = document.getElementById('gameNote404');
    const catchGrid404 = document.getElementById('catchGrid404');
    const startGame404Btn = document.getElementById('startGame404Btn');
    const resetGame404Btn = document.getElementById('resetGame404Btn');
    const backToHomeBtn = document.getElementById('backToHomeBtn');
    const gameIcons404 = ['🍅', '🥕', '🌶️', '🥦', '🧄', '🍄', '🥔', '🧅'];
    let gameTimer404 = 20;
    let gameScoreValue404 = 0;
    let gameBestValue404 = 0;
    let gameActiveCell404 = -1;
    let gameTickInterval404 = null;
    let gameMoveInterval404 = null;

    function updateHomeButton404() {
        if (!backToHomeBtn) return;
        const unlocked = gameScoreValue404 >= 5;
        backToHomeBtn.classList.toggle('home-btn-locked', !unlocked);
        backToHomeBtn.disabled = !unlocked;
    }

    function renderGameCells404() {
        if (!catchGrid404) return;
        catchGrid404.querySelectorAll('.catch-cell').forEach(function (cell, index) {
            const isActive = index === gameActiveCell404;
            cell.classList.toggle('active', isActive);
            cell.textContent = isActive ? gameIcons404[Math.floor(Math.random() * gameIcons404.length)] : '🍽️';
        });
    }

    function moveActiveCell404() {
        let next = Math.floor(Math.random() * 9);
        if (next === gameActiveCell404) next = (next + 1) % 9;
        gameActiveCell404 = next;
        renderGameCells404();
    }

    function stop404Game() {
        if (gameTickInterval404) {
            clearInterval(gameTickInterval404);
            gameTickInterval404 = null;
        }
        if (gameMoveInterval404) {
            clearInterval(gameMoveInterval404);
            gameMoveInterval404 = null;
        }
        gameActiveCell404 = -1;
        renderGameCells404();
    }

    function end404Game() {
        stop404Game();
        if (!gameNote404) return;
        if (gameScoreValue404 > gameBestValue404) {
            gameBestValue404 = gameScoreValue404;
            if (gameBest404) gameBest404.textContent = String(gameBestValue404);
            gameNote404.textContent = 'Новый рекорд! Шеф впечатлён!';
            gameNote404.className = 'game-note-404 good';
        } else {
            gameNote404.textContent = 'Раунд окончен. Попробуйте побить рекорд.';
            gameNote404.className = 'game-note-404 end';
        }
    }

    function start404Game() {
        stop404Game();
        gameTimer404 = 20;
        gameScoreValue404 = 0;
        if (gameTime404) gameTime404.textContent = String(gameTimer404);
        if (gameScore404) gameScore404.textContent = String(gameScoreValue404);
        if (gameNote404) {
            gameNote404.textContent = 'Наберите минимум 5 очков, чтобы открыть кнопку «На главную».';
            gameNote404.className = 'game-note-404';
        }
        updateHomeButton404();
        moveActiveCell404();
        gameMoveInterval404 = setInterval(moveActiveCell404, 650);
        gameTickInterval404 = setInterval(function () {
            gameTimer404 -= 1;
            if (gameTime404) gameTime404.textContent = String(gameTimer404);
            if (gameTimer404 <= 0) end404Game();
        }, 1000);
    }

    function reset404Game(keepNote) {
        stop404Game();
        gameTimer404 = 20;
        gameScoreValue404 = 0;
        if (gameTime404) gameTime404.textContent = String(gameTimer404);
        if (gameScore404) gameScore404.textContent = String(gameScoreValue404);
        updateHomeButton404();
        if (!keepNote && gameNote404) {
            gameNote404.textContent = 'Нажмите «Старт», затем наберите минимум 5 очков.';
            gameNote404.className = 'game-note-404';
        }
    }

    if (page === '404') {
        reset404Game(false);
    }

    if (startGame404Btn) {
        startGame404Btn.addEventListener('click', function (e) {
            e.preventDefault();
            start404Game();
        });
    }

    if (resetGame404Btn) {
        resetGame404Btn.addEventListener('click', function (e) {
            e.preventDefault();
            reset404Game(false);
        });
    }

    if (backToHomeBtn) {
        backToHomeBtn.addEventListener('click', function (e) {
            if (gameScoreValue404 < 5) {
                e.preventDefault();
                return;
            }
            window.location.href = base + 'index.html';
        });
    }

    if (catchGrid404) {
        catchGrid404.addEventListener('click', function (e) {
            const cell = e.target.closest('.catch-cell');
            if (!cell || gameActiveCell404 === -1) return;
            const cellIndex = Number(cell.dataset.cell);
            if (cellIndex === gameActiveCell404) {
                gameScoreValue404 += 1;
                if (gameScore404) gameScore404.textContent = String(gameScoreValue404);
                if (gameNote404) {
                    gameNote404.textContent = gameScoreValue404 >= 5
                        ? 'Отлично! Порог достигнут — кнопка «На главную» открыта.'
                        : 'Отлично! +1 очко';
                    gameNote404.className = 'game-note-404 good';
                }
                updateHomeButton404();
                moveActiveCell404();
            } else if (gameNote404) {
                gameNote404.textContent = 'Мимо! Ловите подсвеченную ячейку.';
                gameNote404.className = 'game-note-404';
            }
        });
    }

    /* Галерея */
    const galleryThumbs = [...document.querySelectorAll('.gallery-thumb')];
    const galleryHeroImg = document.getElementById('galleryHeroImg');
    const galleryViewport = document.getElementById('galleryViewport');
    const galleryPassTag = document.getElementById('galleryPassTag');
    const galleryPassTitle = document.getElementById('galleryPassTitle');
    const galleryPassDesc = document.getElementById('galleryPassDesc');
    const galleryPrev = document.getElementById('galleryPrev');
    const galleryNext = document.getElementById('galleryNext');
    const galleryCurrentEl = document.getElementById('galleryCurrent');
    const galleryTotalEl = document.getElementById('galleryTotal');
    const galleryCarousel = document.getElementById('galleryCarousel');
    const galleryProgressFill = document.getElementById('galleryProgressFill');
    let galleryIndex = 0;
    let galleryAutoTimer = null;
    let galleryProgressTimer = null;
    let galleryTouchStartX = 0;
    const gallerySlideDuration = 5500;

    if (galleryThumbs.length && galleryHeroImg) {
        if (galleryTotalEl) galleryTotalEl.textContent = String(galleryThumbs.length);

        function resetGalleryProgress() {
            if (!galleryProgressFill) return;
            if (galleryProgressTimer) {
                clearInterval(galleryProgressTimer);
                galleryProgressTimer = null;
            }
            galleryProgressFill.style.width = '0%';
            let elapsed = 0;
            galleryProgressTimer = setInterval(function () {
                elapsed += 100;
                galleryProgressFill.style.width = Math.min(100, (elapsed / gallerySlideDuration) * 100) + '%';
                if (elapsed >= gallerySlideDuration) {
                    clearInterval(galleryProgressTimer);
                    galleryProgressTimer = null;
                }
            }, 100);
        }

        function showGalleryDish(index) {
            galleryIndex = (index + galleryThumbs.length) % galleryThumbs.length;
            const thumb = galleryThumbs[galleryIndex];
            if (!thumb) return;

            galleryThumbs.forEach(function (item, i) {
                item.classList.toggle('active', i === galleryIndex);
            });

            if (galleryViewport) galleryViewport.classList.add('is-switching');

            window.setTimeout(function () {
                galleryHeroImg.src = thumb.dataset.full;
                galleryHeroImg.alt = thumb.dataset.title || 'Блюдо шефа';
                if (galleryPassTag) {
                    galleryPassTag.innerHTML = '<i class="fas ' + (thumb.dataset.icon || 'fa-utensils') + '"></i> ' + (thumb.dataset.tag || '');
                }
                if (galleryPassTitle) galleryPassTitle.textContent = thumb.dataset.title || '';
                if (galleryPassDesc) galleryPassDesc.textContent = thumb.dataset.desc || '';
                if (galleryViewport) galleryViewport.classList.remove('is-switching');
            }, 200);

            if (galleryCurrentEl) galleryCurrentEl.textContent = String(galleryIndex + 1);
            thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            resetGalleryProgress();
        }

        function nextGallerySlide() {
            showGalleryDish(galleryIndex + 1);
        }

        function prevGallerySlide() {
            showGalleryDish(galleryIndex - 1);
        }

        function startGalleryAuto() {
            stopGalleryAuto();
            galleryAutoTimer = setInterval(nextGallerySlide, gallerySlideDuration);
        }

        function stopGalleryAuto() {
            if (galleryAutoTimer) {
                clearInterval(galleryAutoTimer);
                galleryAutoTimer = null;
            }
            if (galleryProgressTimer) {
                clearInterval(galleryProgressTimer);
                galleryProgressTimer = null;
            }
        }

        function restartGalleryAuto() {
            stopGalleryAuto();
            startGalleryAuto();
        }

        galleryThumbs.forEach(function (thumb) {
            thumb.addEventListener('click', function (e) {
                e.stopPropagation();
                showGalleryDish(Number(thumb.dataset.index));
                restartGalleryAuto();
            });
        });

        if (galleryPrev) {
            galleryPrev.addEventListener('click', function (e) {
                e.stopPropagation();
                prevGallerySlide();
                restartGalleryAuto();
            });
        }

        if (galleryNext) {
            galleryNext.addEventListener('click', function (e) {
                e.stopPropagation();
                nextGallerySlide();
                restartGalleryAuto();
            });
        }

        if (galleryCarousel) {
            galleryCarousel.addEventListener('mouseenter', stopGalleryAuto);
            galleryCarousel.addEventListener('mouseleave', startGalleryAuto);
        }

        if (galleryViewport) {
            galleryViewport.addEventListener('touchstart', function (e) {
                galleryTouchStartX = e.changedTouches[0].clientX;
            }, { passive: true });

            galleryViewport.addEventListener('touchend', function (e) {
                const delta = e.changedTouches[0].clientX - galleryTouchStartX;
                if (Math.abs(delta) < 40) return;
                if (delta < 0) nextGallerySlide();
                else prevGallerySlide();
                restartGalleryAuto();
            }, { passive: true });
        }

        showGalleryDish(0);
        startGalleryAuto();
    }
})();
