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
/**
 * @private
 */
var ModalDialog = /** @class */ (function () {
    function ModalDialog(parentDiv, content) {
        var _this = this;
        this.parentDiv = parentDiv;
        var dc = this.dialogContainer = doc.createElement('div');
        dc.className = 'highcharts-modal-dialog';
        this.contentContainer = doc.createElement('div');
        this.closeButton = doc.createElement('button');
        this.closeButton.onclick = function () { return _this.hide(); };
        this.addDialogStyle();
        if (content) {
            this.setContent(content);
        }
        dc.appendChild(this.closeButton);
        dc.appendChild(this.contentContainer);
        parentDiv.appendChild(dc);
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
        var dialogWidth = this.dialogContainer.clientWidth;
        var dialogHeight = this.dialogContainer.clientHeight;
        var parentWidth = this.parentDiv.clientWidth;
        var parentHeight = this.parentDiv.clientHeight;
        this.hide();
        var top = (parentHeight - dialogHeight) / 2;
        var left = (parentWidth - dialogWidth) / 2;
        this.dialogContainer.style.top = top + 'px';
        this.dialogContainer.style.left = left + 'px';
    };
    ModalDialog.prototype.addDialogStyle = function () {
        this.addParentStyle();
        this.dialogContainer.style.cssText = [
            'display: none',
            'position: absolute',
            'background-color: #fff',
            'box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)'
        ].join(';');
    };
    ModalDialog.prototype.addParentStyle = function () {
        var parentStyle = this.parentDiv.style;
        if (parentStyle.position && parentStyle.position !== 'relative') {
            throw new Error('Highcharts ModalDialog: Could not set "position: relative" style on parent div.');
        }
        parentStyle.position = 'relative';
    };
    return ModalDialog;
}());
export default ModalDialog;
