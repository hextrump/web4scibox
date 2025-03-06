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

                // 获取 PDF 信息
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

                // 处理元数据并关联 PDF
                const papers = [];
                for (const edge of metadataNodes) {
                    const id = edge.node.id;
                    const metadataResponse = await fetch(\`https://gateway.irys.xyz/\${id}\`);
                    const paper = await metadataResponse.json();
                    const doi = edge.node.tags.find(tag => tag.name === 'doi')?.value;
                    paper.pdfIds = pdfMap.get(doi) || null;
                    papers.push(paper);
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
                            ? \`<button onclick='mergePdfAndView("\${encodeURIComponent(paper.doi)}", \${JSON.stringify(paper.pdfIds)})'>View PDF</button>\`
                            : \`<button disabled>PDF Not Available</button>\`
                        }
                    </div>
                </div>
            \`).join('');
        }

        // Initialize loading
        loadLatestPapers();
    `
};

module.exports = { latestPapersWidget }; 