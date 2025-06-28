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
			const file_2 = this.app.vault.getAbstractFileByPath('Personal/Health.md')
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
<summary> <b>\n${this.app.workspace.getLastOpenFiles().at(0)}\n</b> </summary>
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
	private async delay(seconds: number) {
		return new Promise(resolve => setTimeout(resolve, seconds * 1000));
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
		if (str1.length >= str2.length) return "";
		const [shortStr, longStr] =
			str1.length <= str2.length ? [str1, str2] : [str2, str1];

		// If one string is empty, return the other
		if (shortStr.length === 0) {
			return longStr;
		}

		// Check if longStr can be formed by adding a substring to shortStr
		for (let i = 0; i <= shortStr.length; i++) {
			// Try removing a substring from longStr starting at position i
			for (let j = i; j <= longStr.length; j++) {
				// Construct a string by removing the substring from longStr
				const prefix = longStr.slice(0, i);
				const suffix = longStr.slice(j);
				const candidate = prefix + suffix;

				// If the constructed string matches shortStr, the removed part is the added substring
				if (candidate === shortStr) {
					return longStr.slice(i, j);
				}
			}
		}

		// If no valid substring is found, return null
		return " ";
	}

	unload(): void {
		console.log("Unload");
	}
}
