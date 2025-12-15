import type {IDataObject, IExecuteFunctions, INodeType, INodeTypeDescription} from 'n8n-workflow'
import {NodeConnectionType,} from 'n8n-workflow';

export class TelegramSendMessageCustom implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Telegram Send Custom Message',
        name: 'telegramSendMessageCustom',
        icon: 'file:telegram.svg',
        group: ['transform'],
        version: 1,
        description: 'Send Telegram message using credentials and custom JSON',
        documentationUrl: 'https://core.telegram.org/bots/api#sendmessage',
        defaults: {name: 'Telegram Send Custom Message'},
        inputs: [NodeConnectionType.Main],
        outputs: [NodeConnectionType.Main],
        credentials: [{name: 'telegramApi', required: true}],
        properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				default: 'sendMessage',
				options: [
					{name: 'Send Message', value: 'sendMessage'},
					{name: 'Send Photo', value: 'sendPhoto'}
				]
			},
            {displayName: 'Chat ID', name: 'chatId', type: 'string', default: ''},
            {displayName: 'Text', name: 'text', type: 'string', default: ''},
			{
				displayName: 'Photo URL or File ID',
				name: 'photo',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['sendPhoto']
					}
				},
				description: 'Public URL or existing Telegram file_id for sendPhoto'
			},
            {
                displayName: 'Custom JSON',
                name: 'customJson',
                type: 'json',
                default: '{}',
                description: 'Custom JSON object will be added to the request body',
                hint: `Example: { "reply_markup": { "inline_keyboard": [[{ "text": "Open site", "url": "https://example.com" }], [{ "text": "Run callback", "callback_data": "do_action" }]] }}`,
            }
        ],
    }

    async execute(this: IExecuteFunctions) {
        const items = this.getInputData()
        const creds = await this.getCredentials('telegramApi') as { accessToken: string }
        const token = creds.accessToken
        const results: Array<{ json: IDataObject }> = []

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const chatId = this.getNodeParameter('chatId', i) as string;
			const text = this.getNodeParameter('text', i) as string;
			const photo = this.getNodeParameter('photo', i, '') as string;
			const customJson = this.getNodeParameter('customJson', i) as IDataObject | string;

			let customJsonObject: Record<string, any>;

			if (typeof customJson === 'string') {
				try {
					customJsonObject = JSON.parse(customJson);
				} catch {
					throw new Error('Custom JSON must be valid JSON');
				}
			} else {
				customJsonObject = customJson;
			}

			let body: IDataObject;

			if (operation === 'sendPhoto') {
				body = {chat_id: chatId, photo};
				if (text)
					(body as any).caption = text;
			} else {
				body = {chat_id: chatId, text};
			}

			if (Object.keys(customJsonObject).length > 0) {
				body = {...body, ...customJsonObject};
			}

			const res = await this.helpers.httpRequest({
				method: 'POST',
				url: `https://api.telegram.org/bot${token}/${operation}`,
				body,
				json: true
			});

			results.push({json: {request: body, response: res as IDataObject}});
		}

        return this.prepareOutputData(results)
    }
}
