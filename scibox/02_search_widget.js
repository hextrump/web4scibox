const searchWidget = {
    html: `
        <div class="search-widget">
            <div class="search-box">
                <div class="search-input-group">
                    <select id="searchType">
                        <option value="doi">DOI</option>
                        <option value="title">Title</option>
                        <option value="aid">arXiv ID</option>
                    </select>
                    <input type="text" id="searchInput" placeholder="Search papers...">
                </div>
                <button onclick="searchPapers()" class="search-button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    Search
                </button>
            </div>
            <div id="searchResults" class="search-results">
                <!-- Search results will be displayed here -->
            </div>
        </div>
    `,
    css: `
        .search-widget {
            margin-bottom: 30px;
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
        }

        .search-box {
            display: flex;
            gap: 16px;
            padding: 20px;
            background: var(--bg-secondary-dark);
            border: 1px solid var(--border-dark);
            border-radius: var(--border-radius);
            box-shadow: var(--card-shadow);
            width: 100%;
            box-sizing: border-box;
            transition: all var(--transition-speed);
        }

        body.light-theme .search-box {
            background: var(--bg-light);
            border-color: var(--border-light);
        }

        .search-input-group {
            display: flex;
            gap: 12px;
            flex: 1;
            min-width: 0;
        }

        .search-box select {
            padding: 12px 16px;
            border: 2px solid var(--border-dark);
            border-radius: 8px;
            background: var(--bg-dark);
            color: var(--text-primary-dark);
            min-width: 120px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-speed);
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 12px center;
            background-size: 16px;
            padding-right: 40px;
        }

        body.light-theme .search-box select {
            border-color: var(--border-light);
            background-color: var(--bg-light);
            color: var(--text-primary-light);
        }

        .search-box select:hover {
            border-color: var(--accent-dark);
        }

        body.light-theme .search-box select:hover {
            border-color: var(--accent-light);
        }

        .search-box input {
            flex: 1;
            min-width: 200px;
            padding: 12px 16px;
            border: 2px solid var(--border-dark);
            border-radius: 8px;
            font-size: 16px;
            background: var(--bg-dark);
            color: var(--text-primary-dark);
            transition: all var(--transition-speed);
        }

        body.light-theme .search-box input {
            border-color: var(--border-light);
            background: var(--bg-light);
            color: var(--text-primary-light);
        }

        .search-box input:focus {
            outline: none;
            border-color: var(--accent-dark);
            box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.1);
        }

        body.light-theme .search-box input:focus {
            border-color: var(--accent-light);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .search-button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 12px 24px;
            background: var(--accent-dark);
            color: var(--bg-dark);
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all var(--transition-speed);
            white-space: nowrap;
        }

        body.light-theme .search-button {
            background: var(--accent-light);
            color: white;
        }

        .search-button:hover {
            background: var(--accent-hover-dark);
            transform: translateY(-1px);
        }

        body.light-theme .search-button:hover {
            background: var(--accent-hover-light);
        }

        .search-results {
            margin-top: 24px;
            width: 100%;
        }

        .paper-item {
            background: var(--bg-secondary-dark);
            border: 1px solid var(--border-dark);
            border-radius: var(--border-radius);
            padding: 24px;
            margin-bottom: 16px;
            transition: all var(--transition-speed);
            animation: fadeIn 0.5s ease forwards;
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
            margin: 0 0 12px 0;
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
        }

        body.light-theme .paper-meta,
        body.light-theme .paper-authors,
        body.light-theme .paper-abstract {
            color: var(--text-secondary-light);
        }

        .paper-actions {
            margin-top: 20px;
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
        }

        .paper-actions button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 10px 20px;
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
        }

        body.light-theme .paper-actions button:hover {
            background: var(--accent-hover-light);
        }

        .paper-actions button:disabled {
            background: var(--border-dark);
            opacity: 0.5;
        }

        body.light-theme .paper-actions button:disabled {
            background: var(--border-light);
        }

        @media (max-width: 768px) {
            .search-widget {
                margin: 0 0 20px 0;
            }

            .search-box {
                flex-direction: column;
                gap: 12px;
                padding: 16px;
            }

            .search-input-group {
                flex-direction: column;
                gap: 12px;
            }

            .search-box select,
            .search-box input {
                width: 100%;
                min-width: unset;
            }

            .search-button {
                width: 100%;
                justify-content: center;
            }

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
        }
    `,
    js: `
        async function searchPapers() {
            const searchType = document.getElementById('searchType').value;
            const searchInput = document.getElementById('searchInput').value;
            const resultsDiv = document.getElementById('searchResults');
            
            if (!searchInput.trim()) {
                resultsDiv.innerHTML = '<div class="error-message">Please enter a search term</div>';
                return;
            }

            // Add loading state
            resultsDiv.innerHTML = '<div class="loading">Searching...</div>';
            
            try {
                // 第一步：搜索 metadata
                const query = \`
                    query {
                        transactions(
                            tags: [
                                { name: "App-Name", values: ["scivault"] },
                                { name: "Content-Type", values: ["application/json"] },
                                { name: "Version", values: ["1.0.3"] },
                                { name: "\${searchType}", values: ["\${searchInput}"] }
                            ],
                            first: 100
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

                const response = await fetch('https://uploader.irys.xyz/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                const result = await response.json();
                const metadataNodes = result.data?.transactions?.edges || [];
                
                // 提取所有 DOI
                const dois = metadataNodes.map(edge => 
                    edge.node.tags.find(tag => tag.name === 'doi')?.value
                ).filter(doi => doi);

                // 查询 PDF 信息
                const pdfMap = new Map();
                if (dois.length > 0) {
                    const pdfQuery = \`
                        query {
                            transactions(
                                tags: [
                                    { name: "Content-Type", values: ["application/pdf"] },
                                    { name: "application", values: ["scivault"] },
                                    { name: "Version", values: ["1.0.3"] },
                                    { name: "Type", values: ["pdf-index"] },
                                    { name: "Collection", values: \${JSON.stringify(dois)} }
                                ],
                                first: 100
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

                    const pdfResponse = await fetch('https://uploader.irys.xyz/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query: pdfQuery })
                    });

                    const pdfResult = await pdfResponse.json();
                    
                    for (const edge of pdfResult.data?.transactions?.edges || []) {
                        const tags = edge.node.tags;
                        const collection = tags.find(tag => tag.name === 'Collection')?.value;
                        if (collection) {
                            if (pdfMap.has(collection)) {
                                pdfMap.get(collection).push(edge.node.id);
                            } else {
                                pdfMap.set(collection, [edge.node.id]);
                            }
                        }
                    }
                }

                // 处理结果
                const papers = [];
                for (const edge of metadataNodes) {
                    const id = edge.node.id;
                    const metadataResponse = await fetch(\`https://gateway.irys.xyz/\${id}\`);
                    const paper = await metadataResponse.json();
                    const doi = edge.node.tags.find(tag => tag.name === 'doi')?.value;
                    paper.pdfIds = pdfMap.get(doi) || null;
                    papers.push(paper);
                }

                displayResults(papers);
            } catch (error) {
                resultsDiv.innerHTML = '<div class="error-message">Error: Unable to perform search</div>';
            }
        }

        function displayResults(papers) {
            const resultsDiv = document.getElementById('searchResults');
            if (papers.length === 0) {
                resultsDiv.innerHTML = '<div class="error-message">No papers found</div>';
                return;
            }

            resultsDiv.innerHTML = papers.map(paper => \`
                <div class="paper-item">
                    <h3>\${paper.title || 'Untitled'}</h3>
                    <p class="paper-meta">DOI: \${paper.doi || 'N/A'}</p>
                    <p class="paper-authors">\${paper.authors || 'Unknown authors'}</p>
                    <p class="paper-abstract">\${paper.abstract || 'No abstract available'}</p>
                    <div class="paper-actions">
                        \${paper.pdfIds 
                            ? \`<button onclick='mergePdfAndView("\${encodeURIComponent(paper.doi)}", \${JSON.stringify(paper.pdfIds)})'>View PDF</button>\`
                            : \`<button disabled>PDF Not Available</button>\`
                        }
                    </div>
                </div>
            \`).join('');
        }

        async function mergePdfAndView(encodedDoi, pdfIds) {
            try {
                const doi = decodeURIComponent(encodedDoi);
                const pdfChunks = await Promise.all(
                    pdfIds.map(id => 
                        fetch(\`https://gateway.irys.xyz/\${id}\`)
                            .then(res => res.text())
                    )
                );
                
                const mergedBase64 = pdfChunks.join('');
                const binaryString = atob(mergedBase64);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                
                const pdfBlob = new Blob([bytes], { type: 'application/pdf' });
                const pdfUrl = URL.createObjectURL(pdfBlob);
                window.open(pdfUrl, '_blank');
            } catch (error) {
                console.error('Error merging PDF:', error);
                alert('Failed to load PDF. Please try again later.');
            }
        }

        async function viewMetadata(encodedDoi) {
            try {
                const doi = decodeURIComponent(encodedDoi);
                const query = \`
                    query {
                        transactions(
                            tags: [
                                { name: "Content-Type", values: ["metadata/json"] },
                                { name: "App-Name", values: ["scivault"] },
                                { name: "Version", values: ["0.2.1"] },
                                { name: "doi", values: ["\${doi}"] }
                            ],
                            first: 1
                        ) {
                            edges {
                                node {
                                    id
                                }
                            }
                        }
                    }
                \`;

                const response = await fetch('https://uploader.irys.xyz/graphql', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ query })
                });

                const result = await response.json();
                const metadataId = result.data?.transactions?.edges?.[0]?.node?.id;

                if (!metadataId) {
                    throw new Error('Metadata not found');
                }

                const metadataResponse = await fetch(\`https://gateway.irys.xyz/\${metadataId}\`);
                const metadata = await metadataResponse.json();

                const metadataWindow = window.open('', '_blank');
                metadataWindow.document.write(\`
                    <html>
                        <head>
                            <title>Paper Metadata</title>
                            <style>
                                body {
                                    margin: 0;
                                    padding: 0;
                                    background: white;
                                }
                                pre {
                                    margin: 0;
                                    padding: 16px;
                                    font-family: monospace;
                                    white-space: pre-wrap;
                                    word-wrap: break-word;
                                }
                            </style>
                        </head>
                        <body><pre>\${JSON.stringify(metadata, null, 2)}</pre></body>
                    </html>
                \`);
            } catch (error) {
                console.error('Error viewing metadata:', error);
                alert('Failed to load metadata. Please try again later.');
            }
        }
    `
};

module.exports = { searchWidget }; 