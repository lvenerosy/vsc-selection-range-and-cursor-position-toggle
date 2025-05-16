# Selection Range and Selection Cursor Position Toggle

A VS Code extension that provides two features:

1. **Select Line Range** (`Alt+G`): Opens a dropdown to input two line numbers separated by a space (e.g., "8 10"). Selects from the beginning of the start line to the end of the end line. If numbers are in reverse order (e.g., "10 8"), selects from the beginning of the lower line to the beginning of the higher line.
2. **Toggle Cursor Position in Selection** (`Ctrl+K Ctrl+A`): Toggles the cursor between the start and end of the current selection.

## Requirements

- VS Code version 1.85.0 or higher.
