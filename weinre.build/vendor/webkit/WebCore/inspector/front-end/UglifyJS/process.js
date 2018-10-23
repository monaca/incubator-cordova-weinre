/***********************************************************************

  A JavaScript tokenizer / parser / beautifier / compressor.

  This version is suitable for Node.js.  With minimal changes (the
  exports stuff) it should work on any JS platform.

  This file implements some AST processors.  They work on data built
  by parse-js.

  Exported functions:

    - ast_mangle(ast, include_toplevel) -- mangles the
      variable/function names in the AST.  Returns an AST.  Pass true
      as second argument to mangle toplevel names too.

    - ast_squeeze(ast) -- employs various optimizations to make the
      final generated code even smaller.  Returns an AST.

    - gen_code(ast, beautify) -- generates JS code from the AST.  Pass
      true (or an object, see the code for some options) as second
      argument to get "pretty" (indented) code.

  -------------------------------- (C) ---------------------------------

                           Author: Mihai Bazon
                         <mihai.bazon@gmail.com>
                       http://mihai.bazon.net/blog

  Distributed under the BSD license:

    Copyright 2010 (c) Mihai Bazon <mihai.bazon@gmail.com>

    Redistribution and use in source and binary forms, with or without
    modification, are permitted provided that the following conditions
    are met:

        * Redistributions of source code must retain the above
          copyright notice, this list of conditions and the following
          disclaimer.

        * Redistributions in binary form must reproduce the above
          copyright notice, this list of conditions and the following
          disclaimer in the documentation and/or other materials
          provided with the distribution.

    THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDER “AS IS” AND ANY
    EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
    IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
    PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER BE
    LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
    PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
    PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
    THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR
    TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
    THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF
    SUCH DAMAGE.

 ***********************************************************************/
var jsp=require("./parse-js"),slice=jsp.slice,member=jsp.member,PRECEDENCE=jsp.PRECEDENCE,OPERATORS=jsp.OPERATORS;
/* -----[ helper for AST traversal ]----- */function ast_walker(n){function r(n){return[this[0],MAP(n,function(n){var r=[n[0]];return 1<n.length&&(r[1]=o(n[1])),r})]}var i={string:function(n){return[this[0],n]},num:function(n){return[this[0],n]},name:function(n){return[this[0],n]},toplevel:function(n){return[this[0],MAP(n,o)]},block:function(n){var r=[this[0]];return null!=n&&r.push(MAP(n,o)),r},var:r,const:r,try:function(n,r,t){return[this[0],MAP(n,o),null!=r?[r[0],MAP(r[1],o)]:null,null!=t?MAP(t,o):null]},throw:function(n){return[this[0],o(n)]},new:function(n,r){return[this[0],o(n),MAP(r,o)]},switch:function(n,r){return[this[0],o(n),MAP(r,function(n){return[n[0]?o(n[0]):null,MAP(n[1],o)]})]},break:function(n){return[this[0],n]},continue:function(n){return[this[0],n]},conditional:function(n,r,t){return[this[0],o(n),o(r),o(t)]},assign:function(n,r,t){return[this[0],n,o(r),o(t)]},dot:function(n){return[this[0],o(n)].concat(slice(arguments,1))},call:function(n,r){return[this[0],o(n),MAP(r,o)]},function:function(n,r,t){return[this[0],n,r.slice(),MAP(t,o)]},defun:function(n,r,t){return[this[0],n,r.slice(),MAP(t,o)]},if:function(n,r,t){return[this[0],o(n),o(r),o(t)]},for:function(n,r,t,e){return[this[0],o(n),o(r),o(t),o(e)]},"for-in":function(n,r,t,e){return[this[0],n,r,o(t),o(e)]},while:function(n,r){return[this[0],o(n),o(r)]},do:function(n,r){return[this[0],o(n),o(r)]},return:function(n){return[this[0],o(n)]},binary:function(n,r,t){return[this[0],n,o(r),o(t)]},"unary-prefix":function(n,r){return[this[0],n,o(r)]},"unary-postfix":function(n,r){return[this[0],n,o(r)]},sub:function(n,r){return[this[0],o(n),o(r)]},object:function(n){return[this[0],MAP(n,function(n){return 2==n.length?[n[0],o(n[1])]:[n[0],o(n[1]),n[2]];// get/set-ter
})]},regexp:function(n,r){return[this[0],n,r]},array:function(n){return[this[0],MAP(n,o)]},stat:function(n){return[this[0],o(n)]},seq:function(){return[this[0]].concat(MAP(slice(arguments),o))},label:function(n,r){return[this[0],n,o(r)]},with:function(n,r){return[this[0],o(n),o(r)]},atom:function(n){return[this[0],n]}},u={},a=[];function o(n){if(null==n)return null;try{a.push(n);var r=n[0],t=u[r];if(t){var e=t.apply(n,n.slice(1));if(null!=e)return e}return(t=i[r]).apply(n,n.slice(1))}finally{a.pop()}}return{walk:o,with_walkers:function(n,r){var t,e={};for(t in n)HOP(n,t)&&(e[t]=u[t],u[t]=n[t]);var i=r();for(t in e)HOP(e,t)&&(e[t]?u[t]=e[t]:delete u[t]);return i},parent:function(){return a[a.length-2];// last one is current node
},stack:function(){return a}}}
/* -----[ Scope and mangling ]----- */
function Scope(n){this.names={},// names defined in this scope
this.mangled={},// mangled names (orig.name => mangled)
this.rev_mangled={},// reverse lookup (mangled => orig.name)
this.cname=-1,// current mangled name
this.refs={},// names referenced from this scope
this.uses_with=!1,// will become TRUE if eval() is detected in this or any subscopes
this.uses_eval=!1,// will become TRUE if with() is detected in this or any subscopes
this.parent=n,// parent scope
this.children=[],// sub-scopes
n?(this.level=n.level+1,n.children.push(this)):this.level=0}var base54=function(n){for(var r="";r="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_".charAt(n%54)+r,0<(n=Math.floor(n/54)););return r};function ast_add_scope(r){var e=null,t=ast_walker(),i=t.walk,u=[];function a(n){var r=(e=new Scope(e)).body=n();return e=(r.scope=e).parent,r}function o(n){return e.define(n)}function s(n){e.refs[n]=!0}function c(n,r,t){return[this[0],o(n),r,a(function(){return MAP(r,o),MAP(t,i)})]}return a(function(){
// process AST
var n=t.with_walkers({function:c,defun:c,with:function(n,r){for(var t=e;t;t=t.parent)t.uses_with=!0},var:function(n){MAP(n,function(n){o(n[0])})},const:function(n){MAP(n,function(n){o(n[0])})},try:function(n,r,t){if(null!=r)return[this[0],MAP(n,i),[o(r[0]),MAP(r[1],i)],null!=t?MAP(t,i):null]},name:function(n){"eval"==n&&u.push(e),s(n)},"for-in":function(n,r){n?o(r):s(r)}},function(){return i(r)});
// the reason why we need an additional pass here is
// that names can be used prior to their definition.
// scopes where eval was detected and their parents
// are marked with uses_eval, unless they define the
// "eval" name.
return MAP(u,function(n){if(!n.has("eval"))for(;n;)n.uses_eval=!0,n=n.parent}),
// for referenced names it might be useful to know
// their origin scope.  current_scope here is the
// toplevel one.
function n(r,t){
// do children first; order shouldn't matter
for(t=r.children.length;0<=--t;)n(r.children[t]);for(t in r.refs)if(HOP(r.refs,t))
// find origin scope and propagate the reference to origin
for(var e=r.has(t),i=r;i&&(i.refs[t]=e,i!==e);i=i.parent);}(e),n})}
/* -----[ mangle names ]----- */
function ast_mangle(n,t){var u,r=ast_walker(),i=r.walk;function a(n,r){return t||u.parent?u.get_mangled(n,r):n;// don't mangle toplevel
}function e(n,r,t){return n&&(n=a(n)),t=o(t.scope,function(){return r=MAP(r,function(n){return a(n)}),MAP(t,i)}),[this[0],n,r,t]}function o(n,r){var t=u;for(var e in(u=n).names)HOP(n.names,e)&&a(e,!0);var i=r();return i.scope=n,u=t,i}function s(n){return[this[0],MAP(n,function(n){return[a(n[0]),i(n[1])]})]}return r.with_walkers({function:e,defun:function(){
// move function declarations to the top when
// they are not in some block.
var n=e.apply(this,arguments);switch(r.parent()[0]){case"toplevel":case"function":case"defun":return MAP.at_top(n)}return n},var:s,const:s,name:function(n){return[this[0],a(n)]},try:function(n,r,t){return[this[0],MAP(n,i),null!=r?[a(r[0]),MAP(r[1],i)]:null,null!=t?MAP(t,i):null]},toplevel:function(n){var r=this;return o(r.scope,function(){return[r[0],MAP(n,i)]})},"for-in":function(n,r,t,e){return[this[0],n,a(r),i(t),i(e)]}},function(){return i(ast_add_scope(n))})}Scope.prototype={has:function(n){for(var r=this;r;r=r.parent)if(HOP(r.names,n))return r},has_mangled:function(n){for(var r=this;r;r=r.parent)if(HOP(r.rev_mangled,n))return r},toJSON:function(){return{names:this.names,uses_eval:this.uses_eval,uses_with:this.uses_with}},next_mangled:function(){
// we must be careful that the new mangled name:
//
// 1. doesn't shadow a mangled name from a parent
//    scope, unless we don't reference the original
//    name from this scope OR from any sub-scopes!
//    This will get slow.
//
// 2. doesn't shadow an original name from a parent
//    scope, in the event that the name is not mangled
//    in the parent scope and we reference that name
//    here OR IN ANY SUBSCOPES!
//
// 3. doesn't shadow a name that is referenced but not
//    defined (possibly global defined elsewhere).
for(;;){var n,r=base54(++this.cname);
// case 1.
if((!(n=this.has_mangled(r))||this.refs[n.rev_mangled[r]]!==n)&&(!(
// case 2.
n=this.has(r))||n===this||this.refs[r]!==n||n.has_mangled(r))&&(!HOP(this.refs,r)||null!=this.refs[r])&&is_identifier(r))return r}},get_mangled:function(n,r){if(this.uses_eval||this.uses_with)return n;// no mangle if eval or with is in use
var t=this.has(n);if(!t)return n;// not in visible scope, no mangle
if(HOP(t.mangled,n))return t.mangled[n];// already mangled in this scope
if(!r)return n;// not found and no mangling requested
var e=t.next_mangled();return t.rev_mangled[e]=n,t.mangled[n]=e},define:function(n){if(null!=n)return this.names[n]=n}};
/* -----[
   - compress foo["bar"] into foo.bar,
   - remove block brackets {} where possible
   - join consecutive var declarations
   - various optimizations for IFs:
     - if (cond) foo(); else bar();  ==>  cond?foo():bar();
     - if (cond) foo();  ==>  cond&&foo();
     - if (foo) return bar(); else return baz();  ==> return foo?bar():baz(); // also for throw
     - if (foo) return bar(); else something();  ==> {if(foo)return bar();something()}
   ]----- */
var warn=function(){};function best_of(n,r){return gen_code(n).length>gen_code("stat"==r[0]?r[1]:r).length?r:n}function last_stat(n){return"block"==n[0]&&n[1]&&0<n[1].length?n[1][n[1].length-1]:n}function aborts(n){if(n&&("return"==(n=last_stat(n))[0]||"break"==n[0]||"continue"==n[0]||"throw"==n[0]))return!0}function boolean_expr(n){return"unary-prefix"==n[0]&&member(n[1],["!","delete"])||"binary"==n[0]&&member(n[1],["in","instanceof","==","!=","===","!==","<","<=",">=",">"])||"binary"==n[0]&&member(n[1],["&&","||"])&&boolean_expr(n[2])&&boolean_expr(n[3])||"conditional"==n[0]&&boolean_expr(n[2])&&boolean_expr(n[3])||"assign"==n[0]&&!0===n[1]&&boolean_expr(n[3])||"seq"==n[0]&&boolean_expr(n[n.length-1])}function make_conditional(n,r,t){return"unary-prefix"==n[0]&&"!"==n[1]?t?["conditional",n[2],t,r]:["binary","||",n[2],r]:t?["conditional",n,r,t]:["binary","&&",n,r]}function empty(n){return!n||"block"==n[0]&&(!n[1]||0==n[1].length)}function ast_squeeze(n,s){s=defaults(s,{make_seqs:!0,dead_code:!0,keep_comps:!0,no_warnings:!1});var i,r=ast_walker(),a=r.walk;function c(n){var r=["unary-prefix","!",n];switch(n[0]){case"unary-prefix":return"!"==n[1]&&boolean_expr(n[2])?n[2]:r;case"seq":return(n=slice(n))[n.length-1]=c(n[n.length-1]),n;case"conditional":return best_of(r,["conditional",n[1],c(n[2]),c(n[3])]);case"binary":var t=n[1],e=n[2],i=n[3];if(!s.keep_comps)switch(t){case"<=":return["binary",">",e,i];case"<":return["binary",">=",e,i];case">=":return["binary","<",e,i];case">":return["binary","<=",e,i]}switch(t){case"==":return["binary","!=",e,i];case"!=":return["binary","==",e,i];case"===":return["binary","!==",e,i];case"!==":return["binary","===",e,i];case"&&":return best_of(r,["binary","||",c(e),c(i)]);case"||":return best_of(r,["binary","&&",c(e),c(i)])}}return r}function e(n,r){var t=i;i=n;var e=r();return e.scope=n,i=t,e}function o(n){return"string"==n[0]||"num"==n[0]}function t(n,r,t){return[this[0],n,r,e(t.scope,function(){return u(MAP(t,a),"lambda")})]}
// we get here for blocks that have been already transformed.
// this function does a few things:
// 1. discard useless blocks
// 2. join consecutive var declarations
// 3. remove obviously dead code
// 4. transform consecutive statements using the comma operator
// 5. if block_type == "lambda" and it detects constructs like if(foo) return ... - rewrite like if (!foo) { ... }
function u(i,n){var r,t,e,u,a,o;return i=i.reduce(function(n,r){return"block"==r[0]?r[1]&&n.push.apply(n,r[1]):n.push(r),n},[]),r=[],i.forEach(function(n){t&&("var"==n[0]&&"var"==t[0]||"const"==n[0]&&"const"==t[0])?t[1]=t[1].concat(n[1]):(r.push(n),t=n)}),i=r,s.dead_code&&(e=[],i.forEach(function(n){u?member(n[0],["function","defun","var","const"])?e.push(n):s.no_warnings||warn("Removing unreachable code: "+gen_code(n,!0)):(e.push(n),member(n[0],["return","throw","break","continue"])&&(u=!0))}),i=e),s.make_seqs&&(a=[],i.forEach(function(n){o&&"stat"==o[0]&&"stat"==n[0]?o[1]=["seq",o[1],n[1]]:(a.push(n),o=n)}),i=a),"lambda"==n&&(i=function(n,r,t){for(;n<i.length;){if("if"==(t=i[n++])[0]&&!t[3]){if("return"==t[2][0]&&null==t[2][1]){r.push(f(c(t[1]),["block",i.slice(n)]));break}var e=last_stat(t[2]);if("return"==e[0]&&null==e[1]){r.push(f(t[1],["block",t[2][1].slice(0,-1)],["block",i.slice(n)]));break}}r.push(t)}return r}(0,[])),i}function f(e,i,u){if(e=a(e),i=a(i),u=a(u),empty(i)?(e=c(e),i=u,u=null):empty(u)?u=null:
// if we have both else and then, maybe it makes sense to switch them?
function(){var n=gen_code(e),r=c(e);if(gen_code(r).length<n.length){var t=i;i=u,u=t,e=r}}(),empty(u)&&empty(i))return["stat",e];var n=["if",e,i,u];return"if"==i[0]&&empty(i[3])&&empty(u)?n=best_of(n,a(["if",["binary","&&",e,i[1]],i[2]])):"stat"==i[0]?u?"stat"==u[0]&&(n=best_of(n,["stat",make_conditional(e,i[1],u[1])])):n=best_of(n,["stat",make_conditional(e,i[1])]):!u||i[0]!=u[0]||"return"!=i[0]&&"throw"!=i[0]?u&&aborts(i)?(n=[["if",e,i]],"block"==u[0]?u[1]&&(n=n.concat(u[1])):n.push(u),n=a(["block",n])):i&&aborts(u)&&(n=[["if",c(e),u]],"block"==i[0]?i[1]&&(n=n.concat(i[1])):n.push(i),n=a(["block",n])):n=best_of(n,[i[0],make_conditional(e,i[1],u[1])]),n}return r.with_walkers({sub:function(n,r){if("string"==r[0]){var t=r[1];if(is_identifier(t))return["dot",a(n),t]}},if:f,toplevel:function(n){return["toplevel",e(this.scope,function(){return u(MAP(n,a))})]},switch:function(n,r){var i=r.length-1;return["switch",a(n),MAP(r,function(n,r){var t=u(MAP(n[1],a));if(r==i&&0<t.length){var e=t[t.length-1];"break"!=e[0]||e[1]||t.pop()}return[n[0]?a(n[0]):null,t]})]},function:t,defun:t,block:function(n){if(n)return null!=(r=["block",u(MAP(n,a))])&&"block"==r[0]&&r[1]&&1==r[1].length&&(r=r[1][0]),r;var r},binary:function(n,r,t){var e=["binary",n,r=a(r),t=a(t)];if(o(t)&&o(r)){var i={},u=i;switch(n){case"+":i=r[1]+t[1];break;case"*":i=r[1]*t[1];break;case"/":i=r[1]/t[1];break;case"-":i=r[1]-t[1];break;case"<<":i=r[1]<<t[1];break;case">>":i=r[1]>>t[1];break;case">>>":i=r[1]>>>t[1];break;case"==":i=r[1]==t[1];break;case"===":i=r[1]===t[1];break;case"!=":i=r[1]!=t[1];break;case"!==":i=r[1]!==t[1];break;case"<":i=r[1]<t[1];break;case"<=":i=r[1]<=t[1];break;case">":i=r[1]>t[1];break;case">=":i=r[1]>=t[1]}if(i!==u){switch(typeof i){case"string":i=["string",i];break;case"boolean":i=["name",i+""];break;case"number":i=["num",i];break;default:return e}e=best_of(e,a(i))}}return e},conditional:function(n,r,t){return make_conditional(a(n),a(r),a(t))},try:function(n,r,t){return["try",u(MAP(n,a)),null!=r?[r[0],u(MAP(r[1],a))]:null,null!=t?u(MAP(t,a)):null]},"unary-prefix":function(n,r){var t=["unary-prefix",n,r=a(r)];return"!"==n&&(t=best_of(t,c(r))),t},name:function(n){switch(n){case"true":return["unary-prefix","!",["num",0]];case"false":return["unary-prefix","!",["num",1]]}},new:function(n,r){if("name"==n[0]&&"Array"==n[1]&&!i.has("Array"))return 1!=r.length?["array",r]:["call",["name","Array"],r]},call:function(n,r){if("name"==n[0]&&"Array"==n[1]&&1!=r.length&&!i.has("Array"))return["array",r]}},function(){return a(ast_add_scope(n))})}
/* -----[ re-generate code from the AST ]----- */
var MAP,DOT_CALL_NO_PARENS=jsp.array_to_hash(["name","array","string","dot","sub","call","regexp"]);function make_string(n){var r=0,t=0;return n=n.replace(/[\\\b\f\n\r\t\x22\x27]/g,function(n){switch(n){case"\\":return"\\\\";case"\b":return"\\b";case"\f":return"\\f";case"\n":return"\\n";case"\r":return"\\r";case"\t":return"\\t";case'"':return++r,'"';case"'":return++t,"'"}return n}),t<r?"'"+n.replace(/\x27/g,"\\'")+"'":'"'+n.replace(/\x22/g,'\\"')+'"'}function gen_code(n,a){a&&(a=defaults(a,{indent_start:0,indent_level:4,quote_keys:!1,space_colon:!1}));var t=0,u=a?"\n":"",o=a?" ":"";function s(n){return null==n&&(n=""),a&&(n=repeat_string(" ",a.indent_start+t*a.indent_level)+n),n}function c(n,r){null==r&&(r=1),t+=r;try{return n.apply(null,slice(arguments,1))}finally{t-=r}}function f(n){if(a)return n.join(" ");for(var r=[],t=0;t<n.length;++t){var e=n[t+1];r.push(n[t]),e&&(/[a-z0-9_\x24]$/i.test(n[t].toString())&&/^[a-z0-9_\x24]/i.test(e.toString())||/[\+\-]$/.test(n[t].toString())&&/^[\+\-]/.test(e.toString()))&&r.push(" ")}return r.join("")}function l(n){return n.join(","+o)}function e(n){for(var r=d(n),t=1;t<arguments.length;++t){var e=arguments[t];if(e instanceof Function&&e(n)||n[0]==e)return"("+r+")"}return r}function i(n){if("function"==n[0])for(
// dot/call on a literal function requires the
// function literal itself to be parenthesized
// only if it's the first "thing" in a
// statement.  This means that the parent is
// "stat", but it could also be a "seq" and
// we're the first in this "seq" and the
// parent is "stat", and so on.  Messy stuff,
// but it worths the trouble.
var r=slice(m),t=r.pop(),e=r.pop();e;){if("stat"==e[0])return!0;if(!("seq"==e[0]&&e[1]===t||"call"==e[0]&&e[1]===t||"binary"==e[0]&&e[2]===t))return!1;t=e,e=r.pop()}return!HOP(DOT_CALL_NO_PARENS,n[0])}function h(n){var r,t=n.toString(10),e=[t.replace(/^0\./,".")];return Math.floor(n)===n?(e.push("0x"+n.toString(16).toLowerCase(),// probably pointless
"0"+n.toString(8)),// same.
(r=/^(.*?)(0+)$/.exec(n))&&e.push(r[1]+"e"+r[2].length)):(r=/^0?\.(0+)(.*)$/.exec(n))&&e.push(r[2]+"e-"+(r[1].length+r[2].length),t.substr(t.indexOf("."))),function n(r){if(1==r.length)return r[0];if(2!=r.length)return n([r[0],n(r.slice(1))]);var t=r[1];return(r=r[0]).length<=t.length?r:t}(e)}var p={string:make_string,num:h,name:v,toplevel:function(n){return b(n).join(u+u)},block:g,var:function(n){return"var "+l(MAP(n,r))+";"},const:function(n){return"var "+l(MAP(n,r))+";"},try:function(n,r,t){var e=["try",g(n)];return r&&e.push("catch","("+r[0]+")",g(r[1])),t&&e.push("finally",g(t)),f(e)},throw:function(n){return f(["throw",d(n)])+";"},new:function(n,r){return r=0<r.length?"("+l(MAP(r,d))+")":"",f(["new",e(n,"seq","binary","conditional","assign",function(n){var r=ast_walker(),t={};try{r.with_walkers({call:function(){throw t},function:function(){return this}},function(){r.walk(n)})}catch(n){if(n===t)return!0;throw n}})+r])},switch:function(n,r){return f(["switch","("+d(n)+")",(t=r,i=t.length,0==i?"{}":"{"+u+MAP(t,function(n,r){var t=0<n[1].length,e=c(function(){return s(n[0]?f(["case",d(n[0])+":"]):"default:")},.5)+(t?u+c(function(){return b(n[1]).join(u)}):"");return!a&&t&&r<i-1&&(e+=";"),e}).join(u)+u+s("}"))]);var t,i},break:function(n){var r="break";return null!=n&&(r+=" "+v(n)),r+";"},continue:function(n){var r="continue";return null!=n&&(r+=" "+v(n)),r+";"},conditional:function(n,r,t){return f([e(n,"assign","seq","conditional"),"?",e(r,"seq"),":",e(t,"seq")])},assign:function(n,r,t){return n&&!0!==n?n+="=":n="=",f([d(r),n,e(t,"seq")])},dot:function(n){var r=d(n),t=1;for("num"==n[0]?r+=".":i(n)&&(r="("+r+")");t<arguments.length;)r+="."+v(arguments[t++]);return r},call:function(n,r){var t=d(n);return i(n)&&(t="("+t+")"),t+"("+l(MAP(r,function(n){return e(n,"seq")}))+")"},function:_,defun:_,if:function(n,r,t){var e=["if","("+d(n)+")",t?
// The squeezer replaces "block"-s that contain only a single
// statement with the statement itself; technically, the AST
// is correct, but this can create problems when we output an
// IF having an ELSE clause where the THEN clause ends in an
// IF *without* an ELSE block (then the outer ELSE would refer
// to the inner IF).  This function checks for this case and
// adds the block brackets if needed.
function(n){if("do"==n[0])
// https://github.com/mishoo/UglifyJS/issues/#issue/57
// IE croaks with "syntax error" on code like this:
//     if (foo) do ... while(cond); else ...
// we need block brackets around do/while
return d(["block",[n]]);var r=n;for(;;){var t=r[0];if("if"==t){if(!r[3])
// no else, we must add the block
return d(["block",[n]]);r=r[3]}else if("while"==t||"do"==t)r=r[2];else{if("for"!=t&&"for-in"!=t)break;r=r[4]}}return d(n)}(r):d(r)];return t&&e.push("else",d(t)),f(e)},for:function(n,r,t,e){var i=["for"],u=(n=(null!=n?d(n):"").replace(/;*\s*$/,";"+o))+(r=(null!=r?d(r):"").replace(/;*\s*$/,";"+o))+(t=(null!=t?d(t):"").replace(/;*\s*$/,""));return"; ; "==u&&(u=";;"),i.push("("+u+")",d(e)),f(i)},"for-in":function(n,r,t,e){var i=f(["for","("]);return n&&(i+="var "),i+=f([v(r)+" in "+d(t)+")",d(e)])},while:function(n,r){return f(["while","("+d(n)+")",d(r)])},do:function(n,r){return f(["do",d(r),"while","("+d(n)+")"])+";"},return:function(n){var r=["return"];return null!=n&&r.push(d(n)),f(r)+";"},binary:function(n,r,t){var e=d(r),i=d(t);
// XXX: I'm pretty sure other cases will bite here.
//      we need to be smarter.
//      adding parens all the time is the safest bet.
return(member(r[0],["assign","conditional","seq"])||"binary"==r[0]&&PRECEDENCE[n]>PRECEDENCE[r[1]])&&(e="("+e+")"),(member(t[0],["assign","conditional","seq"])||"binary"==t[0]&&PRECEDENCE[n]>=PRECEDENCE[t[1]]&&(t[1]!=n||!member(n,["&&","||","*"])))&&(i="("+i+")"),f([e,n,i])},"unary-prefix":function(n,r){var t=d(r);return"num"!=r[0]&&("unary-prefix"!=r[0]||HOP(OPERATORS,n+r[1]))&&i(r)&&(t="("+t+")"),n+(jsp.is_alphanumeric_char(n.charAt(0))?" ":"")+t},"unary-postfix":function(n,r){var t=d(r);return"num"!=r[0]&&("unary-postfix"!=r[0]||HOP(OPERATORS,n+r[1]))&&i(r)&&(t="("+t+")"),t+n},sub:function(n,r){var t=d(n);return i(n)&&(t="("+t+")"),t+"["+d(r)+"]"},object:function(n){return 0==n.length?"{}":"{"+u+c(function(){return MAP(n,function(n){if(3==n.length)
// getter/setter.  The name is in p[0], the arg.list in p[1][2], the
// body in p[1][3] and type ("get" / "set") in p[2].
return s(_(n[0],n[1][2],n[1][3],n[2]));var r=n[0],t=d(n[1]);return a&&a.quote_keys?r=make_string(r):("number"==typeof r||!a&&+r+""==r)&&0<=parseFloat(r)?r=h(+r):is_identifier(r)||(r=make_string(r)),s(f(a&&a.space_colon?[r,":",t]:[r+":",t]))}).join(","+u)})+u+s("}")},regexp:function(n,r){return"/"+n+"/"+r},array:function(n){return 0==n.length?"[]":f(["[",l(MAP(n,function(n){return a||"atom"!=n[0]||"undefined"!=n[1]?e(n,"seq"):""})),"]"])},stat:function(n){return d(n).replace(/;*\s*$/,";")},seq:function(){return l(MAP(slice(arguments),d))},label:function(n,r){return f([v(n),":",d(r)])},with:function(n,r){return f(["with","("+d(n)+")",d(r)])},atom:function(n){return v(n)}};function _(n,r,t,e){var i=e||"function";return n&&(i+=" "+v(n)),f([i+="("+l(MAP(r,v))+")",g(t)])}function v(n){return n.toString()}function b(n){for(var r=[],t=n.length-1,e=0;e<=t;++e){var i=n[e],u=d(i);";"!=u&&(a||e!=t||(u="while"==i[0]&&empty(i[2])||member(i[0],["for","for-in"])&&empty(i[4])||"if"==i[0]&&empty(i[2])&&!i[3]||"if"==i[0]&&i[3]&&empty(i[3])?u.replace(/;*\s*$/,";"):u.replace(/;+\s*$/,"")),r.push(u))}return MAP(r,s)}function g(n){return n?0==n.length?"{}":"{"+u+c(function(){return b(n).join(u)})+u+s("}"):";"}function r(n){var r=n[0],t=n[1];return null!=t&&(r=f([r,"=",d(t)])),r}var m=[];function d(n){var r=n[0],t=p[r];if(!t)throw new Error("Can't find generator for \""+r+'"');m.push(n);var e=t.apply(r,n.slice(1));return m.pop(),e}return d(n)}function split_lines(i,u){var a=[0];return jsp.parse(function(){var r,t=jsp.tokenizer(i),e=0;function n(){var n=t.apply(this,arguments);n:if((!r||"keyword"!=r.type)&&n.pos-e>u)switch(n.type){case"keyword":case"atom":case"name":case"punc":e=n.pos,a.push(e);break n}return r=n}return n.context=function(){return t.context.apply(this,arguments)},n}()),a.map(function(n,r){return i.substring(n,a[r+1]||i.length)}).join("\n")}
/* -----[ Utilities ]----- */
function repeat_string(n,r){if(r<=0)return"";if(1==r)return n;var t=repeat_string(n,r>>1);return t+=t,1&r&&(t+=n),t}function defaults(n,r){var t={};for(var e in!0===n&&(n={}),r)HOP(r,e)&&(t[e]=n&&HOP(n,e)?n[e]:r[e]);return t}function is_identifier(n){return/^[a-z_$][a-z0-9_$]*$/i.test(n)&&"this"!=n&&!HOP(jsp.KEYWORDS_ATOM,n)&&!HOP(jsp.RESERVED_WORDS,n)&&!HOP(jsp.KEYWORDS,n)}function HOP(n,r){return Object.prototype.hasOwnProperty.call(n,r)}!function(){function a(n){this.v=n}(MAP=function(n,r,t){for(var e=[],i=0;i<n.length;++i){var u=r.call(t,n[i],i);u instanceof a?e.unshift(u.v):e.push(u)}return e}).at_top=function(n){return new a(n)}}(),
/* -----[ Exports ]----- */
exports.ast_walker=ast_walker,exports.ast_mangle=ast_mangle,exports.ast_squeeze=ast_squeeze,exports.gen_code=gen_code,exports.ast_add_scope=ast_add_scope,exports.ast_squeeze_more=require("./squeeze-more").ast_squeeze_more,exports.set_logger=function(n){warn=n},exports.make_string=make_string,exports.split_lines=split_lines;