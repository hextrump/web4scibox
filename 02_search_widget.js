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
        }
        .search-box {
            display: flex;
            gap: 10px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        .search-box select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            background: white;
        }
        .search-box input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
        }
        .search-box button {
            padding: 8px 20px;
            background: #4a90e2;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s;
        }
        .search-box button:hover {
            background: #357abd;
        }
        .search-results {
            margin-top: 20px;
        }
        .paper-item {
            background: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 15px;
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