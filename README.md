# n8n-nodes-iointelligence

This is an [n8n](https://n8n.io/) community node that lets you use [IO Intelligence](https://io.net/) as an AI model provider in your n8n workflows.

IO Intelligence provides access to a range of open-source and proprietary LLMs through io.net's decentralized GPU infrastructure.

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

**npm package name:** `n8n-nodes-iointelligence`

## Credentials

You need an IO Intelligence API key to use this node:

1. Go to [io.net](https://io.net/) and create an account
2. Navigate to your API settings and generate an API key
3. In n8n, create new **IO Intelligence API** credentials and paste your API key

The default base URL is `https://api.intelligence.io.solutions/api/v1`. You can change this in the credentials if needed.

## Node: IO Intelligence Chat Model

This node provides a **Chat Model** that integrates with n8n's AI workflow system. It appears as an AI Language Model sub-node that you can connect to:

- **AI Agent** node
- **Basic LLM Chain** node
- **Other AI chain/agent nodes** that accept a chat model input

### Configuration

| Parameter | Description |
|-----------|-------------|
| **Model** | Select from available models (fetched dynamically from the API) |
| **Temperature** | Controls randomness (0 = deterministic, 2 = very creative) |
| **Maximum Tokens** | Max tokens to generate (-1 for no limit) |
| **Top P** | Nucleus sampling parameter |
| **Frequency Penalty** | Penalizes repeated tokens |
| **Presence Penalty** | Encourages new topics |
| **Timeout** | Request timeout in milliseconds |

### Usage

1. Add an **AI Agent** or **Basic LLM Chain** node to your workflow
2. Click the **Model** input connector
3. Select **IO Intelligence Chat Model** from the list
4. Configure your credentials and select a model
5. Run your workflow

## Compatibility

- Tested with n8n version 1.x
- Requires Node.js 18+
- **Self-hosted n8n**: Fully supported. Install via Community Nodes in the n8n UI.
- **n8n Cloud**: This node uses `@langchain/openai` as a peer dependency for AI Agent/Chain integration. Cloud support depends on n8n's verification of AI community nodes.

## Resources

- [IO Intelligence API Docs](https://io.net/docs/reference/ai-models/get-started-with-io-intelligence-api)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)

## License

[MIT](LICENSE)
