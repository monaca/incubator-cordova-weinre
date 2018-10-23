/*
 * Copyright (C) 2009 Google Inc. All rights reserved.
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
WebInspector.Popover=function(e){this.element=document.createElement("div"),this.element.className="popover",this._popupArrowElement=document.createElement("div"),this._popupArrowElement.className="arrow",this.element.appendChild(this._popupArrowElement),this.contentElement=e,this._contentDiv=document.createElement("div"),this._contentDiv.className="content"},WebInspector.Popover.prototype={show:function(e,t,i){
// This should not happen, but we hide previous popup to be on the safe side.
WebInspector.Popover._popoverElement&&document.body.removeChild(WebInspector.Popover._popoverElement),WebInspector.Popover._popoverElement=this.element,
// Temporarily attach in order to measure preferred dimensions.
this.contentElement.positionAt(0,0),document.body.appendChild(this.contentElement);t=t||this.contentElement.offsetWidth,i=i||this.contentElement.offsetHeight;this._contentDiv.appendChild(this.contentElement),this.element.appendChild(this._contentDiv),document.body.appendChild(this.element),this._positionElement(e,t,i)},hide:function(){WebInspector.Popover._popoverElement&&(delete WebInspector.Popover._popoverElement,document.body.removeChild(this.element))},_positionElement:function(e,t,i){var o=15,h=10;
// Skinny tooltips are not pretty, their arrow location is not nice.
t=Math.max(t,50);for(var n=window.innerWidth,s=window.innerHeight,p={x:e.totalOffsetLeft,y:e.totalOffsetTop,width:e.offsetWidth,height:e.offsetHeight};e!==document.body;)e.scrollLeft&&(p.x-=e.scrollLeft),e.scrollTop&&(p.y-=e.scrollTop),e=e.parentElement;var r,m,l={x:0,y:0,width:t+11,height:i},d=p.y;if(r=s-p.y-p.height<d?(
// Positioning above the anchor.
p.y>l.height+o+h?l.y=p.y-l.height-o:(l.y=20,l.height=p.y-20-o),"bottom"):(
// Positioning below the anchor.
l.y=p.y+p.height+o,l.y+l.height+o-25>=s&&(l.height=s-p.y-p.height-20-o),"top"),p.x+l.width<n)l.x=Math.max(h,p.x-h-10),m="left";else if(l.width+20<n){l.x=n-l.width-h,m="right";
// Position arrow accurately.
var u=Math.max(0,n-p.x-p.width-h-10);u+=p.width/2,this._popupArrowElement.style.right=u+"px"}else l.x=h,l.width=n-20,l.height+=11,m="left","bottom"===r&&(l.y-=11),
// Position arrow accurately.
this._popupArrowElement.style.left=Math.max(0,p.x-20-10)+"px",this._popupArrowElement.style.left+=p.width/2;this.element.className="popover "+r+"-"+m+"-arrow",this.element.positionAt(l.x-25,l.y-25),this.element.style.width=l.width+50+"px",this.element.style.height=l.height+50+"px"}},WebInspector.PopoverHelper=function(e,t,i,o,h){this._panelElement=e,this._getAnchor=t,this._showPopup=i,this._showOnClick=o,this._onHide=h,e.addEventListener("mousedown",this._mouseDown.bind(this),!1),e.addEventListener("mousemove",this._mouseMove.bind(this),!1),this.setTimeout(1e3)},WebInspector.PopoverHelper.prototype={setTimeout:function(e){this._timeout=e},_mouseDown:function(e){this._killHidePopupTimer(),this._handleMouseAction(e,!0)},_mouseMove:function(e){
// Pretend that nothing has happened.
if(!(this._hoverElement===e.target||this._hoverElement&&this._hoverElement.isAncestor(e.target))){
// User has 500ms (this._timeout / 2) to reach the popup.
if(this._popup&&!this._hidePopupTimer){var t=this;this._hidePopupTimer=setTimeout(function(){t._hidePopup(),delete t._hidePopupTimer},this._timeout/2)}this._handleMouseAction(e)}},_handleMouseAction:function(e,t){if(this._resetHoverTimer(),this._hoverElement=this._getAnchor(e.target),this._hoverElement){var i=t?0:this._popup?.6*this._timeout:this._timeout;this._hoverTimer=setTimeout(this._mouseHover.bind(this,this._hoverElement),i)}},_resetHoverTimer:function(){this._hoverTimer&&(clearTimeout(this._hoverTimer),delete this._hoverTimer)},hidePopup:function(){this._resetHoverTimer(),this._hidePopup()},_hidePopup:function(){this._popup&&(this._onHide&&this._onHide(),this._popup.hide(),delete this._popup)},_mouseHover:function(e){delete this._hoverTimer,this._popup=this._showPopup(e),this._popup&&this._popup.contentElement.addEventListener("mousemove",this._killHidePopupTimer.bind(this),!0)},_killHidePopupTimer:function(){this._hidePopupTimer&&(clearTimeout(this._hidePopupTimer),delete this._hidePopupTimer,
// We know that we reached the popup, but we might have moved over other elements.
// Discard pending command.
this._resetHoverTimer())}};