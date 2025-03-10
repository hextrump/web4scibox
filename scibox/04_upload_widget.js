const uploadWidget = {
    html: `
        <div class="upload-widget">
            <button onclick="openUploader()" class="upload-button" title="Upload Paper">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span class="button-text">Upload PDF</span>
            </button>
        </div>
    `,
    css: `
        .upload-widget {
            position: fixed;
            right: 30px;
            bottom: 30px;
            z-index: 1000;
        }
        .upload-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 20px;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(74, 144, 226, 0.3);
            transition: all 0.3s ease;
        }
        .upload-button:hover {
            background: #357abd;
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(74, 144, 226, 0.4);
        }
        .upload-button svg {
            transition: transform 0.2s ease;
        }
        .upload-button:hover svg {
            transform: translateY(-2px);
        }
        .button-text {
            margin-left: 4px;
        }
        @media (max-width: 768px) {
            .upload-widget {
                right: 16px;
                bottom: 16px;
            }
            .upload-button {
                width: 48px;
                height: 48px;
                padding: 12px;
                border-radius: 50%;
                justify-content: center;
            }
            .button-text {
                display: none;
            }
            .upload-button svg {
                margin: 0;
            }
        }
    `,
    js: `
        function openUploader() {
            window.open('https://uploader.irys.xyz/28CMUfviKfsEquZ9YCwxwPvJoUMujDLEJvqsuhcBXRQL/index.html', '_blank');
        }
    `
};

module.exports = { uploadWidget };
