/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */

import * as path from 'path';
import { workspace, ExtensionContext, ConfigurationTarget } from 'vscode';

import {
	LanguageClient,
	LanguageClientOptions,
	ServerOptions,
	TransportKind
} from 'vscode-languageclient';

const colorData = require('../themes/color');

let client: LanguageClient;

export function activate(context: ExtensionContext) {
	addColorSettings();

	// The server is implemented in node
	let serverModule = context.asAbsolutePath(
		path.join('server', 'out', 'server.js')
	);
	// The debug options for the server
	// --inspect=6009: runs the server in Node's Inspector mode so VS Code can attach to the server for debugging
	let debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };

	// If the extension is launched in debug mode then the debug server options are used
	// Otherwise the run options are used
	let serverOptions: ServerOptions = {
		run: { module: serverModule, transport: TransportKind.ipc },
		debug: {
			module: serverModule,
			transport: TransportKind.ipc,
			options: debugOptions
		}
	};

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for plain text documents
		documentSelector: [{ scheme: 'file', language: 'grule' }],
		synchronize: {
			// Notify the server about file changes to '.clientrc files contained in the workspace
			fileEvents: workspace.createFileSystemWatcher('**/.clientrc')
		}
	};

	// Create the language client and start the client.
	client = new LanguageClient(
		'languageServerExample',
		'Language Server Example',
		serverOptions,
		clientOptions
	);

	// Start the client. This will also launch the server
	client.start();
}

export function deactivate(): Thenable<void> | undefined {
	if (!client) {
		return undefined;
	}
	return client.stop();
}

function addColorSettings() {
	(async () => {
		const config = workspace.getConfiguration();
		let tokenColorCustomizations = config.inspect('editor.tokenColorCustomizations').globalValue;

		if (!tokenColorCustomizations) {
			tokenColorCustomizations = {};
		}
		if (!Object.hasOwnProperty.call(tokenColorCustomizations, 'textMateRules')) {
			tokenColorCustomizations['textMateRules'] = [];
		}

		const tokenColor = tokenColorCustomizations['textMateRules'];
		const colorDataLength = colorData.length;
		const tokenColorLength = tokenColor.length;

		for (let i = 0; i < colorDataLength; i++) {
			const name = colorData[i].name;

			let exist = false;
			for (let j = 0; j < tokenColorLength; j++) {
				if (tokenColor[j].name === name) {
					exist = true;
					break;
				}
			}

			if (!exist) {
				tokenColor.push(colorData[i]);
			}
		}

		await config.update(
			'editor.tokenColorCustomizations',
			tokenColorCustomizations,
			ConfigurationTarget.Global,
		);
	})();
}
