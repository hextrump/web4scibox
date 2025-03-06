const titleWidget = {
    html: `
        <div class="scibox-title">
            <h1>SciBox</h1>
            <p class="subtitle">Decentralized Paper Repository</p>
        </div>
    `,
    css: `
        .scibox-title {
            text-align: center;
            padding: 40px 0;
            background: linear-gradient(135deg, #9EB644 0%, #C5E063 100%);
            color: white;
            border-radius: 8px;
            margin-bottom: 20px;
            box-shadow: 0 4px 12px rgba(158, 182, 68, 0.2);
        }
        .scibox-title h1 {
            font-size: 2.5em;
            margin: 0;
            font-weight: 700;
            text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.1);
            letter-spacing: 0.02em;
        }
        .subtitle {
            font-size: 1.2em;
            margin: 10px 0 0;
            opacity: 0.95;
            font-weight: 400;
            letter-spacing: 0.01em;
        }
    `,
    js: ``  // No JavaScript needed for the title widget
};

module.exports = { titleWidget }; 