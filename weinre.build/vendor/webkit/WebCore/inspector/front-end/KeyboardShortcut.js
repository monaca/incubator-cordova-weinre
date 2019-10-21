/*
 * Copyright (C) 2009 Apple Inc. All rights reserved.
 * Copyright (C) 2009 Google Inc. All rights reserved.
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
WebInspector.KeyboardShortcut=function(){},
/**
 * Constants for encoding modifier key set as a bit mask.
 * @see #_makeKeyFromCodeAndModifiers
 */
WebInspector.KeyboardShortcut.Modifiers={None:0,// Constant for empty modifiers set.
Shift:1,Ctrl:2,Alt:4,Meta:8,// Command key on Mac, Win key on other platforms.
get CtrlOrMeta(){
// "default" command/ctrl key for platform, Command on Mac, Ctrl on other platforms
return WebInspector.isMac()?this.Meta:this.Ctrl}},WebInspector.KeyboardShortcut.Keys={Backspace:{code:8,name:"↤"},Tab:{code:9,name:{mac:"⇥",other:"<Tab>"}},Enter:{code:13,name:{mac:"↩",other:"<Enter>"}},Esc:{code:27,name:{mac:"⎋",other:"<Esc>"}},Space:{code:32,name:"<Space>"},PageUp:{code:33,name:{mac:"⇞",other:"<PageUp>"}},// also NUM_NORTH_EAST
PageDown:{code:34,name:{mac:"⇟",other:"<PageDown>"}},// also NUM_SOUTH_EAST
End:{code:35,name:{mac:"↗",other:"<End>"}},// also NUM_SOUTH_WEST
Home:{code:36,name:{mac:"↖",other:"<Home>"}},// also NUM_NORTH_WEST
Left:{code:37,name:"←"},// also NUM_WEST
Up:{code:38,name:"↑"},// also NUM_NORTH
Right:{code:39,name:"→"},// also NUM_EAST
Down:{code:40,name:"↓"},// also NUM_SOUTH
Delete:{code:46,name:"<Del>"},Zero:{code:48,name:"0"},F1:{code:112,name:"F1"},F2:{code:113,name:"F2"},F3:{code:114,name:"F3"},F4:{code:115,name:"F4"},F5:{code:116,name:"F5"},F6:{code:117,name:"F6"},F7:{code:118,name:"F7"},F8:{code:119,name:"F8"},F9:{code:120,name:"F9"},F10:{code:121,name:"F10"},F11:{code:122,name:"F11"},F12:{code:123,name:"F12"},Semicolon:{code:186,name:";"},Plus:{code:187,name:"+"},Comma:{code:188,name:","},Minus:{code:189,name:"-"},Period:{code:190,name:"."},Slash:{code:191,name:"/"},Apostrophe:{code:192,name:"`"},SingleQuote:{code:222,name:"'"}},
/**
 * Creates a number encoding keyCode in the lower 8 bits and modifiers mask in the higher 8 bits.
 * It is useful for matching pressed keys.
 * keyCode is the Code of the key, or a character "a-z" which is converted to a keyCode value.
 * optModifiers is an Optional list of modifiers passed as additional paramerters.
 */
WebInspector.KeyboardShortcut.makeKey=function(e,o){"string"==typeof e&&(e=e.charCodeAt(0)-32);for(var t=WebInspector.KeyboardShortcut.Modifiers.None,r=1;r<arguments.length;r++)t|=arguments[r];return WebInspector.KeyboardShortcut._makeKeyFromCodeAndModifiers(e,t)},WebInspector.KeyboardShortcut.makeKeyFromEvent=function(e){var o=WebInspector.KeyboardShortcut.Modifiers.None;return e.shiftKey&&(o|=WebInspector.KeyboardShortcut.Modifiers.Shift),e.ctrlKey&&(o|=WebInspector.KeyboardShortcut.Modifiers.Ctrl),e.altKey&&(o|=WebInspector.KeyboardShortcut.Modifiers.Alt),e.metaKey&&(o|=WebInspector.KeyboardShortcut.Modifiers.Meta),WebInspector.KeyboardShortcut._makeKeyFromCodeAndModifiers(e.keyCode,o)},WebInspector.KeyboardShortcut.makeDescriptor=function(e,o){for(var t=0,r=1;r<arguments.length;r++)t|=arguments[r];return{key:WebInspector.KeyboardShortcut.makeKey("string"==typeof e?e:e.code,t),name:WebInspector.KeyboardShortcut.shortcutToString(e,t)}},WebInspector.KeyboardShortcut.shortcutToString=function(e,o){return WebInspector.KeyboardShortcut._modifiersToString(o)+WebInspector.KeyboardShortcut._keyName(e)},WebInspector.KeyboardShortcut._keyName=function(e){return"string"==typeof e?e.toUpperCase():"string"==typeof e.name?e.name:e.name[WebInspector.platform]||e.name.other},WebInspector.KeyboardShortcut._makeKeyFromCodeAndModifiers=function(e,o){return 255&e|o<<8},WebInspector.KeyboardShortcut._modifiersToString=function(e){var o=WebInspector.isMac(),t="";return e&WebInspector.KeyboardShortcut.Modifiers.Ctrl&&(t+=o?"⌃":"<Ctrl> + "),e&WebInspector.KeyboardShortcut.Modifiers.Alt&&(t+=o?"⌥":"<Alt> + "),e&WebInspector.KeyboardShortcut.Modifiers.Shift&&(t+=o?"⇧":"<Shift> + "),e&WebInspector.KeyboardShortcut.Modifiers.Meta&&(t+=o?"⌘":"<Win> + "),t};