/*
 * Copyright (C) 2007, 2008 Apple Inc.  All rights reserved.
 * Copyright (C) 2008 Matt Lilek <webkit@mattlilek.com>
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
WebInspector.ElementsPanel=function(){for(var e in WebInspector.Panel.call(this,"elements"),this.contentElement=document.createElement("div"),this.contentElement.id="elements-content",this.contentElement.className="outline-disclosure source-code",this.treeOutline=new WebInspector.ElementsTreeOutline,(this.treeOutline.panel=this).treeOutline.includeRootDOMNode=!1,this.treeOutline.selectEnabled=!0,this.treeOutline.focusedNodeChanged=function(e){for(var t in this.panel.visible&&WebInspector.currentFocusElement!==document.getElementById("search")&&(WebInspector.currentFocusElement=this.element),this.panel.updateBreadcrumb(e),this.panel.sidebarPanes)this.panel.sidebarPanes[t].needsUpdate=!0;this.panel.updateStyles(!0),this.panel.updateMetrics(),this.panel.updateProperties(),this.panel.updateEventListeners(),this._focusedDOMNode&&(InspectorBackend.addInspectedNode(this._focusedDOMNode.id),WebInspector.extensionServer.notifyObjectSelected(this.panel.name))},this.contentElement.appendChild(this.treeOutline.element),this.crumbsElement=document.createElement("div"),this.crumbsElement.className="crumbs",this.crumbsElement.addEventListener("mousemove",this._mouseMovedInCrumbs.bind(this),!1),this.crumbsElement.addEventListener("mouseout",this._mouseMovedOutOfCrumbs.bind(this),!1),this.sidebarPanes={},this.sidebarPanes.computedStyle=new WebInspector.ComputedStyleSidebarPane,this.sidebarPanes.styles=new WebInspector.StylesSidebarPane(this.sidebarPanes.computedStyle),this.sidebarPanes.metrics=new WebInspector.MetricsSidebarPane,this.sidebarPanes.properties=new WebInspector.PropertiesSidebarPane,Preferences.nativeInstrumentationEnabled&&(this.sidebarPanes.domBreakpoints=WebInspector.createDOMBreakpointsSidebarPane()),this.sidebarPanes.eventListeners=new WebInspector.EventListenersSidebarPane,this.sidebarPanes.styles.onexpand=this.updateStyles.bind(this),this.sidebarPanes.metrics.onexpand=this.updateMetrics.bind(this),this.sidebarPanes.properties.onexpand=this.updateProperties.bind(this),this.sidebarPanes.eventListeners.onexpand=this.updateEventListeners.bind(this),this.sidebarPanes.styles.expanded=!0,this.sidebarPanes.styles.addEventListener("style edited",this._stylesPaneEdited,this),this.sidebarPanes.styles.addEventListener("style property toggled",this._stylesPaneEdited,this),this.sidebarPanes.metrics.addEventListener("metrics edited",this._metricsPaneEdited,this),WebInspector.cssModel.addEventListener("stylesheet changed",this._styleSheetChanged,this),this.sidebarElement=document.createElement("div"),this.sidebarElement.id="elements-sidebar",this.sidebarPanes)this.sidebarElement.appendChild(this.sidebarPanes[e].element);this.sidebarResizeElement=document.createElement("div"),this.sidebarResizeElement.className="sidebar-resizer-vertical",this.sidebarResizeElement.addEventListener("mousedown",this.rightSidebarResizerDragStart.bind(this),!1),this._nodeSearchButton=new WebInspector.StatusBarButton(WebInspector.UIString("Select an element in the page to inspect it."),"node-search-status-bar-item"),this._nodeSearchButton.addEventListener("click",this.toggleSearchingForNode.bind(this),!1),this.element.appendChild(this.contentElement),this.element.appendChild(this.sidebarElement),this.element.appendChild(this.sidebarResizeElement),this._registerShortcuts(),this.reset()},WebInspector.ElementsPanel.prototype={get toolbarItemLabel(){return WebInspector.UIString("Elements")},get statusBarItems(){return[this._nodeSearchButton.element,this.crumbsElement]},get defaultFocusedElement(){return this.treeOutline.element},updateStatusBarItems:function(){this.updateBreadcrumbSizes()},show:function(){WebInspector.Panel.prototype.show.call(this),this.sidebarResizeElement.style.right=this.sidebarElement.offsetWidth-3+"px",this.updateBreadcrumb(),this.treeOutline.updateSelection(),this.recentlyModifiedNodes.length&&this.updateModifiedNodes()},hide:function(){WebInspector.Panel.prototype.hide.call(this),WebInspector.highlightDOMNode(0),this.setSearchingForNode(!1)},resize:function(){this.treeOutline.updateSelection(),this.updateBreadcrumbSizes()},reset:function(){this.focusedDOMNode&&(this._selectedPathOnReset=this.focusedDOMNode.path()),this.rootDOMNode=null,this.focusedDOMNode=null,WebInspector.highlightDOMNode(0),this.recentlyModifiedNodes=[],delete this.currentQuery},setDocument:function(t){function s(e){e||(e=t.body||t.documentElement),e&&(this.focusedDOMNode=e,this.treeOutline.selectedTreeElement&&this.treeOutline.selectedTreeElement.expand())}this.reset(),this.searchCanceled(),t&&(t.addEventListener("DOMNodeInserted",this._nodeInserted.bind(this)),t.addEventListener("DOMNodeRemoved",this._nodeRemoved.bind(this)),t.addEventListener("DOMAttrModified",this._attributesUpdated.bind(this)),t.addEventListener("DOMCharacterDataModified",this._characterDataModified.bind(this)),this.rootDOMNode=t,this._selectedPathOnReset?InspectorBackend.pushNodeByPathToFrontend(this._selectedPathOnReset,function(e){if(!this.focusedDOMNode){var t=e?WebInspector.domAgent.nodeForId(e):0;s.call(this,t)}}.bind(this)):s.call(this),delete this._selectedPathOnReset)},searchCanceled:function(){delete this._searchQuery,this._hideSearchHighlights(),WebInspector.updateSearchMatchesCount(0,this),this._currentSearchResultIndex=0,this._searchResults=[],InspectorBackend.searchCanceled()},performSearch:function(e){
// Call searchCanceled since it will reset everything we need before doing a new search.
this.searchCanceled();var t=e.trim();t.length&&(this._updatedMatchCountOnce=!1,this._matchesCountUpdateTimeout=null,this._searchQuery=e,InspectorBackend.performSearch(t,!1))},populateHrefContextMenu:function(e,t,s){if(!s.href)return!1;var i=WebInspector.resourceURLForRelatedNode(this.focusedDOMNode,s.href);return!!i&&(
// Add resource-related actions.
e.appendItem(WebInspector.openLinkExternallyLabel(),WebInspector.openResource.bind(null,i,!1)),WebInspector.resourceForURL(i)&&e.appendItem(WebInspector.UIString("Open Link in Resources Panel"),WebInspector.openResource.bind(null,i,!0)),!0)},switchToAndFocus:function(e){
// Reset search restore.
WebInspector.cancelSearch(),(WebInspector.currentPanel=this).focusedDOMNode=e},_updateMatchesCount:function(){WebInspector.updateSearchMatchesCount(this._searchResults.length,this),this._matchesCountUpdateTimeout=null,this._updatedMatchCountOnce=!0},_updateMatchesCountSoon:function(){if(!this._updatedMatchCountOnce)return this._updateMatchesCount();this._matchesCountUpdateTimeout||(
// Update the matches count every half-second so it doesn't feel twitchy.
this._matchesCountUpdateTimeout=setTimeout(this._updateMatchesCount.bind(this),500))},addNodesToSearchResult:function(e){if(e.length){for(var t=0;t<e.length;++t){var s=e[t],i=WebInspector.domAgent.nodeForId(s);i&&(this._currentSearchResultIndex=0,this._searchResults.push(i))}this._highlightCurrentSearchResult(),this._updateMatchesCountSoon()}},jumpToNextSearchResult:function(){this._searchResults&&this._searchResults.length&&(++this._currentSearchResultIndex>=this._searchResults.length&&(this._currentSearchResultIndex=0),this._highlightCurrentSearchResult())},jumpToPreviousSearchResult:function(){this._searchResults&&this._searchResults.length&&(--this._currentSearchResultIndex<0&&(this._currentSearchResultIndex=this._searchResults.length-1),this._highlightCurrentSearchResult())},_highlightCurrentSearchResult:function(){this._hideSearchHighlights();var e=this._searchResults[this._currentSearchResultIndex],t=this.treeOutline.findTreeElement(e);t&&(t.highlightSearchResults(this._searchQuery),t.reveal())},_hideSearchHighlights:function(e){for(var t=0;this._searchResults&&t<this._searchResults.length;++t){e=this._searchResults[t];var s=this.treeOutline.findTreeElement(e);s&&s.highlightSearchResults(null)}},renameSelector:function(e,t,s,i){
// TODO: Implement Shifting the oldSelector, and its contents to a newSelector
},get rootDOMNode(){return this.treeOutline.rootDOMNode},set rootDOMNode(e){this.treeOutline.rootDOMNode=e},get focusedDOMNode(){return this.treeOutline.focusedDOMNode},set focusedDOMNode(e){this.treeOutline.focusedDOMNode=e},_attributesUpdated:function(e){this.recentlyModifiedNodes.push({node:e.target,updated:!0}),this.visible&&this._updateModifiedNodesSoon()},_characterDataModified:function(e){this.recentlyModifiedNodes.push({node:e.target,updated:!0}),this.visible&&this._updateModifiedNodesSoon()},_nodeInserted:function(e){this.recentlyModifiedNodes.push({node:e.target,parent:e.relatedNode,inserted:!0}),this.visible&&this._updateModifiedNodesSoon()},_nodeRemoved:function(e){this.recentlyModifiedNodes.push({node:e.target,parent:e.relatedNode,removed:!0}),this.visible&&this._updateModifiedNodesSoon()},_updateModifiedNodesSoon:function(){"_updateModifiedNodesTimeout"in this||(this._updateModifiedNodesTimeout=setTimeout(this.updateModifiedNodes.bind(this),0))},updateModifiedNodes:function(){"_updateModifiedNodesTimeout"in this&&(clearTimeout(this._updateModifiedNodesTimeout),delete this._updateModifiedNodesTimeout);for(var e=[],t=!1,s=0;s<this.recentlyModifiedNodes.length;++s){var i=this.recentlyModifiedNodes[s].replaced,n=this.recentlyModifiedNodes[s].parent,d=this.recentlyModifiedNodes[s].node;if(this.recentlyModifiedNodes[s].updated){var r=this.treeOutline.findTreeElement(d);r&&r.updateTitle()}else if(n){var a=this.treeOutline.findTreeElement(n);a&&!a.alreadyUpdatedChildren&&(a.updateChildren(i),a.alreadyUpdatedChildren=!0,e.push(a)),t||this.focusedDOMNode!==n&&!isAncestorNode(this.focusedDOMNode,n)||(t=!0)}}for(s=0;s<e.length;++s)delete e[s].alreadyUpdatedChildren;this.recentlyModifiedNodes=[],t&&this.updateBreadcrumb(!0)},_stylesPaneEdited:function(){
// Once styles are edited, the Metrics pane should be updated.
this.sidebarPanes.metrics.needsUpdate=!0,this.updateMetrics()},_metricsPaneEdited:function(){
// Once metrics are edited, the Styles pane should be updated.
this.sidebarPanes.styles.needsUpdate=!0,this.updateStyles(!0)},_styleSheetChanged:function(){this._metricsPaneEdited(),this._stylesPaneEdited()},_mouseMovedInCrumbs:function(e){var t=document.elementFromPoint(e.pageX,e.pageY).enclosingNodeOrSelfWithClass("crumb");WebInspector.highlightDOMNode(t?t.representedObject.id:0),"_mouseOutOfCrumbsTimeout"in this&&(clearTimeout(this._mouseOutOfCrumbsTimeout),delete this._mouseOutOfCrumbsTimeout)},_mouseMovedOutOfCrumbs:function(e){var t=document.elementFromPoint(e.pageX,e.pageY);t&&t.isDescendant(this.crumbsElement)||(WebInspector.highlightDOMNode(0),this._mouseOutOfCrumbsTimeout=setTimeout(this.updateBreadcrumbSizes.bind(this),1e3))},updateBreadcrumb:function(e){if(this.visible){for(var t=this.crumbsElement,s=!1,i=!1,n=t.firstChild;n;)n.representedObject===this.rootDOMNode&&(i=!0),i?n.addStyleClass("dimmed"):n.removeStyleClass("dimmed"),n.representedObject===this.focusedDOMNode?(n.addStyleClass("selected"),s=!0):n.removeStyleClass("selected"),n=n.nextSibling;if(!s||e){t.removeChildren();var d=this;i=!1;for(var r=this.focusedDOMNode;r;r=r.parentNode)if(r.nodeType!==Node.DOCUMENT_NODE){var a;switch(r===this.rootDOMNode&&(i=!0),(n=document.createElement("span")).className="crumb",n.representedObject=r,n.addEventListener("mousedown",h,!1),r.nodeType){case Node.ELEMENT_NODE:this.decorateNodeLabel(r,n);break;case Node.TEXT_NODE:a=isNodeWhitespace.call(r)?WebInspector.UIString("(whitespace)"):WebInspector.UIString("(text)");break;case Node.COMMENT_NODE:a="\x3c!--\x3e";break;case Node.DOCUMENT_TYPE_NODE:a="<!DOCTYPE>";break;default:a=this.treeOutline.nodeNameToCorrectCase(r.nodeName)}if(!n.childNodes.length){var o=document.createElement("span");o.textContent=a,n.appendChild(o),n.title=a}i&&n.addStyleClass("dimmed"),r===this.focusedDOMNode&&n.addStyleClass("selected"),t.childNodes.length||n.addStyleClass("end"),t.appendChild(n)}t.hasChildNodes()&&t.lastChild.addStyleClass("start"),this.updateBreadcrumbSizes()}else
// We don't need to rebuild the crumbs, but we need to adjust sizes
// to reflect the new focused or root node.
this.updateBreadcrumbSizes()}function h(e){var t=e.currentTarget;if(t.hasStyleClass("collapsed")){
// Clicking a collapsed crumb will expose the hidden crumbs.
if(t===d.crumbsElement.firstChild)for(
// If the focused crumb is the first child, pick the farthest crumb
// that is still hidden. This allows the user to expose every crumb.
var s=t;s;){var i=s.hasStyleClass("hidden"),n=s.hasStyleClass("collapsed");if(!i&&!n)break;s=(t=s).nextSibling}d.updateBreadcrumbSizes(t)}else
// Clicking a dimmed crumb or double clicking (event.detail >= 2)
// will change the root node in addition to the focused node.
(2<=e.detail||t.hasStyleClass("dimmed"))&&(d.rootDOMNode=t.representedObject.parentNode),d.focusedDOMNode=t.representedObject;e.preventDefault()}},decorateNodeLabel:function(e,t){var s=this.treeOutline.nodeNameToCorrectCase(e.nodeName),i=document.createElement("span");i.textContent=s,t.appendChild(i);var n=e.getAttribute("id");if(n){var d=document.createElement("span");t.appendChild(d),s+=c="#"+n,d.appendChild(document.createTextNode(c)),
// Mark the name as extra, since the ID is more important.
i.className="extra"}var r=e.getAttribute("class");if(r){var a=r.split(/\s+/),o={};if(a.length){var h=document.createElement("span");h.className="extra",t.appendChild(h);for(var l=0;l<a.length;++l){var c,u=a[l];if(u&&!(u in o))s+=c="."+u,h.appendChild(document.createTextNode(c)),o[u]=!0}}}t.title=s},linkifyNodeReference:function(e){var t=document.createElement("span");return t.className="node-link",this.decorateNodeLabel(e,t),WebInspector.wireElementWithDOMNode(t,e.id),t},linkifyNodeById:function(e){var t=WebInspector.domAgent.nodeForId(e);return t?this.linkifyNodeReference(t):document.createTextNode(WebInspector.UIString("<node>"))},updateBreadcrumbSizes:function(h){if(this.visible&&!(document.body.offsetWidth<=0)){var l=this.crumbsElement;if(l.childNodes.length&&!(l.offsetWidth<=0)){for(// No crumbs, do nothing.
// A Zero index is the right most child crumb in the breadcrumb.
var c,u=0,p=0,e=0,t=l.firstChild;t;)
// Find the selected crumb and index. 
!c&&t.hasStyleClass("selected")&&(c=t,u=e),
// Find the focused crumb index. 
t===h&&(p=e),
// Remove any styles that affect size before
// deciding to shorten any crumbs.
t!==l.lastChild&&t.removeStyleClass("start"),t!==l.firstChild&&t.removeStyleClass("end"),t.removeStyleClass("compact"),t.removeStyleClass("collapsed"),t.removeStyleClass("hidden"),t=t.nextSibling,++e;
// Restore the start and end crumb classes in case they got removed in coalesceCollapsedCrumbs().
// The order of the crumbs in the document is opposite of the visual order.
if(l.firstChild.addStyleClass("end"),l.lastChild.addStyleClass("start"),!m()){if(!h){
// When not focused on a crumb we can be biased and collapse less important
// crumbs that the user might not care much about.
// Compact child crumbs.
if(s(i,1))return;
// Collapse child crumbs.
if(s(n,1))return;
// Compact dimmed ancestor crumbs.
if(s(function(e){e.hasStyleClass("dimmed")&&i(e)},-1))return;
// Collapse dimmed ancestor crumbs.
if(s(function(e){e.hasStyleClass("dimmed")&&n(e)},-1))return}
// Compact ancestor crumbs, or from both sides if focused.
s(i,h?0:-1)||s(n,h?0:-1)||c&&(
// Compact the selected crumb.
i(c),m()||
// Collapse the selected crumb as a last resort. Pass true to prevent coalescing.
n(c,!0));
// Collapse ancestor crumbs, or from both sides if focused.
}// No need to compact the crumbs, they all fit at full size.
}}function m(){var e=20,t=document.getElementById("error-warning-count");return!WebInspector.drawer.visible&&t&&(e+=t.offsetWidth),l.totalOffsetLeft+l.offsetWidth+e<window.innerWidth}function s(s,e,i){if(i||(i=h||c),i===c)var t=u;else if(i===h)t=p;else{t=0;for(var n=0;n<l.childNodes.length;++n)if(l.childNodes[n]===i){t=n;break}}function d(e){var t=l.childNodes[e];return t&&t!==i&&s(t),!!m();// No need to compact the crumbs more.
}
// Shrink crumbs one at a time by applying the shrinkingFunction until the crumbs
// fit in the container or we run out of crumbs to shrink.
if(e)for(
// Crumbs are shrunk on only one side (based on direction) of the signifcant crumb.
var r=0<e?0:l.childNodes.length-1;r!==t;){if(d(r))return!0;r+=0<e?1:-1}else for(
// Crumbs are shrunk in order of descending distance from the signifcant crumb,
// with a tie going to child crumbs.
var a=0,o=l.childNodes.length-1;a!=t||o!=t;){if(o-t<=t-a)r=a++;else r=o--;if(d(r))return!0}
// We are not small enough yet, return false so the caller knows.
return!1}function i(e){e.hasStyleClass("hidden")||e.addStyleClass("compact")}function n(e,t){e.hasStyleClass("hidden")||(e.addStyleClass("collapsed"),e.removeStyleClass("compact"),t||function(){for(var e=l.firstChild,t=!1,s=!1,i=!1;e;){if(e.hasStyleClass("hidden"))t=!0;else{var n=e.hasStyleClass("collapsed");if(t&&n){e.addStyleClass("hidden"),e.removeStyleClass("compact"),e.removeStyleClass("collapsed"),e.hasStyleClass("start")&&(e.removeStyleClass("start"),s=!0),e.hasStyleClass("end")&&(e.removeStyleClass("end"),i=!0);continue}t=n,i&&(i=!1,e.addStyleClass("end"))}e=e.nextSibling}if(s)for(e=l.lastChild;e;){if(!e.hasStyleClass("hidden")){e.addStyleClass("start");break}e=e.previousSibling}}())}},updateStyles:function(e){var t=this.sidebarPanes.styles,s=this.sidebarPanes.computedStyle;(t.expanded||s.expanded)&&t.needsUpdate&&(t.update(this.focusedDOMNode,null,e),t.needsUpdate=!1)},updateMetrics:function(){var e=this.sidebarPanes.metrics;e.expanded&&e.needsUpdate&&(e.update(this.focusedDOMNode),e.needsUpdate=!1)},updateProperties:function(){var e=this.sidebarPanes.properties;e.expanded&&e.needsUpdate&&(e.update(this.focusedDOMNode),e.needsUpdate=!1)},updateEventListeners:function(){var e=this.sidebarPanes.eventListeners;e.expanded&&e.needsUpdate&&(e.update(this.focusedDOMNode),e.needsUpdate=!1)},_registerShortcuts:function(){var e=WebInspector.KeyboardShortcut,t=WebInspector.shortcutsHelp.section(WebInspector.UIString("Elements Panel")),s=[e.shortcutToString(e.Keys.Up),e.shortcutToString(e.Keys.Down)];t.addRelatedKeys(s,WebInspector.UIString("Navigate elements"));s=[e.shortcutToString(e.Keys.Right),e.shortcutToString(e.Keys.Left)];t.addRelatedKeys(s,WebInspector.UIString("Expand/collapse")),t.addKey(e.shortcutToString(e.Keys.Enter),WebInspector.UIString("Edit attribute")),this.sidebarPanes.styles.registerShortcuts()},handleShortcut:function(e){
// Cmd/Control + Shift + C should be a shortcut to clicking the Node Search Button.
// This shortcut matches Firebug.
if("U+0043"===e.keyIdentifier){// C key
if(WebInspector.isMac())var t=e.metaKey&&!e.ctrlKey&&!e.altKey&&e.shiftKey;else t=e.ctrlKey&&!e.metaKey&&!e.altKey&&e.shiftKey;if(t)return this.toggleSearchingForNode(),void(e.handled=!0)}},handleCopyEvent:function(e){
// Don't prevent the normal copy if the user has a selection.
window.getSelection().isCollapsed&&(e.clipboardData.clearData(),e.preventDefault(),InspectorBackend.copyNode(this.focusedDOMNode.id))},rightSidebarResizerDragStart:function(e){WebInspector.elementDragStart(this.sidebarElement,this.rightSidebarResizerDrag.bind(this),this.rightSidebarResizerDragEnd.bind(this),e,"col-resize")},rightSidebarResizerDragEnd:function(e){WebInspector.elementDragEnd(e),this.saveSidebarWidth()},rightSidebarResizerDrag:function(e){var t=e.pageX,s=Number.constrain(window.innerWidth-t,Preferences.minElementsSidebarWidth,.66*window.innerWidth);this.setSidebarWidth(s),e.preventDefault()},setSidebarWidth:function(e){this.sidebarElement.style.width=e+"px",this.contentElement.style.right=e+"px",this.sidebarResizeElement.style.right=e-3+"px",this.treeOutline.updateSelection()},updateFocusedNode:function(e){var t=WebInspector.domAgent.nodeForId(e);t&&(this.focusedDOMNode=t,this._nodeSearchButton.toggled=!1)},_setSearchingForNode:function(e){this._nodeSearchButton.toggled=e},setSearchingForNode:function(e){InspectorBackend.setSearchingForNode(e,this._setSearchingForNode.bind(this))},toggleSearchingForNode:function(){this.setSearchingForNode(!this._nodeSearchButton.toggled)},elementsToRestoreScrollPositionsFor:function(){return[this.contentElement,this.sidebarElement]}},WebInspector.ElementsPanel.prototype.__proto__=WebInspector.Panel.prototype;