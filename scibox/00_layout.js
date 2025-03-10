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
        :root {
            /* Light theme */
            --bg-light: #ffffff;
            --bg-secondary-light: #f8f9fa;
            --text-primary-light: #1a1a1a;
            --text-secondary-light: #4a5568;
            --accent-light: #3182ce;
            --border-light: #e2e8f0;
            --shadow-light: rgba(0, 0, 0, 0.1);
            
            /* Dark theme */
            --bg-dark: #0A192F;
            --bg-secondary-dark: #112240;
            --text-primary-dark: #CCD6F6;
            --text-secondary-dark: #8892B0;
            --accent-dark: #64FFDA;
            --border-dark: rgba(255, 255, 255, 0.1);
            --shadow-dark: rgba(0, 0, 0, 0.2);

            /* Common variables */
            --container-width: 1200px;
            --transition-speed: 0.3s;
        }

        body {
            margin: 0;
            padding: 0;
            background: var(--bg-light);
            color: var(--text-primary-light);
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            line-height: 1.6;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            transition: background-color var(--transition-speed), color var(--transition-speed);
        }

        body.dark-theme {
            background: var(--bg-dark);
            color: var(--text-primary-dark);
        }

        .layout-container {
            width: 100%;
            max-width: var(--container-width);
            margin: 0 auto;
            padding: 20px;
            box-sizing: border-box;
            min-height: 100vh;
            position: relative;
        }

        #main-container {
            padding: 20px 0;
        }

        .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .theme-toggle button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            color: var(--text-primary-light);
            transition: background-color 0.3s;
        }

        .dark-theme .theme-toggle button {
            color: var(--text-primary-dark);
        }

        .theme-toggle button:hover {
            background-color: var(--bg-secondary-light);
        }

        .dark-theme .theme-toggle button:hover {
            background-color: var(--bg-secondary-dark);
        }

        .sun-icon {
            display: block;
        }

        .moon-icon {
            display: none;
        }

        .dark-theme .sun-icon {
            display: none;
        }

        .dark-theme .moon-icon {
            display: block;
        }

        @media (max-width: 768px) {
            .layout-container {
                padding: 15px;
            }

            #main-container {
                padding: 15px 0;
            }

            .theme-toggle {
                top: 15px;
                right: 15px;
            }
        }
    `,
    js: `
        // Theme toggle functionality
        function initTheme() {
            const themeToggle = document.getElementById('themeToggle');
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const savedTheme = localStorage.getItem('theme');
            
            if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                document.body.classList.add('dark-theme');
            }

            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                const isDark = document.body.classList.contains('dark-theme');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
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
                const query = \`
                    query {
                        transactions(
                            tags: [
                                { name: "Content-Type", values: ["application/json"] },
                                { name: "scinet", values: ["\${widgetType}"] },
                                { name: "Version", values: ["0.1.2"] }
                            ],
                            first: 1,
                            order: DESC
                        ) {
                            edges {
                                node {
                                    id
                                    tags {
                                        name
                                        value
                                    }
                                }
                            }
                        }
                    }\`;

                const response = await fetch('https://uploader.irys.xyz/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                const result = await response.json();
                if (result.data?.transactions?.edges?.length > 0) {
                    const layoutId = result.data.transactions.edges[0].node.id;
                    const layoutResponse = await fetch(\`https://gateway.irys.xyz/\${layoutId}\`);
                    const layout = await layoutResponse.json();
                    applyWidget(containerId, layout);
                }
            } catch (error) {
                console.error(\`Error loading \${widgetType} widget:\`, error);
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