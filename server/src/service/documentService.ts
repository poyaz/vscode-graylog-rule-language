import { CompletionItem } from 'vscode-languageserver';
import { IDocumentRepository } from '../interface/iDcoumentRepository';

class DocumentService {
	private readonly documentRepository: IDocumentRepository;
	private data: CompletionItem[] = [];

	constructor(documentRepository: IDocumentRepository) {
		this.documentRepository = documentRepository;
	}

	getCompletion(): CompletionItem[] {
		this.cache();

		const data: CompletionItem[] = [];

		for (let i = 0; i < this.data.length; i++) {
			const tmp = this.data[i];

			data.push({
				label: tmp.label,
				kind: tmp.kind,
				data: tmp.data,
			});
		}

		return data;
	}

	getCompletionResolve(item: CompletionItem): CompletionItem {
		this.cache();

		const itemData = this.data[item.data - 1];

		return itemData;
	}

	private cache(): void {
		if (this.data.length === 0) {
			this.data = this.documentRepository.getAll();
		}
	}
}

export { DocumentService };