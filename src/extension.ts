import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let selectRange = vscode.commands.registerCommand(
    "extension.selectRange",
    async () => {
      const input = await vscode.window.showInputBox({
        prompt: 'Enter two line numbers separated by a space (e.g., "8 10")',
        placeHolder: "startLine endLine",
      });

      if (!input) {
        return;
      }

      const numbers = input
        .trim()
        .split(/\s+/)
        .map((num) => parseInt(num));
      if (numbers.length !== 2 || numbers.some(isNaN)) {
        vscode.window.showErrorMessage(
          "Please enter two valid numbers separated by a space."
        );
        return;
      }

      let [startLine, endLine] = numbers;

      const isReverse = startLine > endLine;
      if (isReverse) {
        [startLine, endLine] = [endLine, startLine];
      }

      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor.");
        return;
      }

      const document = editor.document;
      const maxLine = document.lineCount;
      if (startLine < 1 || endLine > maxLine) {
        vscode.window.showErrorMessage(
          `Line numbers must be between 1 and ${maxLine}.`
        );
        return;
      }

      // Convert to 0-based indexing
      startLine -= 1;
      endLine -= 1;

      let selectionStart: vscode.Position;
      let selectionEnd: vscode.Position;

      if (isReverse) {
        // Select from beginning of startLine to beginning of endLine
        selectionStart = new vscode.Position(startLine, 0);
        selectionEnd = new vscode.Position(endLine, 0);
      } else {
        // Select from beginning of startLine to end of endLine
        const endLineText = document.lineAt(endLine).text;
        selectionStart = new vscode.Position(startLine, 0);
        selectionEnd = new vscode.Position(endLine, endLineText.length);
      }

      editor.selection = new vscode.Selection(selectionStart, selectionEnd);
      editor.revealRange(new vscode.Range(selectionStart, selectionEnd));
    }
  );

  let toggleCursor = vscode.commands.registerCommand(
    "extension.toggleCursorPosition",
    () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active text editor.");
        return;
      }

      const selection = editor.selection;
      if (selection.isEmpty) {
        vscode.window.showErrorMessage("No selection to toggle.");
        return;
      }

      const isCursorAtEnd = selection.active.isEqual(selection.end);
      const newSelection = isCursorAtEnd
        ? new vscode.Selection(selection.end, selection.start)
        : new vscode.Selection(selection.start, selection.end);

      editor.selection = newSelection;
    }
  );

  context.subscriptions.push(selectRange);
  context.subscriptions.push(toggleCursor);
}

export function deactivate() {}
