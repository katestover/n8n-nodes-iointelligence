import {
	NodeConnectionTypes,
	type INodeType,
	type INodeTypeDescription,
	type ISupplyDataFunctions,
	type SupplyData,
	type ILoadOptionsFunctions,
	type INodePropertyOptions,
} from 'n8n-workflow';
import { supplyModel, type OpenAiModel } from '@n8n/ai-node-sdk';

export class LmChatIoIntelligence implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'IO Intelligence Chat Model',
		name: 'lmChatIoIntelligence',
		icon: 'file:iointelligence.svg',
		group: ['transform'],
		version: 1,
		description: 'Use IO Intelligence inference API as a chat model in n8n AI workflows',
		defaults: {
			name: 'IO Intelligence Chat Model',
		},
		codex: {
			categories: ['AI'],
			subcategories: {
				AI: ['Language Models', 'Root Nodes'],
				'Language Models': ['Chat Models (Recommended)'],
			},
			resources: {
				primaryDocumentation: [
					{
						url: 'https://io.net/docs/reference/ai-models/get-started-with-io-intelligence-api',
					},
				],
			},
		},
		inputs: [],
		outputs: [NodeConnectionTypes.AiLanguageModel],
		outputNames: ['Model'],
		credentials: [
			{
				name: 'ioIntelligenceApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Model Name or ID',
				name: 'model',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getModels',
				},
				default: 'meta-llama/Llama-3.3-70B-Instruct',
				required: true,
				description: 'The model to use for chat completions. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Frequency Penalty',
						name: 'frequencyPenalty',
						type: 'number',
						default: 0,
						typeOptions: { minValue: -2, maxValue: 2, numberPrecision: 1 },
						description:
							'Penalizes new tokens based on their existing frequency in the text so far. Positive values decrease the likelihood of repeating the same line.',
					},
					{
						displayName: 'Maximum Tokens',
						name: 'maxTokens',
						type: 'number',
						default: -1,
						description:
							'The maximum number of tokens to generate in the chat completion. Set to -1 for no limit.',
					},
					{
						displayName: 'Presence Penalty',
						name: 'presencePenalty',
						type: 'number',
						default: 0,
						typeOptions: { minValue: -2, maxValue: 2, numberPrecision: 1 },
						description:
							'Penalizes new tokens based on whether they appear in the text so far. Positive values increase the likelihood of talking about new topics.',
					},
					{
						displayName: 'Temperature',
						name: 'temperature',
						type: 'number',
						default: 0.7,
						typeOptions: { minValue: 0, maxValue: 2, numberPrecision: 1 },
						description:
							'Controls randomness. Lower values make the model more deterministic, higher values make it more creative.',
					},
					{
						displayName: 'Timeout',
						name: 'timeout',
						type: 'number',
						default: 60000,
						description: 'Maximum amount of time in ms a request is allowed to take',
					},
					{
						displayName: 'Top P',
						name: 'topP',
						type: 'number',
						default: 1,
						typeOptions: { minValue: 0, maxValue: 1, numberPrecision: 1 },
						description:
							'Controls diversity via nucleus sampling. 0.5 means half of all likelihood-weighted options are considered.',
					},
				],
			},
		],
	};

	methods = {
		loadOptions: {
			async getModels(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const credentials = await this.getCredentials('ioIntelligenceApi');
				const baseUrl = credentials.baseUrl as string;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'ioIntelligenceApi',
					{
						method: 'GET',
						url: `${baseUrl}/models`,
						json: true,
					},
				);

				const models: INodePropertyOptions[] = [];

				if (response?.data && Array.isArray(response.data)) {
					for (const model of response.data) {
						models.push({
							name: model.id as string,
							value: model.id as string,
						});
					}
				}

				models.sort((a, b) => a.name.localeCompare(b.name));
				return models;
			},
		},
	};

	async supplyData(this: ISupplyDataFunctions, itemIndex: number): Promise<SupplyData> {
		const credentials = await this.getCredentials('ioIntelligenceApi');

		const modelName = this.getNodeParameter('model', itemIndex) as string;
		const options = this.getNodeParameter('options', itemIndex, {}) as {
			frequencyPenalty?: number;
			maxTokens?: number;
			presencePenalty?: number;
			temperature?: number;
			timeout?: number;
			topP?: number;
		};

		const modelConfig: OpenAiModel = {
			type: 'openai',
			baseUrl: credentials.baseUrl as string,
			apiKey: credentials.apiKey as string,
			model: modelName,
			temperature: options.temperature ?? 0.7,
			maxTokens: options.maxTokens === -1 ? undefined : options.maxTokens,
			topP: options.topP,
			frequencyPenalty: options.frequencyPenalty,
			presencePenalty: options.presencePenalty,
			timeout: options.timeout,
		};

		return supplyModel(this, modelConfig);
	}
}
