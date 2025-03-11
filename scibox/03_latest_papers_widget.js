const latestPapersWidget = {
    html: `
        <div class="latest-papers-widget">
            <h2>Latest Papers</h2>
            <div id="latestPapersList" class="papers-list">
                <!-- Latest papers will be displayed here -->
            </div>
        </div>
    `,
    css: `
        .latest-papers-widget {
            margin-top: 30px;
        }
        .latest-papers-widget h2 {
            font-size: 1.5em;
            color: #2d3748;
            margin-bottom: 20px;
        }
        .papers-list {
            display: grid;
            gap: 20px;
        }
        .paper-item {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        .paper-item:hover {
            transform: translateY(-2px);
        }
        .paper-item h3 {
            color: #2d3748;
            margin: 0 0 10px 0;
            font-size: 1.2em;
        }
        .paper-meta {
            color: #718096;
            font-size: 0.9em;
            margin: 5px 0;
        }
        .paper-authors {
            color: #4a5568;
            font-size: 0.95em;
            margin: 5px 0;
        }
        .paper-abstract {
            color: #4a5568;
            font-size: 0.9em;
            margin: 10px 0;
            line-height: 1.5;
        }
        .paper-actions {
            margin-top: 15px;
        }
        .paper-actions button {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            background: #4a90e2;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
        }
        .paper-actions button:hover {
            background: #357abd;
        }
        .paper-actions button:disabled {
            background: #cbd5e0;
            cursor: not-allowed;
        }
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .loading-content {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }
        .loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 10px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
            listDiv.innerHTML = '<p>Loading latest papers...</p>';
            
            try {
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