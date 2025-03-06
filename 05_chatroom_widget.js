const chatroomWidget = {
    html: `
        <div class="chatroom-widget">
            <button class="chat-toggle" onclick="window.toggleChat()" title="Toggle Chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="button-text">Chatroom</span>
                <span class="unread-count" id="unreadCount"></span>
            </button>
            <div class="chat-container" id="chatContainer">
                <div class="chat-header">
                    <h3>SciBox Chat</h3>
                    <div class="chat-controls">
                        <button id="connectBtn">Connect Wallet</button>
                        <button id="initIrysBtn" disabled>Initialize</button>
                    </div>
                </div>
                <div class="chat-messages" id="chatMessages">
                    <div class="loading">Connect wallet to view messages...</div>
                </div>
                <div class="chat-input">
                    <textarea id="messageInput" placeholder="Type your message..." disabled></textarea>
                    <div class="button-group">
                        <button id="sendBtn" disabled>Send</button>
                        <button id="refreshBtn" disabled>Refresh</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    css: `
        .chatroom-widget {
            position: fixed;
            right: 30px;
            bottom: 100px;
            z-index: 1000;
        }

        .chat-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            padding: 8px 20px;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 6px rgba(74, 144, 226, 0.3);
            transition: all 0.2s ease;
            min-width: 140px;
            height: 36px;
        }

        .chat-toggle:hover {
            background: #357abd;
            transform: translateY(-1px);
            box-shadow: 0 4px 8px rgba(74, 144, 226, 0.4);
        }

        .chat-toggle svg {
            width: 20px;
            height: 20px;
        }

        .button-text {
            font-weight: normal;
            margin-left: 2px;
        }

        .unread-count {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #e53e3e;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            font-size: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            display: none;
        }

        .chat-container {
            position: absolute;
            bottom: 60px;
            right: 0;
            width: 320px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            display: none;
            overflow: hidden;
        }

        .chat-container.active {
            display: block;
        }

        .chat-header {
            padding: 15px;
            background: #f8f9fa;
            border-bottom: 1px solid #e2e8f0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .chat-header h3 {
            margin: 0;
            font-size: 16px;
            color: #2d3748;
        }

        .chat-controls {
            display: flex;
            gap: 8px;
        }

        .chat-controls button {
            padding: 6px 12px;
            font-size: 12px;
            border-radius: 4px;
            border: none;
            background: #4a90e2;
            color: white;
            cursor: pointer;
        }

        .chat-controls button:disabled {
            background: #cbd5e0;
            cursor: not-allowed;
        }

        .chat-messages {
            height: 300px;
            overflow-y: auto;
            padding: 15px;
            background: #fff;
        }

        .message {
            margin-bottom: 12px;
            padding: 8px;
            background: #f8f9fa;
            border-radius: 6px;
            font-size: 14px;
        }

        .message-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 4px;
            font-size: 12px;
            color: #718096;
        }

        .chat-input {
            padding: 10px;
            border-top: 1px solid #e2e8f0;
            background: #f8f9fa;
        }

        .chat-input textarea {
            width: 100%;
            height: 60px;
            padding: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 4px;
            resize: none;
            font-size: 14px;
            margin-bottom: 8px;
        }

        .button-group {
            display: flex;
            gap: 8px;
        }

        .button-group button {
            flex: 1;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            background: #4a90e2;
            color: white;
            cursor: pointer;
            font-size: 14px;
        }

        .button-group button:disabled {
            background: #cbd5e0;
            cursor: not-allowed;
        }

        @media (max-width: 768px) {
            .chat-container {
                width: 280px;
            }
            .button-text {
                display: none;
            }
            .chat-toggle {
                width: 36px;
                min-width: unset;
                padding: 8px;
                border-radius: 50%;
            }
            .chatroom-widget {
                right: 20px;
                bottom: 100px;
            }
        }
    `,
    js: `
        // Load Irys bundle script
        function loadIrysBundle() {
            return new Promise((resolve, reject) => {
                if (window.WebIrys) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://uploader.irys.xyz/Cip4wmuMv1K3bmcL4vYoZuV2aQQnnzViqwHm6PCei3QX/bundle.js';
                script.onload = () => {
                    console.log('Irys bundle loaded');
                    resolve();
                };
                script.onerror = () => reject(new Error('Failed to load Irys bundle'));
                document.head.appendChild(script);
            });
        }

        // Make functions globally accessible
        window.toggleChat = function() {
            const container = document.getElementById('chatContainer');
            container.classList.toggle('active');
            if (container.classList.contains('active')) {
                window.unreadCount = 0;
                updateUnreadCount();
            }
        };

        // Constants and Variables
        window.CHAT_TAG = { name: "App-Name", value: "SciBoxChat" };
        window.MESSAGE_TAG = { name: "Content-Type", value: "text/chat" };
        window.unreadCount = 0;
        window.wallet = null;
        window.irysUploader = null;
        window.refreshTimeout = null;
        window.lastMessageTime = Date.now();

        // Initialize chat functionality
        async function initializeChat() {
            try {
                // First ensure Irys bundle is loaded
                await loadIrysBundle();
                console.log('Starting chat initialization');

                return new Promise((resolve, reject) => {
                    const checkElements = () => {
                        const connectBtn = document.getElementById('connectBtn');
                        const initIrysBtn = document.getElementById('initIrysBtn');
                        const sendBtn = document.getElementById('sendBtn');
                        const refreshBtn = document.getElementById('refreshBtn');
                        const messageInput = document.getElementById('messageInput');

                        if (!connectBtn || !initIrysBtn || !sendBtn || !refreshBtn || !messageInput) {
                            console.log('Chat elements not found, retrying...');
                            setTimeout(checkElements, 100);
                            return;
                        }

                        // Remove existing listeners if any
                        const newConnectBtn = connectBtn.cloneNode(true);
                        const newInitIrysBtn = initIrysBtn.cloneNode(true);
                        const newSendBtn = sendBtn.cloneNode(true);
                        const newRefreshBtn = refreshBtn.cloneNode(true);
                        const newMessageInput = messageInput.cloneNode(true);

                        connectBtn.parentNode.replaceChild(newConnectBtn, connectBtn);
                        initIrysBtn.parentNode.replaceChild(newInitIrysBtn, initIrysBtn);
                        sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);
                        refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
                        messageInput.parentNode.replaceChild(newMessageInput, messageInput);

                        // Add event listeners
                        newConnectBtn.addEventListener('click', async () => {
                            try {
                                if (window.solana) {
                                    await window.solana.connect();
                                    window.wallet = window.solana;
                                    newConnectBtn.textContent = \`\${window.wallet.publicKey.toString().slice(0,4)}...\${window.wallet.publicKey.toString().slice(-4)}\`;
                                    newInitIrysBtn.disabled = false;
                                } else {
                                    alert('Please install Solana wallet (Phantom or OKX)');
                                }
                            } catch (error) {
                                console.error('Error connecting wallet:', error);
                                alert('Failed to connect wallet');
                            }
                        });

                        newInitIrysBtn.addEventListener('click', async () => {
                            if (!window.wallet) {
                                alert('Please connect wallet first');
                                return;
                            }

                            try {
                                newInitIrysBtn.textContent = '...';
                                window.irysUploader = await getIrysUploader();
                                newInitIrysBtn.textContent = '✓';
                                
                                newMessageInput.disabled = false;
                                newSendBtn.disabled = false;
                                newRefreshBtn.disabled = false;
                                
                                await displayMessages();
                                
                                // Start periodic refresh
                                setInterval(displayMessages, 30000);
                            } catch (error) {
                                console.error('Error initializing Irys:', error);
                                alert('Failed to initialize Irys');
                                newInitIrysBtn.textContent = 'Retry';
                            }
                        });

                        newSendBtn.addEventListener('click', async () => {
                            const message = newMessageInput.value.trim();
                            if (!message) return;

                            try {
                                newSendBtn.disabled = true;
                                newSendBtn.textContent = '...';
                                
                                await uploadMessage(message);
                                newMessageInput.value = '';
                                await displayMessages();
                                
                                newSendBtn.textContent = 'Send';
                                newSendBtn.disabled = false;
                            } catch (error) {
                                console.error('Error sending message:', error);
                                alert('Failed to send message');
                                newSendBtn.textContent = 'Send';
                                newSendBtn.disabled = false;
                            }
                        });

                        newRefreshBtn.addEventListener('click', async () => {
                            if (window.refreshTimeout) return;
                            
                            newRefreshBtn.disabled = true;
                            await displayMessages();
                            newRefreshBtn.disabled = false;
                            
                            window.refreshTimeout = setTimeout(() => {
                                window.refreshTimeout = null;
                            }, 5000);
                        });

                        newMessageInput.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                newSendBtn.click();
                            }
                        });

                        console.log('Chat initialized successfully');
                        resolve();
                    };

                    checkElements();
                });
            } catch (error) {
                console.error('Failed to initialize chat:', error);
                throw error;
            }
        }

        // Other functions remain the same but with window. prefix for global access
        window.updateUnreadCount = function() {
            const unreadElement = document.getElementById('unreadCount');
            if (window.unreadCount > 0) {
                unreadElement.style.display = 'flex';
                unreadElement.textContent = window.unreadCount > 9 ? '9+' : window.unreadCount;
            } else {
                unreadElement.style.display = 'none';
            }
        };

        // Get Irys uploader instance
        const getIrysUploader = async () => {
            if (!window.wallet) throw new Error("Wallet not connected");

            try {
                const originalSignMessage = window.solana.signMessage;
                window.solana.signMessage = async (msg) => {
                    const signedMessage = await originalSignMessage.call(window.solana, msg);
                    return signedMessage.signature || signedMessage;
                };

                const webSolana = await window.WebIrys.WebUploader(window.WebIrys.WebSolana).withProvider(window.solana);
                return webSolana;
            } catch (error) {
                console.error("Error connecting to Irys:", error);
                throw error;
            }
        };

        async function uploadMessage(message) {
            try {
                const tags = [
                    window.CHAT_TAG,
                    window.MESSAGE_TAG,
                    { name: "Unix-Time", value: Date.now().toString() },
                    { name: "User-Address", value: window.wallet.publicKey.toString() }
                ];

                const receipt = await window.irysUploader.upload(message, { tags });
                return receipt;
            } catch (error) {
                console.error("Error uploading message:", error);
                throw error;
            }
        }

        async function fetchMessages() {
            const query = \`
            query {
                transactions(
                    tags: [
                        { name: "App-Name", values: ["SciBoxChat"] },
                        { name: "Content-Type", values: ["text/chat"] }
                    ],
                    order: DESC,
                    limit: 50
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

            const data = await response.json();
            return data.data.transactions.edges;
        }

        async function displayMessages() {
            const chatMessages = document.getElementById('chatMessages');
            chatMessages.innerHTML = '<div class="loading">Loading messages...</div>';
            
            try {
                const messages = await fetchMessages();
                chatMessages.innerHTML = '';
                let newMessages = 0;

                for (const edge of messages) {
                    const id = edge.node.id;
                    const response = await fetch(\`https://gateway.irys.xyz/\${id}\`);
                    const content = await response.text();
                    
                    const tags = edge.node.tags;
                    const sender = tags.find(t => t.name === "User-Address")?.value || "Unknown";
                    const timestamp = parseInt(tags.find(t => t.name === "Unix-Time")?.value);
                    
                    if (timestamp > window.lastMessageTime) {
                        newMessages++;
                    }

                    const messageElement = document.createElement('div');
                    messageElement.className = 'message';
                    messageElement.innerHTML = \`
                        <div class="message-header">
                            <span class="sender">\${sender.slice(0,4)}...\${sender.slice(-4)}</span>
                            <span class="time">\${new Date(timestamp).toLocaleString()}</span>
                        </div>
                        <div class="message-content">\${sanitizeMessage(content)}</div>
                    \`;
                    
                    chatMessages.appendChild(messageElement);
                }

                if (!document.getElementById('chatContainer').classList.contains('active')) {
                    window.unreadCount += newMessages;
                    updateUnreadCount();
                }

                chatMessages.scrollTop = chatMessages.scrollHeight;
                window.lastMessageTime = Date.now();
            } catch (error) {
                chatMessages.innerHTML = '<div class="loading">Error loading messages. Please try again.</div>';
            }
        }

        function sanitizeMessage(message) {
            return message
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }

        // Initialize chat when script is loaded
        console.log('Chat widget script loaded, initializing...');
        initializeChat().then(() => {
            console.log('Chat widget fully initialized');
        }).catch(error => {
            console.error('Failed to initialize chat widget:', error);
        });
    `
};

module.exports = { chatroomWidget };
