import { Plugin, Editor, EditorChange } from 'obsidian';

export default class ExamplePlugin extends Plugin {
  async onload() {
    // Register an event listener for editor changes
    this.registerEvent(
      this.app.workspace.on('editor-change', (editor: Editor, change: EditorChange) => {
        // Log the change details to the console
        console.log('Change detected:', change);
      })
    );
    console.log('ExamplePlugin loaded!');
  }

  onunload() {
    console.log('ExamplePlugin unloaded!');
  }
}