const chatroomWidget = {
    html: `
        <div class="chatroom-widget">
            <button class="chat-toggle" onclick="window.openChatroom()" title="Open Chatroom">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                <span class="button-text">Chatroom</span>
            </button>
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
            padding: 12px 24px;
            background: linear-gradient(135deg, var(--gradient-start) 0%, var(--gradient-mid) 50%, var(--gradient-end) 100%);
            color: white;
            border: none;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            min-width: 140px;
            height: 44px;
            position: relative;
            overflow: hidden;
        }

        .chat-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .chat-toggle svg {
            width: 20px;
            height: 20px;
        }

        .button-text {
            font-weight: 500;
            margin-left: 2px;
        }

        @media (max-width: 768px) {
            .chatroom-widget {
                right: 16px;
                bottom: 80px;
            }
            .chat-toggle {
                width: 48px;
                height: 48px;
                min-width: unset;
                padding: 12px;
                border-radius: 50%;
                justify-content: center;
            }
            .button-text {
                display: none;
            }
            .chat-toggle svg {
                margin: 0;
            }
        }
    `,
    js: `
        // Make function globally accessible
        window.openChatroom = function() {
            window.open('https://uploader.irys.xyz/CuTqKCLYvoFnYvSrFkorpKT9WVuMhFNXbVmFZNjzFDMb', '_blank');
        };

        // Initialize when script is loaded
        console.log('Chatroom button widget loaded');
    `
};

module.exports = { chatroomWidget };
