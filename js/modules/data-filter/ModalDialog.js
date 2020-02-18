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
var doc = H.doc;
var userAgent = H.win.navigator.userAgent;
/**
 * @private
 */
var ModalDialog = /** @class */ (function () {
    function ModalDialog(parentDiv, content) {
        var _this = this;
        this.parentDiv = parentDiv;
        this.useFlex = !(/msie/i.test(userAgent)); // Don't use flexbox on IE
        var dc = this.dialogContainer = doc.createElement('div');
        dc.className = 'highcharts-modal-dialog';
        var flexContainer = this.flexContainer = doc.createElement('div');
        var dialogBox = this.dialogBox = doc.createElement('div');
        var innerContainer = this.innerContainer = doc.createElement('div');
        var contentContainer = this.contentContainer = doc.createElement('div');
        contentContainer.className = 'highcharts-modal-content-container';
        var closeButton = this.closeButton = doc.createElement('button');
        closeButton.className = 'highcharts-modal-close-button';
        closeButton.onclick = function () { return _this.hide(); };
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
    ModalDialog.prototype.setContent = function (content) {
        this.contentContainer.innerHTML = content;
        this.updateDialogPosition();
    };
    ModalDialog.prototype.show = function () {
        this.dialogContainer.style.display = 'block';
    };
    ModalDialog.prototype.hide = function () {
        this.dialogContainer.style.display = 'none';
    };
    ModalDialog.prototype.destroy = function () {
        this.dialogContainer.remove();
    };
    ModalDialog.prototype.updateDialogPosition = function () {
        // In order to get dimensions we need to show the dialog.
        // This will not be visible to the end user, as the browser
        // will not repaint while JS is running synchronously.
        this.show();
        var parentHeight = this.parentDiv.clientHeight + 'px';
        this.hide();
        this.flexContainer.style.height = parentHeight;
        if (!this.useFlex) {
            this.flexContainer.style.lineHeight = parentHeight;
        }
    };
    ModalDialog.prototype.addDialogStyle = function () {
        var setElementStyle = function (el, styles) {
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
    };
    return ModalDialog;
}());
export default ModalDialog;
