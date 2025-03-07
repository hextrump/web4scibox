const titleWidget = {
    html: `
        <div class="scibox-title">
            <div class="title-content">
                <h1 class="pixel-title">SciBox</h1>
                <p class="subtitle">Decentralized and permanent storage for open science.</p>
                <p class="tagline">Publish your paper permanently, right from your computer.</p>
            </div>
            <div class="title-decoration">
                <div class="pixel-sphere"></div>
                <div class="pixel-grid"></div>
            </div>
        </div>
    `,
    css: `
        @font-face {
            font-family: 'Pixel';
            src: url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        }

        .scibox-title {
            text-align: center;
            padding: 60px 0;
            background: var(--bg-secondary-light);
            color: var(--text-primary-light);
            border-radius: 24px;
            margin-bottom: 30px;
            box-shadow: 0 8px 32px var(--shadow-light);
            position: relative;
            overflow: hidden;
            border: 1px solid var(--border-light);
            transition: all var(--transition-speed);
            image-rendering: pixelated;
        }

        .dark-theme .scibox-title {
            background: var(--bg-secondary-dark);
            color: var(--text-primary-dark);
            box-shadow: 0 8px 32px var(--shadow-dark);
            border-color: var(--border-dark);
        }

        .title-content {
            position: relative;
            z-index: 2;
            padding: 0 20px;
        }

        .pixel-title {
            font-family: 'Press Start 2P', monospace;
            font-size: 4em;
            margin: 0;
            font-weight: 800;
            color: transparent;
            background: linear-gradient(135deg, 
                var(--accent-light) 0%, 
                #4299e1 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 2px 2px 0px var(--shadow-light),
                         4px 4px 0px rgba(0,0,0,0.1);
            letter-spacing: 0.1em;
            transform: translateZ(0);
            transition: all var(--transition-speed);
            animation: glitch 3s infinite;
        }

        .dark-theme .pixel-title {
            background: linear-gradient(135deg, 
                var(--accent-dark) 0%, 
                #38b2ac 100%);
            -webkit-background-clip: text;
            background-clip: text;
            text-shadow: 2px 2px 0px var(--shadow-dark),
                         4px 4px 0px rgba(255,255,255,0.1);
        }

        .subtitle {
            font-size: 1.4em;
            margin: 25px 0 0;
            font-weight: 500;
            letter-spacing: 0.03em;
            color: var(--text-secondary-light);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            transition: color var(--transition-speed);
        }

        .tagline {
            font-size: 1.1em;
            margin: 15px 0 0;
            color: var(--text-secondary-light);
            opacity: 0.8;
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            transition: color var(--transition-speed);
        }

        .dark-theme .subtitle,
        .dark-theme .tagline {
            color: var(--text-secondary-dark);
        }

        .title-decoration {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            overflow: hidden;
            pointer-events: none;
        }

        .pixel-sphere {
            position: absolute;
            width: 160px;
            height: 160px;
            right: -40px;
            top: -40px;
            background: 
                conic-gradient(
                    from 0deg,
                    var(--accent-light) 0%,
                    transparent 25%,
                    transparent 50%,
                    var(--accent-light) 75%
                );
            opacity: 0.15;
            clip-path: polygon(
                0% 25%, 25% 0%, 75% 0%, 100% 25%,
                100% 75%, 75% 100%, 25% 100%, 0% 75%
            );
            animation: pixelRotate 8s steps(12) infinite;
            transition: background var(--transition-speed);
        }

        .dark-theme .pixel-sphere {
            background: 
                conic-gradient(
                    from 0deg,
                    var(--accent-dark) 0%,
                    transparent 25%,
                    transparent 50%,
                    var(--accent-dark) 75%
                );
        }

        .pixel-grid {
            position: absolute;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(var(--accent-light) 1px, transparent 1px),
                linear-gradient(90deg, var(--accent-light) 1px, transparent 1px);
            background-size: 16px 16px;
            opacity: 0.05;
            transform: perspective(500px) rotateX(60deg);
            animation: gridScroll 20s linear infinite;
            transition: background var(--transition-speed);
        }

        .dark-theme .pixel-grid {
            background-image: 
                linear-gradient(var(--accent-dark) 1px, transparent 1px),
                linear-gradient(90deg, var(--accent-dark) 1px, transparent 1px);
        }

        @keyframes glitch {
            0%, 100% { transform: translate(0); }
            98% { transform: translate(0); }
            99% { transform: translate(-2px, 2px); }
            99.5% { transform: translate(2px, -2px); }
        }

        @keyframes pixelRotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        @keyframes gridScroll {
            0% { background-position: 0 0; }
            100% { background-position: 0 100%; }
        }

        @media (max-width: 768px) {
            .scibox-title {
                padding: 40px 20px;
                border-radius: 16px;
            }

            .pixel-title {
                font-size: 2.5em;
            }

            .subtitle {
                font-size: 1.1em;
                margin-top: 20px;
            }

            .tagline {
                font-size: 0.9em;
            }

            .pixel-sphere {
                width: 120px;
                height: 120px;
                right: -30px;
                top: -30px;
            }
        }
    `,
    js: `
        // Load pixel font
        const pixelFont = document.createElement('link');
        pixelFont.rel = 'stylesheet';
        pixelFont.href = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap';
        document.head.appendChild(pixelFont);
    `
};

module.exports = { titleWidget }; 