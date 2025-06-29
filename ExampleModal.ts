import { App, Modal, MarkdownRenderer, Component, Setting, MarkdownPreviewRenderer } from "obsidian";
import { useState } from "react";

export class ExampleModal extends Modal {
	result: string;
	onSubmit: (result: string) => void;
	private content: string = ""; // Store the file content for editing
	private filePath_1: string; // Store the file path
	private activeTab: string = "content"; // Track the active tab
	private contentElContainer: HTMLElement; // Container for tab content
	private file_1: any; // Store the file object
	private file_yesterday: any;
	private file_week: any;
	private file_month: any;
	private filePath_yesterday: string;
	private filePath_week: string;
	private filePath_month: string;

	constructor(app: App) {
		super(app);
		const today = window.moment().format("YYYY-MM-DD");
		const folderPath = "Revise";
		const filename_1 = `${today}.md`;
		this.filePath_1 = `${folderPath}/${filename_1}`;
		this.file_1 = this.app.vault.getFileByPath(this.filePath_1);
		// Get yesterday's date
		const yesterday = window
			.moment()
			.subtract(1, "days")
			.format("YYYY-MM-DD");

		// Get date from a week ago
		const week = window
			.moment()
			.subtract(7, "days")
			.format("YYYY-MM-DD");

		// Get date from a month ago
		const month = window
			.moment()
			.subtract(1, "months")
			.format("YYYY-MM-DD");
		const filename_yesterday = `${yesterday}.md`;
		const filename_week = `${week}.md`;
		const filename_month = `${month}.md`;
		this.filePath_yesterday = `${folderPath}/${filename_yesterday}`;
		this.filePath_week = `${folderPath}/${filename_week}`;
		this.filePath_month = `${folderPath}/${filename_month}`;
		this.file_yesterday = this.app.vault.getFileByPath(this.filePath_yesterday);
		this.file_week = this.app.vault.getFileByPath(this.filePath_week);
		this.file_month = this.app.vault.getFileByPath(this.filePath_month);
	}

	async onOpen() {
		const today = window.moment().format("YYYY-MM-DD");
		const folderPath = "Revise";
		const filename_1 = `${today}.md`;
		const filePath = `${folderPath}/${filename_1}`;
		const file_1 = this.app.vault.getFileByPath(filePath);

		const { contentEl } = this;

		// Display a loading message while processing
		const loadingEl = contentEl.createEl("p", { text: "Loading..." });


		// Create tab navigation
		const tabNa = new Setting(contentEl).addButton((btn) =>
			btn.setButtonText("Today").onClick(() => this.switchTab("Today"))
		)
			.addButton((btn) =>
				btn.setButtonText("Day").onClick(() => this.switchTab("Day"))
			)
			.addButton((btn) =>
				btn.setButtonText("Week").onClick(() => this.switchTab("Week"))
			)
			.addButton((btn) =>
				btn
					.setButtonText("Month")
					.onClick(() => this.switchTab("Month"))
			);

		// Container for tab content
		this.contentElContainer = contentEl.createDiv();
		loadingEl.remove();
		const component = new Component();
		component.load();
		// Render initial tab content
		await this.renderTabContent(component);

		// Add action buttons
	}

	private async switchTab(tab: string) {
		this.activeTab = tab;
		// Clear current content
		this.contentElContainer.empty();
		// Update tab button styles
		const tabNav = this.contentEl.querySelector(".setting-item");
		if (tabNav) {
			const buttons = tabNav.querySelectorAll("button");
			buttons.forEach((btn, index) => {
				btn.classList.toggle(
					"mod-cta",
					index === ["Today", "Day", "Week", "Month"].indexOf(tab)
				);
			});
		}
		const component = new Component();
		component.load();
		// Render new tab content
		await this.renderTabContent(component);
	}

	private async renderTabContent(component: Component) {

		const container = this.contentElContainer;
		const markdownContainer = container.createEl("div");

		if (this.activeTab === "Day") {
			// Tab 1: File Content
			container.createEl("h1", {
				text: this.file_yesterday
					? `Content of ${this.filePath_yesterday}`
					: "File not found",
			});
			if (this.file_yesterday) {
				const content = await this.app.vault.read(this.file_yesterday);
				// console.log("hello")
				await MarkdownRenderer.render(
					this.app,
					content,
					container,
					this.file_yesterday.path,
					component
				);
			} else {
				await MarkdownRenderer.render(
					this.app,
					`The file \`${this.filePath_yesterday}\` does not exist.`,
					markdownContainer,
					"",
					component
				);
			}
		} else if (this.activeTab === "Week") {
			// Tab 2: File Info
			container.createEl("h1", {
				text: this.file_week
					? `Content of ${this.filePath_week}`
					: "File not found",
			});
			if (this.file_week) {
				const content = await this.app.vault.read(this.file_week);
				// console.log("hello")
				await MarkdownRenderer.render(
					this.app,
					content,
					container,
					this.file_week.path,
					component
				);
			} else {
				await MarkdownRenderer.render(
					this.app,
					`The file \`${this.filePath_week}\` does not exist.`,
					markdownContainer,
					"",
					component
				);
			}
		} else if (this.activeTab === "Month") {
			// Tab 3: Help
			container.createEl("h1", {
				text: this.file_month
					? `Content of ${this.filePath_month}`
					: "File not found",
			});
			if (this.file_month) {
				const content = await this.app.vault.read(this.file_month);
				// console.log("hello")
				await MarkdownRenderer.render(
					this.app,
					content,
					container,
					this.file_month.path,
					component
				);
			} else {
				await MarkdownRenderer.render(
					this.app,
					`The file \`${this.filePath_month}\` does not exist.`,
					markdownContainer,
					"",
					component
				);
			}
		} else {
			// Tab 4: Help
			container.createEl("h1", {
				text: this.file_1
					? `Content of ${this.filePath_1}`
					: "File not found",
			});

			if (this.file_1) {
			
				const content = await this.app.vault.read(this.file_1);
				// console.log(content)
				// console.log("hello")
				await MarkdownRenderer.render(
					this.app,
					content,
					container,
					this.file_1.path,
					component);
			} else {
				await MarkdownRenderer.render(
					this.app,
					`The file \`${this.filePath_1}\` does not exist.`,
					markdownContainer,
					"",
					component
				);
			}
		}
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
