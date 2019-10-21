/*
 * Copyright (C) 2009 Joseph Pecoraro
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions
 * are met:
 *
 * 1.  Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 * 2.  Redistributions in binary form must reproduce the above copyright
 *     notice, this list of conditions and the following disclaimer in the
 *     documentation and/or other materials provided with the distribution.
 * 3.  Neither the name of Apple Computer, Inc. ("Apple") nor the names of
 *     its contributors may be used to endorse or promote products derived
 *     from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY APPLE AND ITS CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL APPLE OR ITS CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 * THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.ConsolePanel=function(){WebInspector.Panel.call(this,"console")},WebInspector.ConsolePanel.prototype={get toolbarItemLabel(){return WebInspector.UIString("Console")},show:function(){WebInspector.Panel.prototype.show.call(this),this._previousConsoleState=WebInspector.drawer.state,WebInspector.drawer.enterPanelMode(),WebInspector.showConsole();
// Move the scope bar to the top of the messages, like the resources filter.
var e=document.getElementById("console-filter"),t=document.getElementById("console-messages");e.parentNode.removeChild(e),document.getElementById("console-view").insertBefore(e,t),
// Update styles, and give console-messages a top margin so it doesn't overwrite the scope bar.
e.addStyleClass("console-filter-top"),e.removeStyleClass("status-bar-item"),t.addStyleClass("console-filter-top")},hide:function(){WebInspector.Panel.prototype.hide.call(this),this._previousConsoleState===WebInspector.Drawer.State.Hidden?WebInspector.drawer.immediatelyExitPanelMode():WebInspector.drawer.exitPanelMode(),delete this._previousConsoleState;
// Move the scope bar back to the bottom bar, next to Clear Console.
var e=document.getElementById("console-filter");e.parentNode.removeChild(e),document.getElementById("other-drawer-status-bar-items").appendChild(e),
// Update styles, and remove the top margin on console-messages.
e.removeStyleClass("console-filter-top"),e.addStyleClass("status-bar-item"),document.getElementById("console-messages").removeStyleClass("console-filter-top")}},WebInspector.ConsolePanel.prototype.__proto__=WebInspector.Panel.prototype;