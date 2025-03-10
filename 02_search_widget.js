const searchWidget = {
    html: `
        <div class="search-widget">
            <div class="search-box">
                <select id="searchType">
                    <option value="doi">DOI</option>
                    <option value="title">Title</option>
                    <option value="aid">arXiv ID</option>
                </select>
                <input type="text" id="searchInput" placeholder="Search papers...">
                <button onclick="searchPapers()">Search</button>
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
            gap: 10px;
            padding: 15px;
            background: var(--bg-secondary-light);
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            width: 100%;
            box-sizing: border-box;
            flex-wrap: wrap;
            overflow: hidden;
        }
        .dark-theme .search-box {
            background: var(--bg-secondary-dark);
            box-shadow: 0 1px 3px var(--shadow-dark);
        }
        .search-box select {
            padding: 8px;
            border: 1px solid var(--border-light);
            border-radius: 4px;
            background: var(--bg-light);
            color: var(--text-primary-light);
            min-width: 100px;
            flex-shrink: 0;
            margin: 0;
            -webkit-appearance: none;
            -moz-appearance: none;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 16px;
            padding-right: 32px;
        }
        .dark-theme .search-box select {
            border-color: var(--border-dark);
            background-color: var(--bg-dark);
            color: var(--text-primary-dark);
        }
        .search-box input {
            flex: 1;
            min-width: 200px;
            padding: 8px 12px;
            border: 1px solid var(--border-light);
            border-radius: 4px;
            font-size: 16px;
            background: var(--bg-light);
            color: var(--text-primary-light);
            margin: 0;
            outline: none;
            width: 100%;
            box-sizing: border-box;
        }
        .search-box input:focus {
            border-color: var(--accent-light);
            box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.1);
        }
        .dark-theme .search-box input:focus {
            border-color: var(--accent-dark);
            box-shadow: 0 0 0 2px rgba(100, 255, 218, 0.1);
        }
        .dark-theme .search-box input {
            border-color: var(--border-dark);
            background: var(--bg-dark);
            color: var(--text-primary-dark);
        }
        .search-box button {
            padding: 8px 20px;
            background: var(--accent-light);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
            flex-shrink: 0;
            white-space: nowrap;
        }
        .dark-theme .search-box button {
            background: var(--accent-dark);
            color: var(--bg-dark);
        }
        .search-box button:hover {
            background: #357abd;
        }
        .dark-theme .search-box button:hover {
            background: #4fd1b5;
        }
        .search-results {
            margin-top: 20px;
            width: 100%;
        }
        .paper-item {
            background: var(--bg-light);
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px var(--shadow-light);
            margin-bottom: 15px;
            width: 100%;
            box-sizing: border-box;
        }
        .dark-theme .paper-item {
            background: var(--bg-secondary-dark);
            box-shadow: 0 2px 4px var(--shadow-dark);
        }
        .paper-item h3 {
            color: var(--text-primary-light);
            margin: 0 0 10px 0;
            font-size: 1.2em;
            word-break: break-word;
        }
        .dark-theme .paper-item h3 {
            color: var(--text-primary-dark);
        }
        .paper-meta {
            color: var(--text-secondary-light);
            font-size: 0.9em;
            margin: 5px 0;
            word-break: break-all;
        }
        .dark-theme .paper-meta {
            color: var(--text-secondary-dark);
        }
        .paper-authors {
            color: var(--text-secondary-light);
            font-size: 0.95em;
            margin: 5px 0;
            word-break: break-word;
        }
        .dark-theme .paper-authors {
            color: var(--text-secondary-dark);
        }
        .paper-abstract {
            color: var(--text-secondary-light);
            font-size: 0.9em;
            margin: 10px 0;
            line-height: 1.5;
            word-break: break-word;
        }
        .dark-theme .paper-abstract {
            color: var(--text-secondary-dark);
        }
        .paper-actions {
            margin-top: 15px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        }
        .paper-actions button {
            background: var(--accent-light);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.2s;
            flex-shrink: 0;
        }
        .dark-theme .paper-actions button {
            background: var(--accent-dark);
            color: var(--bg-dark);
        }
        .paper-actions button:hover {
            background: #357abd;
        }
        .dark-theme .paper-actions button:hover {
            background: #4fd1b5;
        }
        .paper-actions button:disabled {
            background: var(--border-light);
            cursor: not-allowed;
        }
        .dark-theme .paper-actions button:disabled {
            background: var(--border-dark);
        }

        @media (max-width: 768px) {
            .search-widget {
                width: 100%;
                padding: 0;
                margin: 0 0 20px 0;
            }
            .search-box {
                flex-direction: column;
                gap: 12px;
                padding: 12px;
                margin: 0;
                width: 100%;
                box-sizing: border-box;
            }
            .search-box select,
            .search-box input,
            .search-box button {
                width: 100%;
                min-width: unset;
                margin: 0;
                box-sizing: border-box;
            }
            .search-box input {
                flex: none;
            }
            .paper-item {
                padding: 15px;
                margin: 0 0 15px 0;
                width: 100%;
                box-sizing: border-box;
            }
            .paper-actions {
                flex-direction: column;
            }
            .paper-actions button {
                width: 100%;
                text-align: center;
            }
        }
    `,
    js: `
        async function searchPapers() {
            const searchType = document.getElementById('searchType').value;
            const searchInput = document.getElementById('searchInput').value;
            const resultsDiv = document.getElementById('searchResults');
            
            if (!searchInput.trim()) {
                resultsDiv.innerHTML = '<p>Please enter a search term</p>';
                return;
            }

            resultsDiv.innerHTML = '<p>Searching...</p>';
            
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
                resultsDiv.innerHTML = '<p>Error performing search</p>';
                console.error('Search error:', error);
            }
        }

        function displayResults(papers) {
            const resultsDiv = document.getElementById('searchResults');
            if (papers.length === 0) {
                resultsDiv.innerHTML = '<p>No papers found</p>';
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