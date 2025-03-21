const layoutContent = {
    html: `
        <div class="layout-container">
            <div class="theme-toggle">
                <button id="themeToggle" aria-label="Toggle theme">
                    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                    </svg>
                </button>
            </div>
            <div class="background-decoration">
                <div class="gradient-overlay"></div>
                <div class="mesh-grid"></div>
            </div>
            <div id="title-container"></div>
            <div id="main-container">
                <div id="search-container"></div>
                <div id="latest-papers-container"></div>
            </div>
            <div id="upload-container"></div>
            <div id="chatroom-container"></div>
        </div>
    `,
    css: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

        :root {
            /* Light theme */
            --bg-light: #ffffff;
            --bg-secondary-light: #f8f9fa;
            --text-primary-light: #1a1a1a;
            --text-secondary-light: #4a5568;
            --accent-light: #6366f1;
            --accent-hover-light: #4f46e5;
            --border-light: #e2e8f0;
            --shadow-light: rgba(0, 0, 0, 0.1);
            
            /* Dark theme */
            --bg-dark: #0a0b14;
            --bg-secondary-dark: #12141a;
            --text-primary-dark: #ffffff;
            --text-secondary-dark: #a0aec0;
            --accent-dark: #818cf8;
            --accent-hover-dark: #6366f1;
            --border-dark: rgba(255, 255, 255, 0.05);
            --shadow-dark: rgba(0, 0, 0, 0.3);

            /* Gradient Colors */
            --gradient-start: #4338ca;
            --gradient-mid: #6366f1;
            --gradient-end: #8b5cf6;
            
            /* Common variables */
            --container-width: 1200px;
            --transition-speed: 0.5s;
            --border-radius: 12px;
            --card-shadow: 0 4px 6px -1px var(--shadow-light);
            --card-shadow-hover: 0 8px 16px var(--shadow-light);
        }

        body {
            margin: 0;
            padding: 0;
            background: var(--bg-dark);
            color: var(--text-primary-dark);
            font-family: 'Space Grotesk', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            transition: background-color var(--transition-speed), color var(--transition-speed);
            min-height: 100vh;
            position: relative;
            overflow-x: hidden;
        }

        body.light-theme {
            background: var(--bg-light);
            color: var(--text-primary-light);
        }

        .background-decoration {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            overflow: hidden;
            transition: opacity var(--transition-speed);
        }

        .gradient-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 0% 0%, var(--gradient-start) 0%, transparent 50%),
                radial-gradient(circle at 100% 0%, var(--gradient-end) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, var(--gradient-mid) 0%, transparent 70%);
            opacity: 0.15;
            mix-blend-mode: screen;
            transition: opacity var(--transition-speed);
        }

        .light-theme .gradient-overlay {
            opacity: 0.1;
            background: 
                radial-gradient(circle at 0% 0%, var(--accent-light) 0%, transparent 50%),
                radial-gradient(circle at 100% 0%, var(--accent-hover-light) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, var(--accent-light) 0%, transparent 70%);
        }

        .mesh-grid {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
                linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
            background-size: 32px 32px;
            transform: perspective(1000px) rotateX(60deg) scale(2);
            transform-origin: center top;
            opacity: 0.1;
            transition: opacity var(--transition-speed);
        }

        .light-theme .mesh-grid {
            background-image: 
                linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
            opacity: 0.05;
        }

        .layout-container {
            width: 100%;
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
            min-height: 100vh;
            position: relative;
            z-index: 1;
        }

        #main-container {
            padding: 20px 0;
            position: relative;
        }

        .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .theme-toggle button {
            background: rgba(18, 20, 26, 0.8);
            border: 1px solid var(--border-dark);
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            color: var(--text-primary-dark);
            transition: all var(--transition-speed);
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .light-theme .theme-toggle button {
            background: rgba(255, 255, 255, 0.8);
            border-color: var(--border-light);
            color: var(--text-primary-light);
        }

        .theme-toggle button:hover {
            transform: scale(1.05);
            background: var(--gradient-mid);
            border-color: transparent;
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
            color: white;
        }

        .light-theme .theme-toggle button:hover {
            background: var(--accent-light);
            box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
        }

        .sun-icon {
            display: none;
        }

        .moon-icon {
            display: block;
        }

        .light-theme .sun-icon {
            display: block;
        }

        .light-theme .moon-icon {
            display: none;
        }

        @media (max-width: 768px) {
            .layout-container {
                padding: 16px;
            }

            #main-container {
                padding: 16px 0;
            }

            .theme-toggle {
                top: 16px;
                right: 16px;
            }

            .theme-toggle button {
                width: 36px;
                height: 36px;
            }
        }

        .error-message {
            padding: 16px;
            margin: 16px 0;
            background: rgba(18, 20, 26, 0.8);
            border: 1px solid #ef4444;
            border-radius: var(--border-radius);
            color: var(--text-primary-dark);
            font-size: 14px;
            line-height: 1.5;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
        }

        .light-theme .error-message {
            background: rgba(255, 255, 255, 0.8);
            color: var(--text-primary-light);
        }

        @keyframes fadeIn {
            from { 
                opacity: 0; 
                transform: translateY(20px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }

        .fade-in {
            animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
    `,
    js: `
        // Theme toggle functionality
        function initTheme() {
            const themeToggle = document.getElementById('themeToggle');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const savedTheme = localStorage.getItem('theme');
            
            // 默认使用暗色主题
            if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
                document.body.classList.add('light-theme');
            }

            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('light-theme');
                const isLight = document.body.classList.contains('light-theme');
                localStorage.setItem('theme', isLight ? 'light' : 'dark');
            });
        }

        // Initialize components
        async function initialize() {
            try {
                initTheme();
                
                // Load components
                const components = [
                    { id: 'title-container', type: 'title' },
                    { id: 'search-container', type: 'search' },
                    { id: 'latest-papers-container', type: 'latest-papers' },
                    { id: 'upload-container', type: 'upload' },
                    { id: 'chatroom-container', type: 'chatroom' }
                ];

                for (const component of components) {
                    await loadWidget(component.id, component.type);
                }
                
                console.log('All components loaded successfully');
            } catch (error) {
                console.error('Initialization error:', error);
            }
        }

        // Load widget function
        async function loadWidget(containerId, widgetType) {
            try {
                const query = 'query GetWidget { transactions(tags: [{ name: "Content-Type", values: ["application/json"] }, { name: "scinet", values: ["' + widgetType + '"] }, { name: "Version", values: ["0.1.4"] }], owners: ["A5Hzm1b3mtQfYfU6q5qvKeVJmoaReCvthwfHuZkBBdAQ"], limit: 1, order: DESC) { edges { node { id address tags { name value } } } } }';

                const response = await fetch('https://uploader.irys.xyz/graphql', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ query })
                });

                const result = await response.json();

                if (result.errors) {
                    throw new Error(JSON.stringify(result.errors));
                }

                if (result.data?.transactions?.edges?.length > 0) {
                    const edge = result.data.transactions.edges[0];
                    if (edge.node.address === 'A5Hzm1b3mtQfYfU6q5qvKeVJmoaReCvthwfHuZkBBdAQ') {
                        const layoutId = edge.node.id;
                        const layoutResponse = await fetch(\`https://gateway.irys.xyz/\${layoutId}\`);
                        const layout = await layoutResponse.json();
                        applyWidget(containerId, layout);
                    } else {
                        throw new Error(\`Invalid owner for \${widgetType} widget\`);
                    }
                }
            } catch (error) {
                console.error(\`Error loading \${widgetType} widget:\`, error);
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = \`<div class="error-message">Error: Unable to load \${widgetType} component</div>\`;
                }
            }
        }

        // Apply widget function
        function applyWidget(containerId, widget) {
            const container = document.getElementById(containerId);
            
            if (widget.html) {
                container.innerHTML = widget.html;
            }
            
            if (widget.css) {
                const style = document.createElement('style');
                style.textContent = widget.css;
                document.head.appendChild(style);
            }
            
            if (widget.js) {
                const script = document.createElement('script');
                script.textContent = widget.js;
                document.body.appendChild(script);
            }
        }

        // Start initialization when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
    `
};

module.exports = { layoutContent }; 