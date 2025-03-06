const layoutContent = {
    html: `
        <div class="layout-container">
            <div id="title-container">
                <!-- Title widget will be loaded here -->
            </div>
            <div id="search-container">
                <!-- Search widget will be loaded here -->
            </div>
            <div id="latest-papers-container">
                <!-- Latest papers widget will be loaded here -->
            </div>
            <div id="chat-container">
                <!-- Chat widget will be loaded here -->
            </div>
            <div id="upload-container">
                <!-- Upload widget will be loaded here -->
            </div>
        </div>
    `,
    css: `
        .layout-container {
            width: 100%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        #title-container {
            margin-bottom: 30px;
        }
        #search-container {
            margin-bottom: 20px;
        }
        #latest-papers-container {
            margin-bottom: 40px;
        }
    `,
    js: `
        // Load Irys bundle script and initialize widgets after it's loaded
        function loadIrysAndInitialize() {
            return new Promise((resolve, reject) => {
                const irysScript = document.createElement('script');
                irysScript.src = 'https://uploader.irys.xyz/Cip4wmuMv1K3bmcL4vYoZuV2aQQnnzViqwHm6PCei3QX/bundle.js';
                irysScript.onload = () => resolve();
                irysScript.onerror = () => reject(new Error('Failed to load Irys bundle'));
                document.head.appendChild(irysScript);
            });
        }

        async function loadWidget(containerId, widgetType) {
            const query = \`
                query {
                    transactions(
                        tags: [
                            { name: "Content-Type", values: ["application/json"] },
                            { name: "scinet", values: ["\${widgetType}"] },
                            { name: "Version", values: ["0.1.1"] }
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

            try {
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

        // Initialize everything in the correct order
        async function initialize() {
            try {
                // First load Irys bundle
                await loadIrysAndInitialize();
                console.log('Irys bundle loaded successfully');

                // Then load widgets in sequence
                await loadWidget('title-container', 'title');
                await loadWidget('search-container', 'search');
                await loadWidget('latest-papers-container', 'latest-papers');
                await loadWidget('chat-container', 'chat');
                await loadWidget('upload-container', 'upload');
                
                console.log('All widgets loaded successfully');
            } catch (error) {
                console.error('Initialization error:', error);
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