import { CompletionItem } from 'vscode-languageserver';

export interface IDocumentRepository {
	getAll(): CompletionItem[];
}
