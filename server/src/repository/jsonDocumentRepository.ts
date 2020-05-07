import {
	CompletionItemKind,
	CompletionItem,
	MarkupKind
} from 'vscode-languageserver';

const documentsData = require('../../data/documentation');

import { IDocumentRepository } from '../interface/iDcoumentRepository';

class JsonDocumentRepository implements IDocumentRepository {
	constructor() {
	}

	getAll(): CompletionItem[] {
		const data: CompletionItem[] = [];

		for (let i = 0; i < documentsData.length; i++) {
			const tmp = documentsData[i];

			const obj: CompletionItem = {
				data: tmp.data,
				label: tmp.label,
				detail: tmp.details,
			};
			if (tmp.type === 'function') {
				obj.kind = CompletionItemKind.Function;
			}
			if (tmp.documentation instanceof String) {
				obj.documentation = tmp.documentation;
			} else if (tmp.documentation instanceof Object) {
				obj.documentation = {
					kind: MarkupKind.PlainText,
					value: tmp.documentation.value.join('\n')
				};
				if (tmp.documentation.type === 'markdown') {
					obj.documentation.kind = MarkupKind.Markdown;
				}
			}

			data.push(obj);
		}

		return data;
	}
}

export { JsonDocumentRepository};
