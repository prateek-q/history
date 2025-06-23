import {
    Editor,
    MarkdownEditView,
    MarkdownView,
    Notice,
    Plugin,
    TFile,
    Vault,
    moment,
} from "obsidian";



export default class ExamplePlugin extends Plugin {
    statusBarTextElement: HTMLSpanElement;
    async onload() {
        this.addRibbonIcon(
            "info",
            "Calculate average file length",
            async () => {
                new Notice(`The average file length is characters.`);
            }
        );
        // this.settings.counter += 1;
        // await this.saveData(this.settings);
        // new Notice(`Counter incremented to: ${this.settings.counter}`);

        // const today = window.moment().format("YYYY-MM-DD");
        // // console.log(today); // "2025-06-21"
        // const folderPath = "Revise";
        // const filename_1 = `Revise/${today}.md`;
        // let file_1: TFile;

        // const content_4 = `hi uhik`;
        // try {
        // 	// Ensure folder exists
        // 	if (!(await this.app.vault.adapter.exists(folderPath))) {
        // 		await this.app.vault.createFolder(folderPath);
        // 	}
        // } catch (error) {
        // 	console.error("Error creating Folder:", error);
        // }
        // try {
        // 	// Ensure folder exists
        // 	if (!(await this.app.vault.adapter.exists(filename_1))) {
        // 		file_1 = await this.app.vault.create(filename_1, content_4);
        // 	}
        // 	else file_1 = await this.app.vault.getAbstractFileByPath(filename_1) as TFile
        // } catch (error) {
        // 	console.error("Error creating file:", error);
        // }

        // // Track every file change with 'file-open' event
        // // let active_file: TFile, file_content: string;
        // this.registerEvent(
        // 	this.app.workspace.on("file-open", async () => {
        // 		const activeFile = this.app.workspace.getActiveFile()
        // 		if(activeFile){
        // 			new Notice(`Active File ${activeFile.path}`);
        // 			const fileContent = await this.app.vault.read(activeFile)
        // 		}
        // 		else {

        // 		}

        // 	})
        // );

        // this.registerEvent(
        // 	this.app.workspace.on("active-leaf-change", async () => {
        // 		const activeFile = this.app.workspace.getActiveFile();
        // 		if (activeFile) {
        // 			// new Notice(`Active File ${activeFile.path}`);
        // 			// console.log(activeFile)
        // 			const filePath = activeFile.path;
        // 			active_file = activeFile;
        // 			const fileContent = await this.app.vault.read(activeFile);

        // 			file_content = fileContent;
        // 		} else {
        // 			new Notice("No file is active");
        // 		}
        // 		// console.log(active_file)
        // 		 const newFileContent = await this.app.vault.read(active_file);
        // 		const oldFileContent = file_content;
        // 		console.log(oldFileContent)
        // 		console.log(newFileContent)

        // 		console.log(findAddedSubstring(newFileContent, oldFileContent));
        // 		const activeFile_1 = file_1;
        // 		const content = await this.app.vault.read(activeFile_1);
        // 		console.log(content)
        // 		if (
        // 			findAddedSubstring(newFileContent, oldFileContent) != null
        // 		) {
        // 			// console.log(findAddedSubstring(newFileContent,oldFileContent))
        // 			await this.app.vault.modify(
        // 				file_1,
        // 				 content + findAddedSubstring(newFileContent,oldFileContent)
        // 			);

        // 		}
        // 	})
        // );

        // this.addCommand({
        // 	id: 'example-command',
        // 	name: 'Example command',
        // 	hotkeys: [{ modifiers: ['Mod', 'Shift'], key: 'a' }],
        // 	callback: () => {
        // 	  console.log('Hey, you!');
        // 	},
        //   });

        //   this.addCommand({
        // 	id: 'insert-todays-date',
        // 	name: 'Insert today\'s date',
        // 	editorCallback: (editor: Editor) => {
        // 	  editor.replaceRange(
        // 		moment().format('YYYY-MM-DD'),
        // 		editor.getCursor()
        // 	  );
        // 	},
        //   });

        // function findAddedSubstring(str1: string, str2: string): string {
        // 	// Identify shorter and longer strings
        // 	const [shortStr, longStr] =
        // 		str1.length <= str2.length ? [str1, str2] : [str2, str1];

        // 	// If one string is empty, return the other
        // 	if (shortStr.length === 0) {
        // 		return longStr;
        // 	}

        // 	// Check if longStr can be formed by adding a substring to shortStr
        // 	for (let i = 0; i <= shortStr.length; i++) {
        // 		// Try removing a substring from longStr starting at position i
        // 		for (let j = i; j <= longStr.length; j++) {
        // 			// Construct a string by removing the substring from longStr
        // 			const prefix = longStr.slice(0, i);
        // 			const suffix = longStr.slice(j);
        // 			const candidate = prefix + suffix;

        // 			// If the constructed string matches shortStr, the removed part is the added substring
        // 			if (candidate === shortStr) {
        // 				return longStr.slice(i, j);
        // 			}
        // 		}
        // 	}

        // 	// If no valid substring is found, return null
        // 	return " ";
        // }

        const activeFile = this.app.workspace.getActiveFile();
        if (!activeFile) {
            new Notice("No active file found on plugin load!");
            return;
        }
        const editor = this.app.workspace?.activeEditor?.editor;
        if (!editor) {
            new Notice("No editor available for the active file!");
            return;
        }

        const activeView =this.app.workspace.getActiveViewOfType(MarkdownView);
        console.log(activeView?.data);

        this.app.workspace.on('file-open', () => {
            const currentContent = editor.getValue();
            
            editor.setValue(
                currentContent +
                `\nText appended on plugin load!`
            );
            new Notice(
                `Appended text to ${activeFile.name} `
            );
        })

    }
    async unload(): Promise<void> {
        console.log("MyPlugin unloaded");
    }
}
