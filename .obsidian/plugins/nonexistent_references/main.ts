import { App, Modal, Plugin } from 'obsidian';
import type { TFile } from 'obsidian';

// Remember to rename these classes and interfaces!

function getIndexFromLineAndColumn(inputString: string, lineNumber: number, columnNumber: number) {
    const lines = inputString.split('\n');
  
    if (lineNumber <= 0 || lineNumber > lines.length) {
      // Handle invalid line numbers
      return -1;
    }
  
    if (columnNumber <= 0 || columnNumber > lines[lineNumber - 1].length + 1) {
      // Handle invalid column numbers for the given line
      return -1;
    }
  
    let index = 0;
    for (let i = 0; i < lineNumber - 1; i++) {
      index += lines[i].length + 1; // +1 to account for the newline character
    }
    index += columnNumber - 1;
  
    return index;
  }

export default class NonexistentRef extends Plugin {
    async onload() {
        // This adds a simple command that can be triggered anywhere
        this.addCommand({
            id: 'list-nonexistent-references',
            name: 'List Nonexistent References in this Vault',
            callback: () => {
                new NonexistentRefModal(this.app).open();
            }
        });
    }
}

class Reference {
    reference: string;
    fileOccurrences: ReferenceFileOccurrences[];

    constructor(reference: string) {
        this.reference = reference;
        this.fileOccurrences = [];
    }

    addOccurrences(occurences: ReferenceFileOccurrences) {
        this.fileOccurrences.push(occurences);
    }
}

class ReferenceFileOccurrences {
    file: TFile;
    occurences: { line: number, ch: number }[];

    constructor(file: TFile) {
        this.file = file;
        this.occurences = [];
    }

    addOccurrence(occurence: { line: number, ch: number }) {
        this.occurences.push(occurence);
    }
}


class NonexistentRefModal extends Modal {
    constructor(app: App) {
        super(app);
    }

    async onOpen() {
        const { contentEl } = this;

        // Use a separate async function to retrieve and process references
        const references = await this.retrieveAndProcessReferences();

        const title = document.createElement('div');
        title.classList.add('modal-title');
        title.textContent = 'Nonexistent References';
        contentEl.appendChild(title);

        // Create a container for the elements
        const container = document.createElement('div');

        // Generate and append elements for each reference
        references.forEach(async (reference) => {
            const referenceElement = this.createReferenceElement(reference);
            container.appendChild(await referenceElement);
        });

        // Append the container to the modal's content
        contentEl.appendChild(container);
        contentEl.classList.add('modal-references');
    }

    onClose() {
        const { contentEl } = this;
        contentEl.empty();
    }

    async createTreeItemSelf(referenceData: Reference) {
        const item = document.createElement('div');
        item.classList.add('tree-item-self');
        item.classList.add('search-result-file-title');
        item.classList.add('is-clickable');

        const itemInner = document.createElement('div');
        itemInner.classList.add('tree-item-inner');
        itemInner.classList.add('reference-item-element-center');
        itemInner.innerHTML = referenceData.reference;
        item.appendChild(itemInner);

        const collapseIcon = document.createElement('div');
        collapseIcon.classList.add('tree-item-icon');
        collapseIcon.classList.add('collapse-icon');
        collapseIcon.classList.add('is-collapsed');
        collapseIcon.classList.add('references-collapse-icon');
        collapseIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon right-triangle">
                <path d="M3 8L12 17L21 8"></path>
            </svg>        
        `;

        item.addEventListener('click', async () => {
            item.classList.toggle('is-collapsed');
            collapseIcon.classList.toggle('is-collapsed');
            const par = item.parentElement;
            if (par?.classList.contains('is-collapsed')) {
                const matches = await this.createReferenceMatches(referenceData);
                par?.appendChild(matches);
            }
            else {
                const matches = par?.querySelectorAll('.reference-matches');
                matches?.forEach((match) => {
                    par?.removeChild(match);
                })
            }
            par?.classList.toggle('is-collapsed');
        })

        item.appendChild(collapseIcon);

        const countElement = document.createElement('div');
        countElement.textContent = `${referenceData.fileOccurrences.length}`;
        countElement.classList.add('reference-count');
        countElement.classList.add("tree-item-flair");
        countElement.classList.add('reference-item-element-center');
        item.appendChild(countElement);

        const flairOuter = document.createElement('div');
        flairOuter.classList.add('tree-item-flair-outer');

        const createFileButton = document.createElement('button');
        createFileButton.textContent = '+';
        createFileButton.classList.add('create-file-button');
        createFileButton.classList.add('clickable-icon');
        createFileButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-plus">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
        `;

        createFileButton.addEventListener('click', () => {
            this.app.workspace.openLinkText(`${referenceData.reference}`, referenceData.reference);
            this.close();
        });

        flairOuter.appendChild(createFileButton);
        item.appendChild(flairOuter);

        return item;
    }

    async createReferenceMatches(referenceData: Reference) {
        const matchList = document.createElement('div');
        matchList.classList.add('reference-matches');

        referenceData.fileOccurrences.forEach((fileOccurrence) => {
            const matchedFile = document.createElement('div');
            matchedFile.classList.add('reference-match-file');

            const fileName = document.createElement('div');
            fileName.classList.add('reference-match-file-name');
            fileName.classList.add('reference-match-item');
            fileName.classList.add('tree-item-self');
            fileName.classList.add('is-clickable');
            fileName.textContent = fileOccurrence.file.basename;
            matchedFile.appendChild(fileName);


            fileName.addEventListener('click', () => {
                this.app.workspace.openLinkText(`${fileOccurrence.file.basename}`, fileOccurrence.file.basename);
                this.app.workspace.activeEditor?.editor?.scrollIntoView({ from: fileOccurrence.occurences[0], to: fileOccurrence.occurences[0] });
                this.close();
            })

            const matchedFileInner = document.createElement('div');
            matchedFileInner.classList.add('reference-match-file-inner');

            fileOccurrence.occurences.forEach(async (occurence) => {

                // read the file
                const fileContent = await this.app.vault.read(fileOccurrence.file);
                // find the index of the occurence based on line and column
                const index = getIndexFromLineAndColumn(fileContent, occurence.line, occurence.ch);

                // find the index where ]] occurs
                const endIndex = fileContent.slice(index).indexOf(']]');

                // take an excerpt from index - 16 to endIndex + 16
                const excerpt = fileContent.slice(Math.max(0, index - 20), index + endIndex + 20);

                const pos = document.createElement('div');
                pos.classList.add('reference-match-file-pos');
                pos.classList.add('search-result-file-matches');
                pos.classList.add('tree-item-self');
                pos.classList.add('is-clickable');
                pos.classList.add('reference-match-item');
                pos.textContent = `...${excerpt}...`;

                pos.addEventListener('click', () => {
                    this.app.workspace.openLinkText(`${fileOccurrence.file.basename}`, fileOccurrence.file.basename);
                    this.app.workspace.activeEditor?.editor?.scrollIntoView({ from: occurence, to: occurence });
                    this.close();
                })

                console.log(excerpt);

                matchedFileInner.appendChild(pos);
            })

            matchedFile.appendChild(matchedFileInner);

            matchList.appendChild(matchedFile);
        })

        return matchList;
    }

    async createReferenceElement(referenceData: Reference) {
        const treeItem = document.createElement('div');
        treeItem.classList.add('tree-item');
        treeItem.classList.add('search-result');
        treeItem.classList.add('is-collapsed');

        treeItem.appendChild(await this.createTreeItemSelf(referenceData));

        return treeItem;
    }


    async parseFileForReferences(file: TFile): Promise<Reference[]> {
        const fileContent = await this.app.vault.read(file);

        const referencePattern = /\[\[([^#|\]]+)(?:#[^|\]]+)?(?:\|[^|\]]+)?]]/g;
        let match;

        const references: Reference[] = [];

        while ((match = referencePattern.exec(fileContent)) !== null) {
            const referenceName = match[1];
            const position = match.index;
            const lineNumber = fileContent.substring(0, position).split('\n').length;
            const columnNumber = fileContent.substring(0, position).split('\n')[lineNumber - 1].length;

            // Store the reference, file, line, and column data
            let reference = references.find((reference) => {
                return reference.reference === referenceName;
            });

            if (!reference) {
                reference = new Reference(referenceName);
                references.push(reference);
                const fileOccurences = new ReferenceFileOccurrences(file);
                fileOccurences.addOccurrence({ line: lineNumber, ch: columnNumber });
                reference.addOccurrences(fileOccurences);
            }
            else {
                reference.fileOccurrences[0].addOccurrence({ line: lineNumber, ch: columnNumber });
            }
        }

        return references;
    }

    async retrieveAndProcessReferences(): Promise<Reference[]> {
        const markdownFiles: TFile[] = this.app.vault.getFiles();
        const references: Reference[] = [];
        const fileNames: string[] = [];

        for (const file of markdownFiles) {
            fileNames.push(file.name);
            fileNames.push(file.basename);

            if (file.extension !== 'md') {
                continue;
            }

            const data = await this.parseFileForReferences(file);
            for (const reference of data) {
                const existingReference = references.find((existingReference) => {
                    return existingReference.reference === reference.reference;
                })
                if (!existingReference) {
                    references.push(reference);
                }
                else {
                    existingReference.fileOccurrences.push(...reference.fileOccurrences);
                }
            }
        }


        // filter all elements of "names" out of the references
        const filteredReferences = references.filter((reference) => {
            return !fileNames.includes(reference.reference);
        });

        return filteredReferences;
    }
}

