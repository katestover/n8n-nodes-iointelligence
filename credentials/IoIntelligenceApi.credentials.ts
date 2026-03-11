import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class IoIntelligenceApi implements ICredentialType {
	name = 'ioIntelligenceApi';

	displayName = 'IO Intelligence API';

	icon = { light: 'file:../nodes/LmChatIoIntelligence/iointelligence.svg', dark: 'file:../nodes/LmChatIoIntelligence/iointelligence.svg' } as const;

	documentationUrl = 'https://io.net/docs/reference/ai-models/get-started-with-io-intelligence-api';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Your IO Intelligence API key from io.net',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.intelligence.io.solutions/api/v1',
			required: true,
			description: 'The base URL for the IO Intelligence API',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/models',
			method: 'GET',
		},
	};
}
