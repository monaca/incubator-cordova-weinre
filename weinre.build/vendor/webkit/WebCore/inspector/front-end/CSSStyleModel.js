/*
 * Copyright (C) 2010 Google Inc. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
WebInspector.CSSStyleModel=function(){},WebInspector.CSSStyleModel.parseRuleArrayPayload=function(e){for(var t=[],r=0;r<e.length;++r)t.push(WebInspector.CSSRule.parsePayload(e[r]));return t},WebInspector.CSSStyleModel.prototype={getStylesAsync:function(e,t){InspectorBackend.getStylesForNode(e,function(e,t){if(t){var r={};for(var s in"inlineStyle"in t&&(r.inlineStyle=WebInspector.CSSStyleDeclaration.parsePayload(t.inlineStyle)),r.computedStyle=WebInspector.CSSStyleDeclaration.parsePayload(t.computedStyle),r.matchedCSSRules=WebInspector.CSSStyleModel.parseRuleArrayPayload(t.matchedCSSRules),r.styleAttributes={},t.styleAttributes)r.styleAttributes[s]=WebInspector.CSSStyleDeclaration.parsePayload(t.styleAttributes[s]);r.pseudoElements=[];for(var i=0;i<t.pseudoElements.length;++i){var n=t.pseudoElements[i];r.pseudoElements.push({pseudoId:n.pseudoId,rules:WebInspector.CSSStyleModel.parseRuleArrayPayload(n.rules)})}for(r.inherited=[],i=0;i<t.inherited.length;++i){var o={};"inlineStyle"in(n=t.inherited[i])&&(o.inlineStyle=WebInspector.CSSStyleDeclaration.parsePayload(n.inlineStyle)),"matchedCSSRules"in n&&(o.matchedCSSRules=WebInspector.CSSStyleModel.parseRuleArrayPayload(n.matchedCSSRules)),r.inherited.push(o)}e&&e(r)}else e&&e(null)}.bind(null,t))},getComputedStyleAsync:function(e,t){InspectorBackend.getComputedStyleForNode(e,function(e,t){e(t?WebInspector.CSSStyleDeclaration.parsePayload(t):null)}.bind(null,t))},getInlineStyleAsync:function(e,t){InspectorBackend.getInlineStyleForNode(e,function(e,t){e(t?WebInspector.CSSStyleDeclaration.parsePayload(t):null)}.bind(null,t))},setRuleSelector:function(e,t,r,s,i){InspectorBackend.setRuleSelector(e,r,function(e,t,r,s,i){i?InspectorBackend.querySelectorAll(e,s,function(e,t,r,s){var i=0<=s.indexOf(e),n=WebInspector.CSSRule.parsePayload(r);t(n,i),this._styleSheetChanged(n.id.styleSheetId,!0)}.bind(this,e,t,i)):r()}.bind(this,t,s,i))},addRule:function(i,e,t,r){InspectorBackend.addRule(i,e,function(e,t,r,s){s?InspectorBackend.querySelectorAll(i,r,function(e,t,r,s){var i=0<=s.indexOf(e),n=WebInspector.CSSRule.parsePayload(r);t(n,i),this._styleSheetChanged(n.id.styleSheetId,!0)}.bind(this,i,e,s)):
// Invalid syntax for a selector
t()}.bind(this,t,r,e))},_styleSheetChanged:function(s,e){e&&s&&InspectorBackend.getStyleSheetText(s,function(e,t){var r=WebInspector.resourceForURL(e);r&&r.type===WebInspector.Resource.Type.Stylesheet&&r.setContent(t,this._onRevert.bind(this,s))}.bind(this))},_onRevert:function(t,e){InspectorBackend.setStyleSheetText(t,e,function(e){this._styleSheetChanged(t,!0),this.dispatchEventToListeners("stylesheet changed")}.bind(this))}},WebInspector.CSSStyleModel.prototype.__proto__=WebInspector.Object.prototype,WebInspector.CSSStyleDeclaration=function(e){this.id=e.styleId,this.properties=e.properties,this._shorthandValues=e.shorthandValues,this._livePropertyMap={},// LIVE properties (source-based or style-based) : { name -> CSSProperty }
this._allProperties=[],// ALL properties: [ CSSProperty ]
this._longhandProperties={},// shorthandName -> [ CSSProperty ]
this.__disabledProperties={};for(// DISABLED properties: { index -> CSSProperty }
var t=e.cssProperties.length,r=0,s=0;s<t;++s){var i=new WebInspector.CSSProperty.parsePayload(this,s,e.cssProperties[s]);if(this._allProperties.push(i),i.disabled&&(this.__disabledProperties[s]=i),i.active||i.styleBased){var n=i.name;
// Index longhand properties.
if(this[r]=n,(this._livePropertyMap[n]=i).shorthand){// only for parsed
var o=this._longhandProperties[i.shorthand];o||(o=[],this._longhandProperties[i.shorthand]=o),o.push(i)}++r}}this.length=r,"cssText"in e&&(this.cssText=e.cssText)},WebInspector.CSSStyleDeclaration.parsePayload=function(e){return new WebInspector.CSSStyleDeclaration(e)},WebInspector.CSSStyleDeclaration.prototype={get allProperties(){return this._allProperties},getLiveProperty:function(e){return this._livePropertyMap[e]},getPropertyValue:function(e){var t=this._livePropertyMap[e];return t?t.value:""},getPropertyPriority:function(e){var t=this._livePropertyMap[e];return t?t.priority:""},getPropertyShorthand:function(e){var t=this._livePropertyMap[e];return t?t.shorthand:""},isPropertyImplicit:function(e){var t=this._livePropertyMap[e];return t?t.implicit:""},styleTextWithShorthands:function(){for(var e="",t={},r=0;r<this.length;++r){var s=this[r],i=this.getPropertyShorthand(s),n=i||s;if(!(n in t)){if(i)var o=this.getShorthandValue(i),l=this.getShorthandPriority(i);else o=this.getPropertyValue(s),l=this.getPropertyPriority(s);t[n]=!0,e+=n+": "+o,l&&(e+=" !"+l),e+="; "}}return e},getLonghandProperties:function(e){return this._longhandProperties[e]||[]},getShorthandValue:function(e){var t=this.getLiveProperty(e);return t?t.value:this._shorthandValues[e]},getShorthandPriority:function(e){var t=this.getPropertyPriority(e);if(t)return t;var r=this._longhandProperties[e];return r?this.getPropertyPriority(r[0]):null},propertyAt:function(e){return e<this.allProperties.length?this.allProperties[e]:null},pastLastSourcePropertyIndex:function(){for(var e=this.allProperties.length-1;0<=e;--e){var t=this.allProperties[e];if(t.active||t.disabled)return e+1}return 0},newBlankProperty:function(){return new WebInspector.CSSProperty(this,this.pastLastSourcePropertyIndex(),"","","","active",!0,!1,!1,"")},insertPropertyAt:function(e,t,r,s){InspectorBackend.setPropertyText(this.id,e,t+": "+r+";",!1,function(e,t){e&&(t?(e(WebInspector.CSSStyleDeclaration.parsePayload(t)),WebInspector.cssModel._styleSheetChanged(this.id.styleSheetId,!0)):e(null))}.bind(null,s))},appendProperty:function(e,t,r){this.insertPropertyAt(this.allProperties.length,e,t,r)}},WebInspector.CSSRule=function(e){this.id=e.ruleId,this.selectorText=e.selectorText,this.sourceLine=e.sourceLine,this.sourceURL=e.sourceURL,this.origin=e.origin,this.style=WebInspector.CSSStyleDeclaration.parsePayload(e.style),(this.style.parentRule=this).selectorRange=e.selectorRange},WebInspector.CSSRule.parsePayload=function(e){return new WebInspector.CSSRule(e)},WebInspector.CSSRule.prototype={get isUserAgent(){return"user-agent"===this.origin},get isUser(){return"user"===this.origin},get isViaInspector(){return"inspector"===this.origin},get isRegular(){return""===this.origin}},WebInspector.CSSProperty=function(e,t,r,s,i,n,o,l,a,h){this.ownerStyle=e,this.index=t,this.name=r,this.value=s,this.priority=i,this.status=n,this.parsedOk=o,this.implicit=l,this.shorthand=a,this.text=h},WebInspector.CSSProperty.parsePayload=function(e,t,r){return new WebInspector.CSSProperty(e,t,r.name,r.value,r.priority,r.status,r.parsedOk,r.implicit,r.shorthandName,r.text)},WebInspector.CSSProperty.prototype={get propertyText(){return void 0!==this.text?this.text:""===this.name?"":this.name+": "+this.value+(this.priority?" !"+this.priority:"")+";"},get isLive(){return this.active||this.styleBased},get active(){return"active"===this.status},get styleBased(){return"style"===this.status},get inactive(){return"inactive"===this.status},get disabled(){return"disabled"===this.status},
// Replaces "propertyName: propertyValue [!important];" in the stylesheet by an arbitrary propertyText.
setText:function(s,i,n){function o(e){e&&WebInspector.cssModel._styleSheetChanged(e.id.styleSheetId,i),n&&n(e)}if(!this.ownerStyle)throw"No ownerStyle for property";
// An index past all the properties adds a new property to the style.
InspectorBackend.setPropertyText(this.ownerStyle.id,this.index,s,this.index<this.ownerStyle.pastLastSourcePropertyIndex(),function(e){if(e){this.text=s;var t=WebInspector.CSSStyleDeclaration.parsePayload(e),r=t.allProperties[this.index];if(r&&this.disabled&&!s.match(/^\s*$/))return void r.setDisabled(!1,o);WebInspector.cssModel._styleSheetChanged(t.id.styleSheetId,i),n&&n(t)}else n&&n(null)}.bind(this))},setValue:function(e,t){var r=this.name+": "+e+(this.priority?" !"+this.priority:"")+";";this.setText(r,t)},setDisabled:function(e,r){!this.ownerStyle&&r&&r(null),e===this.disabled&&r&&r(this.ownerStyle),InspectorBackend.toggleProperty(this.ownerStyle.id,this.index,e,function(e){if(r)if(e){var t=WebInspector.CSSStyleDeclaration.parsePayload(e);r(t),WebInspector.cssModel._styleSheetChanged(this.ownerStyle.id.styleSheetId,!1)}else r(null)}.bind(this))}},WebInspector.CSSStyleSheet=function(e){this.id=e.styleSheetId,this.sourceURL=e.sourceURL,this.title=e.title,this.disabled=e.disabled,this.rules=[],this.styles={};for(var t=0;t<e.rules.length;++t){var r=WebInspector.CSSRule.parsePayload(e.rules[t]);this.rules.push(r),r.style&&(this.styles[r.style.id]=r.style)}"text"in e&&(this._text=e.text)},WebInspector.CSSStyleSheet.createForId=function(e,t){InspectorBackend.getStyleSheet(e,function(e){t(e?new WebInspector.CSSStyleSheet(e):null)}.bind(this))},WebInspector.CSSStyleSheet.prototype={getText:function(){return this._text},setText:function(e,t){InspectorBackend.setStyleSheetText(this.id,e,function(e){e?(t(new WebInspector.CSSStyleSheet(e)),WebInspector.cssModel._styleSheetChanged(this.id,!0)):t(null)}.bind(this))}};