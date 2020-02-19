/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Generic accessible popup dialog.
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

// TODO: Title, styling options, lang options, styled mode


/**
 * @private
 */
class PopupDialog {
    private dialogContainer: HTMLElement;
    private flexContainer: HTMLElement;
    private dialogBox: HTMLElement;
    private innerContainer: HTMLElement;
    private contentContainer: HTMLElement;
    private closeButton: HTMLElement;
    private useFlex: boolean;

    constructor(private parentDiv: HTMLElement, content?: HTMLElement) {
        this.useFlex = !(/msie/i.test(userAgent)); // Don't use flexbox on IE

        const dc = this.dialogContainer = doc.createElement('div');
        dc.className = 'highcharts-popup-dialog';
        dc.setAttribute('aria-hidden', 'false'); // To ensure a11y module does not hide it

        const flexContainer = this.flexContainer = doc.createElement('div');
        const dialogBox = this.dialogBox = doc.createElement('div');
        dialogBox.setAttribute('role', 'dialog');
        dialogBox.setAttribute('aria-label', 'Dialog');
        dialogBox.setAttribute('tabindex', '-1');
        dialogBox.onkeydown = (e): void => e.stopPropagation(); // Stop a11y module from stealing kbd focus
        const innerContainer = this.innerContainer = doc.createElement('div');
        const contentContainer = this.contentContainer = doc.createElement('div');
        contentContainer.className = 'highcharts-popup-content-container';

        const closeButton = this.closeButton = doc.createElement('button');
        closeButton.setAttribute('aria-label', 'Close dialog');
        closeButton.innerHTML = this.getCloseButtonContent();
        closeButton.className = 'highcharts-popup-close-button';
        closeButton.onclick = (): void => this.hide();

        this.addDialogStyle();

        if (content) {
            this.setContent(content);
        }

        innerContainer.appendChild(contentContainer);
        innerContainer.appendChild(closeButton);
        dialogBox.appendChild(innerContainer);
        flexContainer.appendChild(dialogBox);
        dc.appendChild(flexContainer);
        parentDiv.insertBefore(dc, parentDiv.firstChild);
    }


    setContent(content: HTMLElement): void {
        this.contentContainer.innerHTML = '';
        this.contentContainer.appendChild(content);
        this.updateDialogPosition();
    }


    show(): void {
        this.dialogContainer.style.display = 'block';
        this.dialogBox.focus();
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
            'outline: none',
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
            'top: 5px',
            'background: none',
            'border: none',
            'padding: 0',
            'cursor: pointer'
        ]);
    }


    private getCloseButtonContent(): string {
        return '<svg width="20" height="20" viewBox="0 0 120 120">' +
            '<path stroke="#4B4B4D" stroke-width="9" stroke-linecap="round"' +
            'd="M14,14 L106,106 M106,14 L14,106"/></svg>';
    }
}

export default PopupDialog;
