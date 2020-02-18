/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Generic accessible modal popup dialog.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

import H from '../../parts/Globals.js';
const doc = H.doc;

/**
 * @private
 */
class ModalDialog {
    private dialogContainer: HTMLElement;
    private contentContainer: HTMLElement;
    private closeButton: HTMLElement;

    constructor(private parentDiv: HTMLElement, content?: string) {
        const dc = this.dialogContainer = doc.createElement('div');
        dc.className = 'highcharts-modal-dialog';

        this.contentContainer = doc.createElement('div');
        this.closeButton = doc.createElement('button');
        this.closeButton.onclick = (): void => this.hide();

        this.addDialogStyle();

        if (content) {
            this.setContent(content);
        }

        dc.appendChild(this.closeButton);
        dc.appendChild(this.contentContainer);
        parentDiv.appendChild(dc);
    }


    setContent(content: string): void {
        this.contentContainer.innerHTML = content;
        this.updateDialogPosition();
    }


    show(): void {
        this.dialogContainer.style.display = 'block';
    }


    hide(): void {
        this.dialogContainer.style.display = 'none';
    }


    destroy(): void {
        this.dialogContainer.remove();
    }


    private updateDialogPosition(): void {
        // In order to get dimensions we need to show the dialog.
        // This will not be visible to the end user, as the browser
        // will not repaint while JS is running synchronously.
        this.show();
        const dialogWidth = this.dialogContainer.clientWidth;
        const dialogHeight = this.dialogContainer.clientHeight;
        const parentWidth = this.parentDiv.clientWidth;
        const parentHeight = this.parentDiv.clientHeight;
        this.hide();

        const top = (parentHeight - dialogHeight) / 2;
        const left = (parentWidth - dialogWidth) / 2;

        this.dialogContainer.style.top = top + 'px';
        this.dialogContainer.style.left = left + 'px';
    }


    private addDialogStyle(): void {
        this.addParentStyle();
        this.dialogContainer.style.cssText = [
            'display: none',
            'position: absolute',
            'background-color: #fff',
            'box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)'
        ].join(';');
    }


    private addParentStyle(): void {
        const parentStyle = this.parentDiv.style;
        if (parentStyle.position && parentStyle.position !== 'relative') {
            throw new Error(
                'Highcharts ModalDialog: Could not set "position: relative" style on parent div.'
            );
        }
        parentStyle.position = 'relative';
    }
}

export default ModalDialog;
