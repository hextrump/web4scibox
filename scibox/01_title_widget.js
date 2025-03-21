const titleWidget = {
    html: `
        <div class="scibox-title">
            <div class="title-content">
                <h1 class="title">SciBox</h1>
                <p class="subtitle">Decentralized and permanent storage for open science.</p>
                <p class="tagline">Publish your paper permanently, right from your computer.</p>
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                            </svg>
                        </div>
                        <div class="feature-content">
                            <h3>Permanent Storage</h3>
                            <p>Your papers are stored permanently on the Arweave network, ensuring they remain accessible for generations to come.</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            </svg>
                        </div>
                        <div class="feature-content">
                            <h3>Secure & Decentralized</h3>
                            <p>Built on blockchain technology, your research is distributed across a global network, making it tamper-proof and censorship-resistant.</p>
                        </div>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                            </svg>
                        </div>
                        <div class="feature-content">
                            <h3>Fast Upload</h3>
                            <p>Experience lightning-fast uploads with our optimized infrastructure, making paper sharing as quick as a click.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="title-decoration">
                <div class="gradient-sphere"></div>
                <div class="grid-pattern"></div>
                <div class="particles-container"></div>
                <div class="glow-effect"></div>
            </div>
        </div>
    `,
    css: `
        .scibox-title {
            text-align: center;
            padding: 120px 0;
            background: var(--bg-secondary-dark);
            color: var(--text-primary-dark);
            border-radius: var(--border-radius);
            margin-bottom: 30px;
            box-shadow: var(--card-shadow);
            position: relative;
            overflow: hidden;
            border: 1px solid var(--border-dark);
            transition: all var(--transition-speed);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        body.light-theme .scibox-title {
            background: var(--bg-light);
            border-color: var(--border-light);
            color: var(--text-primary-light);
        }

        .title-content {
            position: relative;
            z-index: 2;
            padding: 0 20px;
            animation: contentFadeIn 1s ease-out forwards;
        }

        @keyframes contentFadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .title {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 5em;
            font-weight: 700;
            margin: 0;
            background: linear-gradient(135deg, 
                var(--gradient-start) 0%,
                var(--gradient-mid) 50%,
                var(--gradient-end) 100%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            letter-spacing: -0.02em;
            line-height: 1.2;
            position: relative;
            animation: gradientFlow 8s linear infinite;
            background-size: 200% auto;
            text-shadow: 0 0 30px rgba(99, 102, 241, 0.3);
        }

        .title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 100px;
            height: 4px;
            background: linear-gradient(90deg,
                transparent 0%,
                var(--gradient-mid) 50%,
                transparent 100%);
            animation: lineWidth 3s ease-in-out infinite;
        }

        @keyframes lineWidth {
            0%, 100% { width: 100px; opacity: 0.5; }
            50% { width: 150px; opacity: 1; }
        }

        .subtitle {
            font-size: 1.8em;
            margin: 35px 0 0;
            font-weight: 500;
            letter-spacing: -0.01em;
            color: var(--text-secondary-dark);
            line-height: 1.4;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out forwards 0.3s;
        }

        .tagline {
            font-size: 1.2em;
            margin: 20px 0 0;
            color: var(--text-secondary-dark);
            opacity: 0;
            line-height: 1.5;
            animation: fadeInUp 0.8s ease-out forwards 0.6s;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 0.8;
                transform: translateY(0);
            }
        }

        .features-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            margin-top: 80px;
            padding: 0 20px;
            opacity: 0;
            animation: fadeInUp 0.8s ease-out forwards 0.9s;
        }

        .feature-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 40px 30px;
            background: linear-gradient(135deg,
                rgba(67, 56, 202, 0.1) 0%,
                rgba(99, 102, 241, 0.1) 50%,
                rgba(139, 92, 246, 0.1) 100%);
            border-radius: 24px;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--border-dark);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            position: relative;
            overflow: hidden;
        }

        .feature-item::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg,
                rgba(99, 102, 241, 0) 0%,
                rgba(139, 92, 246, 0.1) 50%,
                rgba(99, 102, 241, 0) 100%);
            transform: translateX(-100%);
            transition: transform 0.5s ease;
        }

        .feature-item:hover::before {
            transform: translateX(100%);
        }

        .feature-item:hover {
            transform: translateY(-8px) scale(1.02);
            background: linear-gradient(135deg,
                rgba(67, 56, 202, 0.15) 0%,
                rgba(99, 102, 241, 0.15) 50%,
                rgba(139, 92, 246, 0.15) 100%);
            border-color: var(--accent-dark);
            box-shadow: 
                0 10px 40px -10px rgba(99, 102, 241, 0.3),
                0 0 20px -5px rgba(99, 102, 241, 0.2);
        }

        .feature-icon {
            width: 70px;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg,
                rgba(99, 102, 241, 0.15) 0%,
                rgba(139, 92, 246, 0.15) 100%);
            border-radius: 50%;
            margin-bottom: 25px;
            color: var(--accent-dark);
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        .feature-icon::after {
            content: '';
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            border: 2px solid transparent;
            background: linear-gradient(135deg,
                var(--gradient-start) 0%,
                var(--gradient-end) 100%) border-box;
            -webkit-mask: 
                linear-gradient(#fff 0 0) padding-box,
                linear-gradient(#fff 0 0);
            -webkit-mask-composite: destination-out;
            mask-composite: exclude;
            animation: rotate 4s linear infinite;
        }

        @keyframes rotate {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        .feature-item:hover .feature-icon {
            transform: scale(1.1) rotate(5deg);
            background: linear-gradient(135deg,
                rgba(99, 102, 241, 0.2) 0%,
                rgba(139, 92, 246, 0.2) 100%);
            box-shadow: 
                0 0 20px rgba(99, 102, 241, 0.3),
                0 0 60px rgba(99, 102, 241, 0.1);
        }

        .feature-content h3 {
            font-size: 1.3em;
            font-weight: 600;
            margin: 0 0 15px 0;
            color: var(--text-primary-dark);
            position: relative;
            display: inline-block;
        }

        .feature-content h3::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 2px;
            background: var(--gradient-mid);
            transition: width 0.3s ease;
        }

        .feature-item:hover .feature-content h3::after {
            width: 100%;
        }

        .feature-content p {
            font-size: 1em;
            line-height: 1.6;
            color: var(--text-secondary-dark);
            margin: 0;
            transition: all 0.3s ease;
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

        .gradient-sphere {
            position: absolute;
            width: 500px;
            height: 500px;
            right: -200px;
            top: -200px;
            background: radial-gradient(
                circle at center,
                var(--gradient-mid) 0%,
                transparent 70%
            );
            opacity: 0.15;
            filter: blur(60px);
            animation: spherePulse 8s ease-in-out infinite;
        }

        @keyframes spherePulse {
            0%, 100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.15;
            }
            50% { 
                transform: translate(30px, 30px) scale(1.1);
                opacity: 0.2;
            }
        }

        .grid-pattern {
            position: absolute;
            width: 200%;
            height: 200%;
            top: -50%;
            left: -50%;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 24px 24px;
            opacity: 0.05;
            transform: perspective(1000px) rotateX(60deg) scale(2);
            transform-origin: center center;
            animation: gridFloat 20s linear infinite;
        }

        @keyframes gridFloat {
            0% { transform: perspective(1000px) rotateX(60deg) translateY(0) scale(2); }
            100% { transform: perspective(1000px) rotateX(60deg) translateY(50%) scale(2); }
        }

        .particles-container {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
        }

        .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: var(--accent-dark);
            border-radius: 50%;
            opacity: 0;
            filter: blur(1px);
            animation: particleFloat 15s infinite linear;
        }

        .glow-effect {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(
                circle at 50% 50%,
                rgba(129, 140, 248, 0.1) 0%,
                transparent 70%
            );
            animation: glowPulse 4s ease-in-out infinite;
            mix-blend-mode: screen;
        }

        @keyframes gradientFlow {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes glowPulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.8; }
        }

        @media (max-width: 768px) {
            .scibox-title {
                padding: 80px 20px;
            }

            .title {
                font-size: 3em;
            }

            .subtitle {
                font-size: 1.4em;
            }

            .tagline {
                font-size: 1.1em;
            }

            .features-grid {
                grid-template-columns: 1fr;
                gap: 25px;
                margin-top: 50px;
            }

            .feature-item {
                padding: 30px 20px;
            }

            .gradient-sphere {
                width: 300px;
                height: 300px;
                right: -100px;
                top: -100px;
            }
        }

        body.light-theme .subtitle,
        body.light-theme .tagline {
            color: var(--text-primary-light);
            opacity: 0.9;
        }

        body.light-theme .feature-content h3 {
            color: var(--text-primary-light);
        }

        body.light-theme .feature-content p {
            color: var(--text-secondary-light);
        }

        body.light-theme .feature-item {
            background: linear-gradient(135deg,
                rgba(67, 56, 202, 0.05) 0%,
                rgba(99, 102, 241, 0.05) 50%,
                rgba(139, 92, 246, 0.05) 100%);
            border-color: var(--border-light);
        }

        body.light-theme .feature-item:hover {
            background: linear-gradient(135deg,
                rgba(67, 56, 202, 0.1) 0%,
                rgba(99, 102, 241, 0.1) 50%,
                rgba(139, 92, 246, 0.1) 100%);
            border-color: var(--accent-light);
            box-shadow: 
                0 10px 40px -10px rgba(99, 102, 241, 0.2),
                0 0 20px -5px rgba(99, 102, 241, 0.1);
        }

        body.light-theme .feature-icon {
            color: var(--accent-light);
            background: linear-gradient(135deg,
                rgba(99, 102, 241, 0.1) 0%,
                rgba(139, 92, 246, 0.1) 100%);
        }

        body.light-theme .feature-item:hover .feature-icon {
            background: linear-gradient(135deg,
                rgba(99, 102, 241, 0.15) 0%,
                rgba(139, 92, 246, 0.15) 100%);
            box-shadow: 
                0 0 20px rgba(99, 102, 241, 0.2),
                0 0 60px rgba(99, 102, 241, 0.1);
        }

        body.light-theme .grid-pattern {
            background-image: 
                linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
            opacity: 0.1;
        }

        body.light-theme .particle {
            background: var(--accent-light);
        }

        body.light-theme .glow-effect {
            background: radial-gradient(
                circle at 50% 50%,
                rgba(99, 102, 241, 0.08) 0%,
                transparent 70%
            );
        }
    `,
    js: `
        // 创建粒子效果
        function createParticles() {
            const container = document.querySelector('.particles-container');
            const particleCount = 20;

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                
                // 随机起始位置
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                
                // 随机移动距离
                particle.style.setProperty('--tx', (Math.random() - 0.5) * 200 + 'px');
                particle.style.setProperty('--ty', (Math.random() - 0.5) * 200 + 'px');
                
                // 随机动画延迟
                particle.style.animationDelay = Math.random() * 5 + 's';
                
                container.appendChild(particle);
            }
        }

        // 初始化
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
        });
    `
};

module.exports = { titleWidget }; 