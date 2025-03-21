const latestPapersWidget = {
    html: `
        <div class="latest-papers-widget">
            <div class="section-header">
                <h2>Latest Papers</h2>
                <div class="loading-indicator">
                    <div class="spinner"></div>
                </div>
            </div>
            <div id="latestPapersList" class="papers-list">
                <!-- Latest papers will be displayed here -->
            </div>
        </div>
    `,
    css: `
        .latest-papers-widget {
            margin-bottom: 30px;
            width: 100%;
        }

        .section-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 24px;
        }

        .section-header h2 {
            font-size: 1.5em;
            font-weight: 600;
            color: var(--text-primary-dark);
            margin: 0;
        }

        body.light-theme .section-header h2 {
            color: var(--text-primary-light);
        }

        .loading-indicator {
            display: none;
        }

        .loading-indicator.active {
            display: block;
        }

        .spinner {
            width: 24px;
            height: 24px;
            border: 2px solid var(--border-dark);
            border-top-color: var(--accent-dark);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        body.light-theme .spinner {
            border-color: var(--border-light);
            border-top-color: var(--accent-light);
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .papers-list {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .paper-item {
            background: var(--bg-secondary-dark);
            border: 1px solid var(--border-dark);
            border-radius: var(--border-radius);
            padding: 24px;
            transition: all var(--transition-speed);
            animation: fadeIn 0.5s ease forwards;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        body.light-theme .paper-item {
            background: var(--bg-light);
            border-color: var(--border-light);
        }

        .paper-item:hover {
            transform: translateY(-2px);
            box-shadow: var(--card-shadow-hover);
        }

        .paper-item h3 {
            color: var(--text-primary-dark);
            margin: 0;
            font-size: 1.25em;
            font-weight: 600;
            line-height: 1.4;
        }

        body.light-theme .paper-item h3 {
            color: var(--text-primary-light);
        }

        .paper-meta,
        .paper-authors,
        .paper-abstract {
            color: var(--text-secondary-dark);
            line-height: 1.6;
            margin: 0;
        }

        body.light-theme .paper-meta,
        body.light-theme .paper-authors,
        body.light-theme .paper-abstract {
            color: var(--text-secondary-light);
        }

        .paper-meta {
            font-size: 0.9em;
        }

        .paper-authors {
            font-size: 0.95em;
        }

        .paper-abstract {
            font-size: 0.95em;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .paper-actions {
            margin-top: 8px;
            display: flex;
            gap: 12px;
        }

        .paper-actions button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            background: var(--accent-dark);
            color: var(--bg-dark);
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-speed);
        }

        body.light-theme .paper-actions button {
            background: var(--accent-light);
            color: white;
        }

        .paper-actions button:hover {
            background: var(--accent-hover-dark);
            transform: translateY(-1px);
        }

        body.light-theme .paper-actions button:hover {
            background: var(--accent-hover-light);
        }

        .paper-actions button:disabled {
            background: var(--border-dark);
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        body.light-theme .paper-actions button:disabled {
            background: var(--border-light);
        }

        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 11, 20, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
            backdrop-filter: blur(4px);
        }

        body.light-theme .loading-overlay {
            background: rgba(255, 255, 255, 0.8);
        }

        .loading-content {
            background: var(--bg-secondary-dark);
            padding: 24px;
            border-radius: var(--border-radius);
            text-align: center;
            box-shadow: var(--card-shadow);
        }

        body.light-theme .loading-content {
            background: var(--bg-light);
        }

        .loading-spinner {
            border: 3px solid var(--border-dark);
            border-top: 3px solid var(--accent-dark);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 16px auto;
        }

        body.light-theme .loading-spinner {
            border-color: var(--border-light);
            border-top-color: var(--accent-light);
        }

        #loading-status {
            color: var(--text-primary-dark);
            margin: 0;
            font-size: 1.1em;
        }

        body.light-theme #loading-status {
            color: var(--text-primary-light);
        }

        @media (max-width: 768px) {
            .paper-item {
                padding: 16px;
            }

            .paper-actions {
                flex-direction: column;
            }

            .paper-actions button {
                width: 100%;
                justify-content: center;
            }

            .loading-content {
                width: 90%;
                max-width: 300px;
                margin: 0 16px;
            }
        }
    `,
    js: `
        // 重试函数
        async function retry(fn, { maxAttempts = 3, initialDelay = 1000, factor = 1.5 } = {}) {
            let attempt = 1;
            let delay = initialDelay;

            while (attempt <= maxAttempts) {
                try {
                    return await fn();
                } catch (error) {
                    if (attempt === maxAttempts) {
                        throw error;
                    }
                    console.log(\`Attempt \${attempt} failed, retrying in \${delay}ms...\`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    delay *= factor;
                    attempt++;
                }
            }
        }

        // 执行 GraphQL 查询
        async function executeGraphQLQuery(query) {
            return retry(async () => {
                const response = await fetch('https://uploader.irys.xyz/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                if (!response.ok) {
                    throw new Error(\`GraphQL request failed: \${response.statusText}\`);
                }

                return response.json();
            });
        }

        // 查询 PDF chunks
        async function queryPdfChunks(doi) {
            const query = \`
                query {
                    transactions(
                        tags: [
                            { name: "App-Name", values: ["scivault"] },
                            { name: "Content-Type", values: ["application/pdf"] },
                            { name: "Version", values: ["1.0.3"] },
                            { name: "doi", values: ["\${doi}"] }
                        ]
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
                }
            \`;

            try {
                const result = await executeGraphQLQuery(query);
                const edges = result.data?.transactions?.edges;
                if (!edges || edges.length === 0) {
                    return [];
                }

                // 提取并排序 chunk IDs
                const chunks = edges.map(edge => ({
                    id: edge.node.id,
                    index: parseInt(edge.node.tags.find(tag => tag.name === 'Chunk-Index')?.value || '0')
                }));

                chunks.sort((a, b) => a.index - b.index);
                return chunks.map(chunk => chunk.id);
            } catch (error) {
                console.error('Error querying PDF chunks:', error);
                throw error;
            }
        }

        // 获取单个 chunk
        async function fetchChunk(id) {
            return retry(async () => {
                const response = await fetch(\`https://gateway.irys.xyz/\${id}\`);
                if (!response.ok) {
                    throw new Error(\`Failed to fetch chunk: \${response.statusText}\`);
                }
                return response.text();
            });
        }

        async function loadLatestPapers() {
            const listDiv = document.getElementById('latestPapersList');
            const loadingIndicator = document.querySelector('.loading-indicator');
            
            try {
                loadingIndicator.classList.add('active');
                listDiv.innerHTML = '<p>Loading latest papers...</p>';
                
                const query = \`
                    query {
                        transactions(
                            tags: [
                                { name: "App-Name", values: ["scivault"] },
                                { name: "Content-Type", values: ["application/json"] },
                                { name: "Version", values: ["1.0.3"] }
                            ],
                            first: 10,
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
                    }
                \`;

                const result = await executeGraphQLQuery(query);
                const metadataNodes = result.data?.transactions?.edges || [];
                
                // 处理元数据
                const papers = [];
                for (const edge of metadataNodes) {
                    const id = edge.node.id;
                    const doi = edge.node.tags.find(tag => tag.name === 'doi')?.value;
                    if (!doi) continue;

                    try {
                        const metadataResponse = await retry(async () => {
                            const response = await fetch(\`https://gateway.irys.xyz/\${id}\`);
                            if (!response.ok) {
                                throw new Error(\`Failed to fetch metadata: \${response.statusText}\`);
                            }
                            return response.json();
                        });

                        // 检查是否有可用的 PDF chunks
                        const pdfIds = await queryPdfChunks(doi);
                        if (pdfIds.length > 0) {
                            metadataResponse.pdfIds = pdfIds;
                        }

                        papers.push(metadataResponse);
                    } catch (error) {
                        console.error(\`Error processing paper with DOI \${doi}:\`, error);
                    }
                }

                displayLatestPapers(papers);
            } catch (error) {
                listDiv.innerHTML = '<p>Error loading latest papers</p>';
                console.error('Latest papers error:', error);
            } finally {
                loadingIndicator.classList.remove('active');
            }
        }

        function displayLatestPapers(papers) {
            const listDiv = document.getElementById('latestPapersList');
            if (papers.length === 0) {
                listDiv.innerHTML = '<p>No papers available</p>';
                return;
            }

            listDiv.innerHTML = papers.map(paper => \`
                <div class="paper-item">
                    <h3>\${paper.title || 'Untitled'}</h3>
                    <p class="paper-meta">DOI: \${paper.doi || 'N/A'}</p>
                    <p class="paper-authors">\${paper.authors || 'Unknown authors'}</p>
                    <p class="paper-abstract">\${paper.abstract || 'No abstract available'}</p>
                    <div class="paper-actions">
                        \${paper.pdfIds 
                            ? \`<button onclick='downloadMergedPdf("\${encodeURIComponent(paper.doi)}", \${JSON.stringify(paper.pdfIds)}, "\${encodeURIComponent(paper.title)}");'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                    <polyline points="7 10 12 15 17 10"/>
                                    <line x1="12" y1="15" x2="12" y2="3"/>
                                </svg>
                                Download PDF
                            </button>\`
                            : \`<button disabled>PDF Not Available</button>\`
                        }
                    </div>
                </div>
            \`).join('');
        }

        async function downloadMergedPdf(doi, pdfIds, title) {
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-overlay';
            loadingDiv.innerHTML = \`
                <div class="loading-content">
                    <div class="loading-spinner"></div>
                    <p id="loading-status">Loading PDF chunks...</p>
                </div>
            \`;
            document.body.appendChild(loadingDiv);
            
            const updateStatus = (message) => {
                const statusElement = document.getElementById('loading-status');
                if (statusElement) {
                    statusElement.textContent = message;
                }
            };

            try {
                updateStatus(\`Loading PDF chunks (0/\${pdfIds.length})...\`);
                
                // Create array to store binary chunks
                const pdfChunks = [];
                let totalSize = 0;

                // Load and process each chunk
                for (let i = 0; i < pdfIds.length; i++) {
                    updateStatus(\`Loading chunk \${i + 1}/\${pdfIds.length}...\`);
                    const base64Text = await fetchChunk(pdfIds[i]);
                    
                    try {
                        // Convert base64 to binary
                        const binaryString = atob(base64Text);
                        const bytes = new Uint8Array(binaryString.length);
                        for (let j = 0; j < binaryString.length; j++) {
                            bytes[j] = binaryString.charCodeAt(j);
                        }
                        
                        pdfChunks.push(bytes);
                        totalSize += bytes.length;
                        console.log(\`Successfully loaded chunk \${i + 1}/\${pdfIds.length}\`);
                    } catch (decodeError) {
                        console.error(\`Error decoding chunk \${i + 1}:\`, decodeError);
                        throw new Error(\`Failed to decode PDF chunk \${i + 1}. The data may be corrupted.\`);
                    }
                }

                // Merge chunks into a single array
                updateStatus('Merging PDF chunks...');
                const mergedPdf = new Uint8Array(totalSize);
                let offset = 0;
                
                for (const chunk of pdfChunks) {
                    mergedPdf.set(chunk, offset);
                    offset += chunk.length;
                }

                // Create and download the PDF file
                updateStatus('Preparing download...');
                const blob = new Blob([mergedPdf], { type: 'application/pdf' });
                const url = URL.createObjectURL(blob);
                
                const decodedTitle = decodeURIComponent(title);
                const fileName = \`\${decodedTitle.replace(/[^a-zA-Z0-9]/g, '_')}.pdf\`;

                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                setTimeout(() => URL.revokeObjectURL(url), 100);

            } catch (error) {
                console.error('Error processing PDF:', error);
                alert(\`Failed to process PDF: \${error.message}\nPlease try again later.\`);
            } finally {
                document.body.removeChild(loadingDiv);
            }
        }

        // Initialize loading
        loadLatestPapers();
    `
};

module.exports = { latestPapersWidget }; 