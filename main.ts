import { ExampleModal } from "ExampleModal";
import {

	Plugin,
	TFile,

} from "obsidian";

export default class ExamplePlugin extends Plugin {
	statusBarTextElement: HTMLSpanElement;
	async onload() {
		this.addRibbonIcon(
			"aperture",
			"Calculate average file length",
			async () => {
				new ExampleModal(this.app).open();
			}
		);
		this.app.workspace.onLayoutReady(async () => {

			console.log("started onload");
			const today = window.moment().format("YYYY-MM-DD");
			// console.log(today); // "2025-06-21"
			const folderPath = "Revise";
			const filename_1 = `${today}.md`;
			let file_1 = await this.createFileIfNotExists(folderPath, filename_1);

			// Ensure folder exists

			let oldContent: string | undefined | null,
				newContent: string | undefined | null;
			let oldFile: TFile;

			this.app.workspace.on("active-leaf-change", async () => {
				const activeFile = this.app.workspace.getActiveFile();
				if (!activeFile) return;
				if (activeFile == file_1) return;
				const content = (await this.app.vault.read(activeFile)).toString();
				oldContent = content;
				oldFile = activeFile;
			});
			this.app.workspace.on("editor-change", async (editor) => {
				if (oldContent == this.app.workspace.getActiveFile()) return;
				const content = editor.getValue();
				newContent = content;
			});

			let data: string | undefined | null;
			this.app.workspace.on("editor-change", async () => {
				if (oldFile == file_1) return;

				if (oldContent == undefined) oldContent = "";
				if (newContent == undefined) newContent = "";
				data = this.findAddedSubstring(oldContent, newContent);
				// console.log(data)
			});

			this.app.workspace.on("file-open", async () => {
				if (this.app.workspace.getLastOpenFiles().at(0) == filename_1) {
					data = ""
					return;
				}
				const file = file_1;
				if (data == undefined || data == null || data == "") {
					return;
				}
				// console.log(data)

				const currentContent = await this.app.vault.read(file);
				console.log()

				let content: string | null =
					currentContent + `\n<details>
<summary><b>${this.app.workspace.getLastOpenFiles().at(0)}</b></summary>\n
  ${data.trim()}
</details>`

				data = null;
				oldContent = null;
				newContent = null;

				if (currentContent != content)
					await this.app.vault.modify(file, content);
				content = null;
				data = null;
				oldContent = null;
				newContent = null;
			});
		})


	}
	async onCreate() {
		if (!this.app.workspace.layoutReady) {

			return;
		}
		// ...
	}

	private async createFileIfNotExists(folderPath: string, filename: string) {
		const fullPath = `${folderPath}/${filename}`;

		// Ensure folder exists
		if (!(await this.app.vault.adapter.exists(folderPath))) {
			await this.app.vault.createFolder(folderPath);
		}

		let file: TFile;
		if (!(await this.app.vault.adapter.exists(fullPath))) {
			file = await this.app.vault.create(fullPath, "");
		} else {
			const retrievedFile = this.app.vault.getFileByPath(fullPath);
			if (!retrievedFile) {
				console.log(retrievedFile)
				throw new Error(
					`File at ${fullPath} exists but could not be retrieved.`
				);
			}
			file = retrievedFile;
		}

		return file;
	}

	private findAddedSubstring(str1: string, str2: string): string {
		// Identify shorter and longer strings
		console.log(str1)
		console.log(str2)
		// Check if longStr can be formed by adding a substring to shortStr
		const oldLines = str1.split('\n');
		const newLines = str2.split('\n');
		// Count occurrences of each line in oldStr
		const lineCount = new Map();
		for (const line of oldLines) {
			lineCount.set(line, (lineCount.get(line) || 0) + 1);
		}
		
		// Collect lines that are added in newStr
		const addedLines = [];
		for (const line of newLines) {
			if (lineCount.has(line) && lineCount.get(line) > 0) {
				// Line exists in oldStr and has remaining occurrences, decrement count
				lineCount.set(line, lineCount.get(line) - 1);
			} else {
				// Line is either not in oldStr or exceeds its count, add it
				addedLines.push(line.trim());
			}
		}
		
		// Join added lines with newline and return
		return addedLines.join('\n');
	}

	unload(): void {
		console.log("Unload");
	}
}
