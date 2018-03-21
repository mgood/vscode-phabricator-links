import * as assert from 'assert';

import * as vscode from 'vscode';
import { provideDocumentLinks } from '../extension';

const urlString = "http://phab.example.com/";
const url = vscode.Uri.parse(urlString);

async function getLinks(content: string) {
    const doc = await vscode.workspace.openTextDocument({ content });
    return provideDocumentLinks(doc, url);
}

function linkAt(target: string, start: number = 0): vscode.DocumentLink {
    return new vscode.DocumentLink(
        new vscode.Range(
            new vscode.Position(0, start),
            new vscode.Position(0, start + target.length),
        ),
        vscode.Uri.parse(urlString + target),
    );
}

suite("Extension Tests", () => {
    test("Document with no links", async () => {
        assert.deepEqual([], await getLinks("foo"));
    });

    test("Task link", async () => {
        const target = "T123";
        assert.deepEqual([linkAt(target)], await getLinks(target));
    });

    test("Differential link", async () => {
        const target = "D123";
        assert.deepEqual([linkAt(target)], await getLinks(target));
    });

    test("File link", async () => {
        const target = "F123";
        assert.deepEqual([linkAt(target)], await getLinks(target));
    });

    test("Pholio mock link", async () => {
        const target = "M123";
        assert.deepEqual([linkAt(target)], await getLinks(target));
    });

    test("Link with comment id", async () => {
        const target = "T123#412";
        assert.deepEqual([linkAt(target)], await getLinks(target));
    });

    test("Link inside braces", async () => {
        const target = "{T123}";
        assert.deepEqual([linkAt('T123', 1)], await getLinks(target));
    });

    test("Task in existing URL should not be linked", async () => {
        const target = "http://foobar/T123";
        assert.deepEqual([], await getLinks(target));
    });

    // TODO could support rX123 revision objects:
    // rX123         # Link to SVN commit 123 from the "X" repository
    // rXaf3192cd5   # Link to Git commit "af3192cd5..." from the "X" repository.
    // # Git hash must specify at least 7 characters of the hash.
});
