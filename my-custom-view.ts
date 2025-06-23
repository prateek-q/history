// my-custom-view.ts
import { ItemView, WorkspaceLeaf } from 'obsidian';

export class MyCustomView extends ItemView {
  getViewType() {
    return 'my-custom-view';
  }

  getDisplayText() {
    return 'My Custom View';
  }

  async onOpen() {
    const { contentEl } = this;
    contentEl.setText('This is the content of my custom view!');
  }

  async onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}