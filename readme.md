# SciBox - Decentralized Academic Paper Platform

SciBox is a revolutionary Web4-based decentralized platform for academic papers, built on the Irys network. It represents a new paradigm in academic paper sharing and management, leveraging blockchain technology for decentralized storage and distribution.

## Core Features

### Decentralized Architecture
- **Web4-based Framework**: Built on decentralized principles using Irys network
- **Modular Widget System**: Each component is independently stored and managed on the blockchain
- **Dynamic Loading**: Components are loaded in real-time through GraphQL queries
- **Version Control**: Automatic versioning of components and content

### Key Components
- **Paper Search**: Advanced search functionality supporting DOI, Title, and arXiv ID
- **Latest Papers Feed**: Real-time updates of newly added papers
- **PDF Viewer**: Integrated viewer for academic papers
- **Chat System**: Real-time discussion platform integrated with Solana wallet
- **Upload System**: Decentralized paper upload system

### Technical Highlights
- **Component Independence**: Each widget contains complete HTML, CSS, and JavaScript
- **Dynamic Updates**: Components can be updated independently without full redeployment
- **Blockchain Storage**: All content stored on Irys decentralized network
- **Real-time Loading**: GraphQL-powered dynamic content loading

## Architecture

### Widget System
Each functional component (widget) in SciBox is:
- Completely self-contained with HTML, CSS, and JavaScript
- Stored independently on the Irys network
- Versioned and updateable individually
- Loaded dynamically based on user interaction

### Decentralized Storage
- Papers and metadata stored on Irys network
- Content addressed through unique identifiers
- Immutable and permanent storage
- Distributed access and retrieval

### Integration
- **Solana Wallet Integration**: For user authentication and chat functionality
- **Irys Network**: For decentralized storage and content delivery
- **GraphQL API**: For efficient data querying and real-time updates

## Technical Stack
- **Frontend**: Pure JavaScript with Web4 principles
- **Storage**: Irys Network (formerly Bundlr)
- **Authentication**: Solana Wallet
- **API**: GraphQL
- **PDF Processing**: Client-side chunk processing and viewing

## Future Development
- Enhanced search capabilities
- Academic community features
- Citation management system
- Integration with more academic databases
- Mobile application development

## Links
- Paper Upload System: [Uploader Interface](https://uploader.irys.xyz/28CMUfviKfsEquZ9YCwxwPvJoUMujDLEJvqsuhcBXRQL/index.html)

---

SciBox represents a significant step forward in decentralized academic publishing and sharing. By leveraging Web4 technologies and blockchain storage, it provides a robust, censorship-resistant platform for academic knowledge distribution.



// Layout 职责
- 加载组件
- 处理组件查询和数据获取
- 提供最基础的容器布局
- 管理主题切换

// 组件职责
- 自己的样式和布局
- 响应式设计
- 内部交互逻辑
