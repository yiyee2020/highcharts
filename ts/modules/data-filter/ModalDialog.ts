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
const userAgent = H.win.navigator.userAgent;


/**
 * @private
 */
class ModalDialog {
    private dialogContainer: HTMLElement;
    private flexContainer: HTMLElement;
    private dialogBox: HTMLElement;
    private innerContainer: HTMLElement;
    private contentContainer: HTMLElement;
    private closeButton: HTMLElement;
    private useFlex: boolean;

    constructor(private parentDiv: HTMLElement, content?: string) {
        this.useFlex = !(/msie/i.test(userAgent)); // Don't use flexbox on IE

        const dc = this.dialogContainer = doc.createElement('div');
        dc.className = 'highcharts-modal-dialog';

        const flexContainer = this.flexContainer = doc.createElement('div');
        const dialogBox = this.dialogBox = doc.createElement('div');
        const innerContainer = this.innerContainer = doc.createElement('div');
        const contentContainer = this.contentContainer = doc.createElement('div');
        contentContainer.className = 'highcharts-modal-content-container';

        const closeButton = this.closeButton = doc.createElement('button');
        closeButton.className = 'highcharts-modal-close-button';
        closeButton.onclick = (): void => this.hide();

        this.addDialogStyle();

        if (content) {
            this.setContent(content);
        }

        innerContainer.appendChild(closeButton);
        innerContainer.appendChild(contentContainer);
        dialogBox.appendChild(innerContainer);
        flexContainer.appendChild(dialogBox);
        dc.appendChild(flexContainer);
        parentDiv.insertBefore(dc, parentDiv.firstChild);
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
        const parentHeight = this.parentDiv.clientHeight + 'px';
        this.hide();

        this.flexContainer.style.height = parentHeight;

        if (!this.useFlex) {
            this.flexContainer.style.lineHeight = parentHeight;
        }
    }


    private addDialogStyle(): void {
        const setElementStyle = (el: HTMLElement, styles: string[]): void => {
            el.style.cssText = styles.join(';');
        };

        setElementStyle(this.dialogContainer, [
            'display: none',
            'position: relative',
            'z-index: 9999'
        ]);

        setElementStyle(this.flexContainer, [
            'position: absolute',
            'left: 0',
            'right: 0'
        ].concat(this.useFlex ? [
            'display: flex',
            'justify-content: center',
            'align-items: center'
        ] : [
            'text-align: center',
            'vertical-align: middle'
        ]));

        setElementStyle(this.dialogBox, [
            'background-color: #fff',
            'box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)'
        ].concat(this.useFlex ? [] : [
            'display: inline-block',
            'line-height: initial'
        ]));

        setElementStyle(this.innerContainer, [
            'position: relative',
            'padding: 10px'
        ]);

        setElementStyle(this.closeButton, [
            'position: absolute',
            'right: 5px',
            'top: 5px'
        ]);
    }
}

export default ModalDialog;
