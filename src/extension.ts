'use strict';
import * as vscode from 'vscode';

const linkPattern = /\b([TDFM]\d+)(#\d+)?\b/g;
const configSection = 'phabricator-links';
const configUrlKey = 'url';

export function provideDocumentLinks(document: vscode.TextDocument, baseUrl: vscode.Uri): vscode.DocumentLink[] {
    const basePath = baseUrl.path.endsWith('/') ? baseUrl.path : baseUrl.path + '/';

    const results: vscode.DocumentLink[] = [];
    const text = document.getText();
    // Since the pattern is global, reset the match index between uses.
    linkPattern.lastIndex = 0;
    for (let match; match = linkPattern.exec(text); match) {
        const phabObj = match[1];
        // This excludes links for targets that are preceded by a '/' since
        // those might be part of a longer URL. If this returns an link for that
        // text it overrides the linking of the longer URL. It does overlook
        // other links like T123/D123 where the '/' is part of other text,
        // but a more precise solution would get more complicated to search
        // for whether this is contained inside a URL or not.
        if (match.index > 0 && text[match.index-1] === '/') {
            continue;
        }
        const fragment = match[2] ? match[2].substring(1) : undefined;
        results.push(new vscode.DocumentLink(
            new vscode.Range(
                document.positionAt(match.index),
                document.positionAt(match.index + match[0].length),
            ),
            baseUrl.with({ path: basePath + phabObj, fragment }),
        ));
    }
    return results;
}

class Provider implements vscode.DocumentLinkProvider {
    provideDocumentLinks(document: vscode.TextDocument, token?: vscode.CancellationToken): vscode.DocumentLink[] {
        const config = vscode.workspace.getConfiguration(configSection);
        const urlSetting = config.get<string|null>(configUrlKey);
        if (!urlSetting) {
            return [];
        }
        let url;
        try {
            url = vscode.Uri.parse(urlSetting);
        } catch (error) {
            // The config format is set to "uri" which provides a nice error in
            // the Settings if this isn't a valid URL.
            console.log(`error parsing ${configSection}.${configUrlKey}`, urlSetting, error);
            return [];
        }
        return provideDocumentLinks(document, url);
    }
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.languages.registerDocumentLinkProvider('*', new Provider());
    context.subscriptions.push(disposable);
}

export function deactivate() {
}
