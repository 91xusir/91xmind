/*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self).jsyaml={})}(this,(function(e){"use strict";function t(e){return null==e}var n={isNothing:t,isObject:function(e){return"object"==typeof e&&null!==e},toArray:function(e){return Array.isArray(e)?e:t(e)?[]:[e]},repeat:function(e,t){var n,i="";for(n=0;n<t;n+=1)i+=e;return i},isNegativeZero:function(e){return 0===e&&Number.NEGATIVE_INFINITY===1/e},extend:function(e,t){var n,i,r,o;if(t)for(n=0,i=(o=Object.keys(t)).length;n<i;n+=1)e[r=o[n]]=t[r];return e}};function i(e,t){var n="",i=e.reason||"(unknown reason)";return e.mark?(e.mark.name&&(n+='in "'+e.mark.name+'" '),n+="("+(e.mark.line+1)+":"+(e.mark.column+1)+")",!t&&e.mark.snippet&&(n+="\n\n"+e.mark.snippet),i+" "+n):i}function r(e,t){Error.call(this),this.name="YAMLException",this.reason=e,this.mark=t,this.message=i(this,!1),Error.captureStackTrace?Error.captureStackTrace(this,this.constructor):this.stack=(new Error).stack||""}r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r.prototype.toString=function(e){return this.name+": "+i(this,e)};var o=r;function a(e,t,n,i,r){var o="",a="",l=Math.floor(r/2)-1;return i-t>l&&(t=i-l+(o=" ... ").length),n-i>l&&(n=i+l-(a=" ...").length),{str:o+e.slice(t,n).replace(/\t/g,"→")+a,pos:i-t+o.length}}function l(e,t){return n.repeat(" ",t-e.length)+e}var c=function(e,t){if(t=Object.create(t||null),!e.buffer)return null;t.maxLength||(t.maxLength=79),"number"!=typeof t.indent&&(t.indent=1),"number"!=typeof t.linesBefore&&(t.linesBefore=3),"number"!=typeof t.linesAfter&&(t.linesAfter=2);for(var i,r=/\r?\n|\r|\0/g,o=[0],c=[],s=-1;i=r.exec(e.buffer);)c.push(i.index),o.push(i.index+i[0].length),e.position<=i.index&&s<0&&(s=o.length-2);s<0&&(s=o.length-1);var u,p,f="",d=Math.min(e.line+t.linesAfter,c.length).toString().length,h=t.maxLength-(t.indent+d+3);for(u=1;u<=t.linesBefore&&!(s-u<0);u++)p=a(e.buffer,o[s-u],c[s-u],e.position-(o[s]-o[s-u]),h),f=n.repeat(" ",t.indent)+l((e.line-u+1).toString(),d)+" | "+p.str+"\n"+f;for(p=a(e.buffer,o[s],c[s],e.position,h),f+=n.repeat(" ",t.indent)+l((e.line+1).toString(),d)+" | "+p.str+"\n",f+=n.repeat("-",t.indent+d+3+p.pos)+"^\n",u=1;u<=t.linesAfter&&!(s+u>=c.length);u++)p=a(e.buffer,o[s+u],c[s+u],e.position-(o[s]-o[s+u]),h),f+=n.repeat(" ",t.indent)+l((e.line+u+1).toString(),d)+" | "+p.str+"\n";return f.replace(/\n$/,"")},s=["kind","multi","resolve","construct","instanceOf","predicate","represent","representName","defaultStyle","styleAliases"],u=["scalar","sequence","mapping"];var p=function(e,t){if(t=t||{},Object.keys(t).forEach((function(t){if(-1===s.indexOf(t))throw new o('Unknown option "'+t+'" is met in definition of "'+e+'" YAML type.')})),this.options=t,this.tag=e,this.kind=t.kind||null,this.resolve=t.resolve||function(){return!0},this.construct=t.construct||function(e){return e},this.instanceOf=t.instanceOf||null,this.predicate=t.predicate||null,this.represent=t.represent||null,this.representName=t.representName||null,this.defaultStyle=t.defaultStyle||null,this.multi=t.multi||!1,this.styleAliases=function(e){var t={};return null!==e&&Object.keys(e).forEach((function(n){e[n].forEach((function(e){t[String(e)]=n}))})),t}(t.styleAliases||null),-1===u.indexOf(this.kind))throw new o('Unknown kind "'+this.kind+'" is specified for "'+e+'" YAML type.')};function f(e,t){var n=[];return e[t].forEach((function(e){var t=n.length;n.forEach((function(n,i){n.tag===e.tag&&n.kind===e.kind&&n.multi===e.multi&&(t=i)})),n[t]=e})),n}function d(e){return this.extend(e)}d.prototype.extend=function(e){var t=[],n=[];if(e instanceof p)n.push(e);else if(Array.isArray(e))n=n.concat(e);else{if(!e||!Array.isArray(e.implicit)&&!Array.isArray(e.explicit))throw new o("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");e.implicit&&(t=t.concat(e.implicit)),e.explicit&&(n=n.concat(e.explicit))}t.forEach((function(e){if(!(e instanceof p))throw new o("Specified list of YAML types (or a single Type object) contains a non-Type object.");if(e.loadKind&&"scalar"!==e.loadKind)throw new o("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");if(e.multi)throw new o("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.")})),n.forEach((function(e){if(!(e instanceof p))throw new o("Specified list of YAML types (or a single Type object) contains a non-Type object.")}));var i=Object.create(d.prototype);return i.implicit=(this.implicit||[]).concat(t),i.explicit=(this.explicit||[]).concat(n),i.compiledImplicit=f(i,"implicit"),i.compiledExplicit=f(i,"explicit"),i.compiledTypeMap=function(){var e,t,n={scalar:{},sequence:{},mapping:{},fallback:{},multi:{scalar:[],sequence:[],mapping:[],fallback:[]}};function i(e){e.multi?(n.multi[e.kind].push(e),n.multi.fallback.push(e)):n[e.kind][e.tag]=n.fallback[e.tag]=e}for(e=0,t=arguments.length;e<t;e+=1)arguments[e].forEach(i);return n}(i.compiledImplicit,i.compiledExplicit),i};var h=d,g=new p("tag:yaml.org,2002:str",{kind:"scalar",construct:function(e){return null!==e?e:""}}),m=new p("tag:yaml.org,2002:seq",{kind:"sequence",construct:function(e){return null!==e?e:[]}}),y=new p("tag:yaml.org,2002:map",{kind:"mapping",construct:function(e){return null!==e?e:{}}}),b=new h({explicit:[g,m,y]});var A=new p("tag:yaml.org,2002:null",{kind:"scalar",resolve:function(e){if(null===e)return!0;var t=e.length;return 1===t&&"~"===e||4===t&&("null"===e||"Null"===e||"NULL"===e)},construct:function(){return null},predicate:function(e){return null===e},represent:{canonical:function(){return"~"},lowercase:function(){return"null"},uppercase:function(){return"NULL"},camelcase:function(){return"Null"},empty:function(){return""}},defaultStyle:"lowercase"});var v=new p("tag:yaml.org,2002:bool",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t=e.length;return 4===t&&("true"===e||"True"===e||"TRUE"===e)||5===t&&("false"===e||"False"===e||"FALSE"===e)},construct:function(e){return"true"===e||"True"===e||"TRUE"===e},predicate:function(e){return"[object Boolean]"===Object.prototype.toString.call(e)},represent:{lowercase:function(e){return e?"true":"false"},uppercase:function(e){return e?"TRUE":"FALSE"},camelcase:function(e){return e?"True":"False"}},defaultStyle:"lowercase"});function w(e){return 48<=e&&e<=55}function k(e){return 48<=e&&e<=57}var C=new p("tag:yaml.org,2002:int",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,n,i=e.length,r=0,o=!1;if(!i)return!1;if("-"!==(t=e[r])&&"+"!==t||(t=e[++r]),"0"===t){if(r+1===i)return!0;if("b"===(t=e[++r])){for(r++;r<i;r++)if("_"!==(t=e[r])){if("0"!==t&&"1"!==t)return!1;o=!0}return o&&"_"!==t}if("x"===t){for(r++;r<i;r++)if("_"!==(t=e[r])){if(!(48<=(n=e.charCodeAt(r))&&n<=57||65<=n&&n<=70||97<=n&&n<=102))return!1;o=!0}return o&&"_"!==t}if("o"===t){for(r++;r<i;r++)if("_"!==(t=e[r])){if(!w(e.charCodeAt(r)))return!1;o=!0}return o&&"_"!==t}}if("_"===t)return!1;for(;r<i;r++)if("_"!==(t=e[r])){if(!k(e.charCodeAt(r)))return!1;o=!0}return!(!o||"_"===t)},construct:function(e){var t,n=e,i=1;if(-1!==n.indexOf("_")&&(n=n.replace(/_/g,"")),"-"!==(t=n[0])&&"+"!==t||("-"===t&&(i=-1),t=(n=n.slice(1))[0]),"0"===n)return 0;if("0"===t){if("b"===n[1])return i*parseInt(n.slice(2),2);if("x"===n[1])return i*parseInt(n.slice(2),16);if("o"===n[1])return i*parseInt(n.slice(2),8)}return i*parseInt(n,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&e%1==0&&!n.isNegativeZero(e)},represent:{binary:function(e){return e>=0?"0b"+e.toString(2):"-0b"+e.toString(2).slice(1)},octal:function(e){return e>=0?"0o"+e.toString(8):"-0o"+e.toString(8).slice(1)},decimal:function(e){return e.toString(10)},hexadecimal:function(e){return e>=0?"0x"+e.toString(16).toUpperCase():"-0x"+e.toString(16).toUpperCase().slice(1)}},defaultStyle:"decimal",styleAliases:{binary:[2,"bin"],octal:[8,"oct"],decimal:[10,"dec"],hexadecimal:[16,"hex"]}}),x=new RegExp("^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");var I=/^[-+]?[0-9]+e/;var S=new p("tag:yaml.org,2002:float",{kind:"scalar",resolve:function(e){return null!==e&&!(!x.test(e)||"_"===e[e.length-1])},construct:function(e){var t,n;return n="-"===(t=e.replace(/_/g,"").toLowerCase())[0]?-1:1,"+-".indexOf(t[0])>=0&&(t=t.slice(1)),".inf"===t?1===n?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY:".nan"===t?NaN:n*parseFloat(t,10)},predicate:function(e){return"[object Number]"===Object.prototype.toString.call(e)&&(e%1!=0||n.isNegativeZero(e))},represent:function(e,t){var i;if(isNaN(e))switch(t){case"lowercase":return".nan";case"uppercase":return".NAN";case"camelcase":return".NaN"}else if(Number.POSITIVE_INFINITY===e)switch(t){case"lowercase":return".inf";case"uppercase":return".INF";case"camelcase":return".Inf"}else if(Number.NEGATIVE_INFINITY===e)switch(t){case"lowercase":return"-.inf";case"uppercase":return"-.INF";case"camelcase":return"-.Inf"}else if(n.isNegativeZero(e))return"-0.0";return i=e.toString(10),I.test(i)?i.replace("e",".e"):i},defaultStyle:"lowercase"}),O=b.extend({implicit:[A,v,C,S]}),j=O,T=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"),N=new RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");var F=new p("tag:yaml.org,2002:timestamp",{kind:"scalar",resolve:function(e){return null!==e&&(null!==T.exec(e)||null!==N.exec(e))},construct:function(e){var t,n,i,r,o,a,l,c,s=0,u=null;if(null===(t=T.exec(e))&&(t=N.exec(e)),null===t)throw new Error("Date resolve error");if(n=+t[1],i=+t[2]-1,r=+t[3],!t[4])return new Date(Date.UTC(n,i,r));if(o=+t[4],a=+t[5],l=+t[6],t[7]){for(s=t[7].slice(0,3);s.length<3;)s+="0";s=+s}return t[9]&&(u=6e4*(60*+t[10]+ +(t[11]||0)),"-"===t[9]&&(u=-u)),c=new Date(Date.UTC(n,i,r,o,a,l,s)),u&&c.setTime(c.getTime()-u),c},instanceOf:Date,represent:function(e){return e.toISOString()}});var E=new p("tag:yaml.org,2002:merge",{kind:"scalar",resolve:function(e){return"<<"===e||null===e}}),M="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";var L=new p("tag:yaml.org,2002:binary",{kind:"scalar",resolve:function(e){if(null===e)return!1;var t,n,i=0,r=e.length,o=M;for(n=0;n<r;n++)if(!((t=o.indexOf(e.charAt(n)))>64)){if(t<0)return!1;i+=6}return i%8==0},construct:function(e){var t,n,i=e.replace(/[\r\n=]/g,""),r=i.length,o=M,a=0,l=[];for(t=0;t<r;t++)t%4==0&&t&&(l.push(a>>16&255),l.push(a>>8&255),l.push(255&a)),a=a<<6|o.indexOf(i.charAt(t));return 0===(n=r%4*6)?(l.push(a>>16&255),l.push(a>>8&255),l.push(255&a)):18===n?(l.push(a>>10&255),l.push(a>>2&255)):12===n&&l.push(a>>4&255),new Uint8Array(l)},predicate:function(e){return"[object Uint8Array]"===Object.prototype.toString.call(e)},represent:function(e){var t,n,i="",r=0,o=e.length,a=M;for(t=0;t<o;t++)t%3==0&&t&&(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]),r=(r<<8)+e[t];return 0===(n=o%3)?(i+=a[r>>18&63],i+=a[r>>12&63],i+=a[r>>6&63],i+=a[63&r]):2===n?(i+=a[r>>10&63],i+=a[r>>4&63],i+=a[r<<2&63],i+=a[64]):1===n&&(i+=a[r>>2&63],i+=a[r<<4&63],i+=a[64],i+=a[64]),i}}),_=Object.prototype.hasOwnProperty,D=Object.prototype.toString;var U=new p("tag:yaml.org,2002:omap",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,n,i,r,o,a=[],l=e;for(t=0,n=l.length;t<n;t+=1){if(i=l[t],o=!1,"[object Object]"!==D.call(i))return!1;for(r in i)if(_.call(i,r)){if(o)return!1;o=!0}if(!o)return!1;if(-1!==a.indexOf(r))return!1;a.push(r)}return!0},construct:function(e){return null!==e?e:[]}}),q=Object.prototype.toString;var Y=new p("tag:yaml.org,2002:pairs",{kind:"sequence",resolve:function(e){if(null===e)return!0;var t,n,i,r,o,a=e;for(o=new Array(a.length),t=0,n=a.length;t<n;t+=1){if(i=a[t],"[object Object]"!==q.call(i))return!1;if(1!==(r=Object.keys(i)).length)return!1;o[t]=[r[0],i[r[0]]]}return!0},construct:function(e){if(null===e)return[];var t,n,i,r,o,a=e;for(o=new Array(a.length),t=0,n=a.length;t<n;t+=1)i=a[t],r=Object.keys(i),o[t]=[r[0],i[r[0]]];return o}}),R=Object.prototype.hasOwnProperty;var B=new p("tag:yaml.org,2002:set",{kind:"mapping",resolve:function(e){if(null===e)return!0;var t,n=e;for(t in n)if(R.call(n,t)&&null!==n[t])return!1;return!0},construct:function(e){return null!==e?e:{}}}),K=j.extend({implicit:[F,E],explicit:[L,U,Y,B]}),P=Object.prototype.hasOwnProperty,W=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,H=/[\x85\u2028\u2029]/,$=/[,\[\]\{\}]/,G=/^(?:!|!!|![a-z\-]+!)$/i,V=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function Z(e){return Object.prototype.toString.call(e)}function J(e){return 10===e||13===e}function Q(e){return 9===e||32===e}function z(e){return 9===e||32===e||10===e||13===e}function X(e){return 44===e||91===e||93===e||123===e||125===e}function ee(e){var t;return 48<=e&&e<=57?e-48:97<=(t=32|e)&&t<=102?t-97+10:-1}function te(e){return 48===e?"\0":97===e?"":98===e?"\b":116===e||9===e?"\t":110===e?"\n":118===e?"\v":102===e?"\f":114===e?"\r":101===e?"":32===e?" ":34===e?'"':47===e?"/":92===e?"\\":78===e?"":95===e?" ":76===e?"\u2028":80===e?"\u2029":""}function ne(e){return e<=65535?String.fromCharCode(e):String.fromCharCode(55296+(e-65536>>10),56320+(e-65536&1023))}for(var ie=new Array(256),re=new Array(256),oe=0;oe<256;oe++)ie[oe]=te(oe)?1:0,re[oe]=te(oe);function ae(e,t){this.input=e,this.filename=t.filename||null,this.schema=t.schema||K,this.onWarning=t.onWarning||null,this.legacy=t.legacy||!1,this.json=t.json||!1,this.listener=t.listener||null,this.implicitTypes=this.schema.compiledImplicit,this.typeMap=this.schema.compiledTypeMap,this.length=e.length,this.position=0,this.line=0,this.lineStart=0,this.lineIndent=0,this.firstTabInLine=-1,this.documents=[]}function le(e,t){var n={name:e.filename,buffer:e.input.slice(0,-1),position:e.position,line:e.line,column:e.position-e.lineStart};return n.snippet=c(n),new o(t,n)}function ce(e,t){throw le(e,t)}function se(e,t){e.onWarning&&e.onWarning.call(null,le(e,t))}var ue={YAML:function(e,t,n){var i,r,o;null!==e.version&&ce(e,"duplication of %YAML directive"),1!==n.length&&ce(e,"YAML directive accepts exactly one argument"),null===(i=/^([0-9]+)\.([0-9]+)$/.exec(n[0]))&&ce(e,"ill-formed argument of the YAML directive"),r=parseInt(i[1],10),o=parseInt(i[2],10),1!==r&&ce(e,"unacceptable YAML version of the document"),e.version=n[0],e.checkLineBreaks=o<2,1!==o&&2!==o&&se(e,"unsupported YAML version of the document")},TAG:function(e,t,n){var i,r;2!==n.length&&ce(e,"TAG directive accepts exactly two arguments"),i=n[0],r=n[1],G.test(i)||ce(e,"ill-formed tag handle (first argument) of the TAG directive"),P.call(e.tagMap,i)&&ce(e,'there is a previously declared suffix for "'+i+'" tag handle'),V.test(r)||ce(e,"ill-formed tag prefix (second argument) of the TAG directive");try{r=decodeURIComponent(r)}catch(t){ce(e,"tag prefix is malformed: "+r)}e.tagMap[i]=r}};function pe(e,t,n,i){var r,o,a,l;if(t<n){if(l=e.input.slice(t,n),i)for(r=0,o=l.length;r<o;r+=1)9===(a=l.charCodeAt(r))||32<=a&&a<=1114111||ce(e,"expected valid JSON character");else W.test(l)&&ce(e,"the stream contains non-printable characters");e.result+=l}}function fe(e,t,i,r){var o,a,l,c;for(n.isObject(i)||ce(e,"cannot merge mappings; the provided source object is unacceptable"),l=0,c=(o=Object.keys(i)).length;l<c;l+=1)a=o[l],P.call(t,a)||(t[a]=i[a],r[a]=!0)}function de(e,t,n,i,r,o,a,l,c){var s,u;if(Array.isArray(r))for(s=0,u=(r=Array.prototype.slice.call(r)).length;s<u;s+=1)Array.isArray(r[s])&&ce(e,"nested arrays are not supported inside keys"),"object"==typeof r&&"[object Object]"===Z(r[s])&&(r[s]="[object Object]");if("object"==typeof r&&"[object Object]"===Z(r)&&(r="[object Object]"),r=String(r),null===t&&(t={}),"tag:yaml.org,2002:merge"===i)if(Array.isArray(o))for(s=0,u=o.length;s<u;s+=1)fe(e,t,o[s],n);else fe(e,t,o,n);else e.json||P.call(n,r)||!P.call(t,r)||(e.line=a||e.line,e.lineStart=l||e.lineStart,e.position=c||e.position,ce(e,"duplicated mapping key")),"__proto__"===r?Object.defineProperty(t,r,{configurable:!0,enumerable:!0,writable:!0,value:o}):t[r]=o,delete n[r];return t}function he(e){var t;10===(t=e.input.charCodeAt(e.position))?e.position++:13===t?(e.position++,10===e.input.charCodeAt(e.position)&&e.position++):ce(e,"a line break is expected"),e.line+=1,e.lineStart=e.position,e.firstTabInLine=-1}function ge(e,t,n){for(var i=0,r=e.input.charCodeAt(e.position);0!==r;){for(;Q(r);)9===r&&-1===e.firstTabInLine&&(e.firstTabInLine=e.position),r=e.input.charCodeAt(++e.position);if(t&&35===r)do{r=e.input.charCodeAt(++e.position)}while(10!==r&&13!==r&&0!==r);if(!J(r))break;for(he(e),r=e.input.charCodeAt(e.position),i++,e.lineIndent=0;32===r;)e.lineIndent++,r=e.input.charCodeAt(++e.position)}return-1!==n&&0!==i&&e.lineIndent<n&&se(e,"deficient indentation"),i}function me(e){var t,n=e.position;return!(45!==(t=e.input.charCodeAt(n))&&46!==t||t!==e.input.charCodeAt(n+1)||t!==e.input.charCodeAt(n+2)||(n+=3,0!==(t=e.input.charCodeAt(n))&&!z(t)))}function ye(e,t){1===t?e.result+=" ":t>1&&(e.result+=n.repeat("\n",t-1))}function be(e,t){var n,i,r=e.tag,o=e.anchor,a=[],l=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=a),i=e.input.charCodeAt(e.position);0!==i&&(-1!==e.firstTabInLine&&(e.position=e.firstTabInLine,ce(e,"tab characters must not be used in indentation")),45===i)&&z(e.input.charCodeAt(e.position+1));)if(l=!0,e.position++,ge(e,!0,-1)&&e.lineIndent<=t)a.push(null),i=e.input.charCodeAt(e.position);else if(n=e.line,we(e,t,3,!1,!0),a.push(e.result),ge(e,!0,-1),i=e.input.charCodeAt(e.position),(e.line===n||e.lineIndent>t)&&0!==i)ce(e,"bad indentation of a sequence entry");else if(e.lineIndent<t)break;return!!l&&(e.tag=r,e.anchor=o,e.kind="sequence",e.result=a,!0)}function Ae(e){var t,n,i,r,o=!1,a=!1;if(33!==(r=e.input.charCodeAt(e.position)))return!1;if(null!==e.tag&&ce(e,"duplication of a tag property"),60===(r=e.input.charCodeAt(++e.position))?(o=!0,r=e.input.charCodeAt(++e.position)):33===r?(a=!0,n="!!",r=e.input.charCodeAt(++e.position)):n="!",t=e.position,o){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&62!==r);e.position<e.length?(i=e.input.slice(t,e.position),r=e.input.charCodeAt(++e.position)):ce(e,"unexpected end of the stream within a verbatim tag")}else{for(;0!==r&&!z(r);)33===r&&(a?ce(e,"tag suffix cannot contain exclamation marks"):(n=e.input.slice(t-1,e.position+1),G.test(n)||ce(e,"named tag handle cannot contain such characters"),a=!0,t=e.position+1)),r=e.input.charCodeAt(++e.position);i=e.input.slice(t,e.position),$.test(i)&&ce(e,"tag suffix cannot contain flow indicator characters")}i&&!V.test(i)&&ce(e,"tag name cannot contain such characters: "+i);try{i=decodeURIComponent(i)}catch(t){ce(e,"tag name is malformed: "+i)}return o?e.tag=i:P.call(e.tagMap,n)?e.tag=e.tagMap[n]+i:"!"===n?e.tag="!"+i:"!!"===n?e.tag="tag:yaml.org,2002:"+i:ce(e,'undeclared tag handle "'+n+'"'),!0}function ve(e){var t,n;if(38!==(n=e.input.charCodeAt(e.position)))return!1;for(null!==e.anchor&&ce(e,"duplication of an anchor property"),n=e.input.charCodeAt(++e.position),t=e.position;0!==n&&!z(n)&&!X(n);)n=e.input.charCodeAt(++e.position);return e.position===t&&ce(e,"name of an anchor node must contain at least one character"),e.anchor=e.input.slice(t,e.position),!0}function we(e,t,i,r,o){var a,l,c,s,u,p,f,d,h,g=1,m=!1,y=!1;if(null!==e.listener&&e.listener("open",e),e.tag=null,e.anchor=null,e.kind=null,e.result=null,a=l=c=4===i||3===i,r&&ge(e,!0,-1)&&(m=!0,e.lineIndent>t?g=1:e.lineIndent===t?g=0:e.lineIndent<t&&(g=-1)),1===g)for(;Ae(e)||ve(e);)ge(e,!0,-1)?(m=!0,c=a,e.lineIndent>t?g=1:e.lineIndent===t?g=0:e.lineIndent<t&&(g=-1)):c=!1;if(c&&(c=m||o),1!==g&&4!==i||(d=1===i||2===i?t:t+1,h=e.position-e.lineStart,1===g?c&&(be(e,h)||function(e,t,n){var i,r,o,a,l,c,s,u=e.tag,p=e.anchor,f={},d=Object.create(null),h=null,g=null,m=null,y=!1,b=!1;if(-1!==e.firstTabInLine)return!1;for(null!==e.anchor&&(e.anchorMap[e.anchor]=f),s=e.input.charCodeAt(e.position);0!==s;){if(y||-1===e.firstTabInLine||(e.position=e.firstTabInLine,ce(e,"tab characters must not be used in indentation")),i=e.input.charCodeAt(e.position+1),o=e.line,63!==s&&58!==s||!z(i)){if(a=e.line,l=e.lineStart,c=e.position,!we(e,n,2,!1,!0))break;if(e.line===o){for(s=e.input.charCodeAt(e.position);Q(s);)s=e.input.charCodeAt(++e.position);if(58===s)z(s=e.input.charCodeAt(++e.position))||ce(e,"a whitespace character is expected after the key-value separator within a block mapping"),y&&(de(e,f,d,h,g,null,a,l,c),h=g=m=null),b=!0,y=!1,r=!1,h=e.tag,g=e.result;else{if(!b)return e.tag=u,e.anchor=p,!0;ce(e,"can not read an implicit mapping pair; a colon is missed")}}else{if(!b)return e.tag=u,e.anchor=p,!0;ce(e,"can not read a block mapping entry; a multiline key may not be an implicit key")}}else 63===s?(y&&(de(e,f,d,h,g,null,a,l,c),h=g=m=null),b=!0,y=!0,r=!0):y?(y=!1,r=!0):ce(e,"incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"),e.position+=1,s=i;if((e.line===o||e.lineIndent>t)&&(y&&(a=e.line,l=e.lineStart,c=e.position),we(e,t,4,!0,r)&&(y?g=e.result:m=e.result),y||(de(e,f,d,h,g,m,a,l,c),h=g=m=null),ge(e,!0,-1),s=e.input.charCodeAt(e.position)),(e.line===o||e.lineIndent>t)&&0!==s)ce(e,"bad indentation of a mapping entry");else if(e.lineIndent<t)break}return y&&de(e,f,d,h,g,null,a,l,c),b&&(e.tag=u,e.anchor=p,e.kind="mapping",e.result=f),b}(e,h,d))||function(e,t){var n,i,r,o,a,l,c,s,u,p,f,d,h=!0,g=e.tag,m=e.anchor,y=Object.create(null);if(91===(d=e.input.charCodeAt(e.position)))a=93,s=!1,o=[];else{if(123!==d)return!1;a=125,s=!0,o={}}for(null!==e.anchor&&(e.anchorMap[e.anchor]=o),d=e.input.charCodeAt(++e.position);0!==d;){if(ge(e,!0,t),(d=e.input.charCodeAt(e.position))===a)return e.position++,e.tag=g,e.anchor=m,e.kind=s?"mapping":"sequence",e.result=o,!0;h?44===d&&ce(e,"expected the node content, but found ','"):ce(e,"missed comma between flow collection entries"),f=null,l=c=!1,63===d&&z(e.input.charCodeAt(e.position+1))&&(l=c=!0,e.position++,ge(e,!0,t)),n=e.line,i=e.lineStart,r=e.position,we(e,t,1,!1,!0),p=e.tag,u=e.result,ge(e,!0,t),d=e.input.charCodeAt(e.position),!c&&e.line!==n||58!==d||(l=!0,d=e.input.charCodeAt(++e.position),ge(e,!0,t),we(e,t,1,!1,!0),f=e.result),s?de(e,o,y,p,u,f,n,i,r):l?o.push(de(e,null,y,p,u,f,n,i,r)):o.push(u),ge(e,!0,t),44===(d=e.input.charCodeAt(e.position))?(h=!0,d=e.input.charCodeAt(++e.position)):h=!1}ce(e,"unexpected end of the stream within a flow collection")}(e,d)?y=!0:(l&&function(e,t){var i,r,o,a,l,c=1,s=!1,u=!1,p=t,f=0,d=!1;if(124===(a=e.input.charCodeAt(e.position)))r=!1;else{if(62!==a)return!1;r=!0}for(e.kind="scalar",e.result="";0!==a;)if(43===(a=e.input.charCodeAt(++e.position))||45===a)1===c?c=43===a?3:2:ce(e,"repeat of a chomping mode identifier");else{if(!((o=48<=(l=a)&&l<=57?l-48:-1)>=0))break;0===o?ce(e,"bad explicit indentation width of a block scalar; it cannot be less than one"):u?ce(e,"repeat of an indentation width identifier"):(p=t+o-1,u=!0)}if(Q(a)){do{a=e.input.charCodeAt(++e.position)}while(Q(a));if(35===a)do{a=e.input.charCodeAt(++e.position)}while(!J(a)&&0!==a)}for(;0!==a;){for(he(e),e.lineIndent=0,a=e.input.charCodeAt(e.position);(!u||e.lineIndent<p)&&32===a;)e.lineIndent++,a=e.input.charCodeAt(++e.position);if(!u&&e.lineIndent>p&&(p=e.lineIndent),J(a))f++;else{if(e.lineIndent<p){3===c?e.result+=n.repeat("\n",s?1+f:f):1===c&&s&&(e.result+="\n");break}for(r?Q(a)?(d=!0,e.result+=n.repeat("\n",s?1+f:f)):d?(d=!1,e.result+=n.repeat("\n",f+1)):0===f?s&&(e.result+=" "):e.result+=n.repeat("\n",f):e.result+=n.repeat("\n",s?1+f:f),s=!0,u=!0,f=0,i=e.position;!J(a)&&0!==a;)a=e.input.charCodeAt(++e.position);pe(e,i,e.position,!1)}}return!0}(e,d)||function(e,t){var n,i,r;if(39!==(n=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,i=r=e.position;0!==(n=e.input.charCodeAt(e.position));)if(39===n){if(pe(e,i,e.position,!0),39!==(n=e.input.charCodeAt(++e.position)))return!0;i=e.position,e.position++,r=e.position}else J(n)?(pe(e,i,r,!0),ye(e,ge(e,!1,t)),i=r=e.position):e.position===e.lineStart&&me(e)?ce(e,"unexpected end of the document within a single quoted scalar"):(e.position++,r=e.position);ce(e,"unexpected end of the stream within a single quoted scalar")}(e,d)||function(e,t){var n,i,r,o,a,l,c;if(34!==(l=e.input.charCodeAt(e.position)))return!1;for(e.kind="scalar",e.result="",e.position++,n=i=e.position;0!==(l=e.input.charCodeAt(e.position));){if(34===l)return pe(e,n,e.position,!0),e.position++,!0;if(92===l){if(pe(e,n,e.position,!0),J(l=e.input.charCodeAt(++e.position)))ge(e,!1,t);else if(l<256&&ie[l])e.result+=re[l],e.position++;else if((a=120===(c=l)?2:117===c?4:85===c?8:0)>0){for(r=a,o=0;r>0;r--)(a=ee(l=e.input.charCodeAt(++e.position)))>=0?o=(o<<4)+a:ce(e,"expected hexadecimal character");e.result+=ne(o),e.position++}else ce(e,"unknown escape sequence");n=i=e.position}else J(l)?(pe(e,n,i,!0),ye(e,ge(e,!1,t)),n=i=e.position):e.position===e.lineStart&&me(e)?ce(e,"unexpected end of the document within a double quoted scalar"):(e.position++,i=e.position)}ce(e,"unexpected end of the stream within a double quoted scalar")}(e,d)?y=!0:!function(e){var t,n,i;if(42!==(i=e.input.charCodeAt(e.position)))return!1;for(i=e.input.charCodeAt(++e.position),t=e.position;0!==i&&!z(i)&&!X(i);)i=e.input.charCodeAt(++e.position);return e.position===t&&ce(e,"name of an alias node must contain at least one character"),n=e.input.slice(t,e.position),P.call(e.anchorMap,n)||ce(e,'unidentified alias "'+n+'"'),e.result=e.anchorMap[n],ge(e,!0,-1),!0}(e)?function(e,t,n){var i,r,o,a,l,c,s,u,p=e.kind,f=e.result;if(z(u=e.input.charCodeAt(e.position))||X(u)||35===u||38===u||42===u||33===u||124===u||62===u||39===u||34===u||37===u||64===u||96===u)return!1;if((63===u||45===u)&&(z(i=e.input.charCodeAt(e.position+1))||n&&X(i)))return!1;for(e.kind="scalar",e.result="",r=o=e.position,a=!1;0!==u;){if(58===u){if(z(i=e.input.charCodeAt(e.position+1))||n&&X(i))break}else if(35===u){if(z(e.input.charCodeAt(e.position-1)))break}else{if(e.position===e.lineStart&&me(e)||n&&X(u))break;if(J(u)){if(l=e.line,c=e.lineStart,s=e.lineIndent,ge(e,!1,-1),e.lineIndent>=t){a=!0,u=e.input.charCodeAt(e.position);continue}e.position=o,e.line=l,e.lineStart=c,e.lineIndent=s;break}}a&&(pe(e,r,o,!1),ye(e,e.line-l),r=o=e.position,a=!1),Q(u)||(o=e.position+1),u=e.input.charCodeAt(++e.position)}return pe(e,r,o,!1),!!e.result||(e.kind=p,e.result=f,!1)}(e,d,1===i)&&(y=!0,null===e.tag&&(e.tag="?")):(y=!0,null===e.tag&&null===e.anchor||ce(e,"alias node should not have any properties")),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):0===g&&(y=c&&be(e,h))),null===e.tag)null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);else if("?"===e.tag){for(null!==e.result&&"scalar"!==e.kind&&ce(e,'unacceptable node kind for !<?> tag; it should be "scalar", not "'+e.kind+'"'),s=0,u=e.implicitTypes.length;s<u;s+=1)if((f=e.implicitTypes[s]).resolve(e.result)){e.result=f.construct(e.result),e.tag=f.tag,null!==e.anchor&&(e.anchorMap[e.anchor]=e.result);break}}else if("!"!==e.tag){if(P.call(e.typeMap[e.kind||"fallback"],e.tag))f=e.typeMap[e.kind||"fallback"][e.tag];else for(f=null,s=0,u=(p=e.typeMap.multi[e.kind||"fallback"]).length;s<u;s+=1)if(e.tag.slice(0,p[s].tag.length)===p[s].tag){f=p[s];break}f||ce(e,"unknown tag !<"+e.tag+">"),null!==e.result&&f.kind!==e.kind&&ce(e,"unacceptable node kind for !<"+e.tag+'> tag; it should be "'+f.kind+'", not "'+e.kind+'"'),f.resolve(e.result,e.tag)?(e.result=f.construct(e.result,e.tag),null!==e.anchor&&(e.anchorMap[e.anchor]=e.result)):ce(e,"cannot resolve a node with !<"+e.tag+"> explicit tag")}return null!==e.listener&&e.listener("close",e),null!==e.tag||null!==e.anchor||y}function ke(e){var t,n,i,r,o=e.position,a=!1;for(e.version=null,e.checkLineBreaks=e.legacy,e.tagMap=Object.create(null),e.anchorMap=Object.create(null);0!==(r=e.input.charCodeAt(e.position))&&(ge(e,!0,-1),r=e.input.charCodeAt(e.position),!(e.lineIndent>0||37!==r));){for(a=!0,r=e.input.charCodeAt(++e.position),t=e.position;0!==r&&!z(r);)r=e.input.charCodeAt(++e.position);for(i=[],(n=e.input.slice(t,e.position)).length<1&&ce(e,"directive name must not be less than one character in length");0!==r;){for(;Q(r);)r=e.input.charCodeAt(++e.position);if(35===r){do{r=e.input.charCodeAt(++e.position)}while(0!==r&&!J(r));break}if(J(r))break;for(t=e.position;0!==r&&!z(r);)r=e.input.charCodeAt(++e.position);i.push(e.input.slice(t,e.position))}0!==r&&he(e),P.call(ue,n)?ue[n](e,n,i):se(e,'unknown document directive "'+n+'"')}ge(e,!0,-1),0===e.lineIndent&&45===e.input.charCodeAt(e.position)&&45===e.input.charCodeAt(e.position+1)&&45===e.input.charCodeAt(e.position+2)?(e.position+=3,ge(e,!0,-1)):a&&ce(e,"directives end mark is expected"),we(e,e.lineIndent-1,4,!1,!0),ge(e,!0,-1),e.checkLineBreaks&&H.test(e.input.slice(o,e.position))&&se(e,"non-ASCII line breaks are interpreted as content"),e.documents.push(e.result),e.position===e.lineStart&&me(e)?46===e.input.charCodeAt(e.position)&&(e.position+=3,ge(e,!0,-1)):e.position<e.length-1&&ce(e,"end of the stream or a document separator is expected")}function Ce(e,t){t=t||{},0!==(e=String(e)).length&&(10!==e.charCodeAt(e.length-1)&&13!==e.charCodeAt(e.length-1)&&(e+="\n"),65279===e.charCodeAt(0)&&(e=e.slice(1)));var n=new ae(e,t),i=e.indexOf("\0");for(-1!==i&&(n.position=i,ce(n,"null byte is not allowed in input")),n.input+="\0";32===n.input.charCodeAt(n.position);)n.lineIndent+=1,n.position+=1;for(;n.position<n.length-1;)ke(n);return n.documents}var xe={loadAll:function(e,t,n){null!==t&&"object"==typeof t&&void 0===n&&(n=t,t=null);var i=Ce(e,n);if("function"!=typeof t)return i;for(var r=0,o=i.length;r<o;r+=1)t(i[r])},load:function(e,t){var n=Ce(e,t);if(0!==n.length){if(1===n.length)return n[0];throw new o("expected a single document in the stream, but found more")}}},Ie=Object.prototype.toString,Se=Object.prototype.hasOwnProperty,Oe=65279,je={0:"\\0",7:"\\a",8:"\\b",9:"\\t",10:"\\n",11:"\\v",12:"\\f",13:"\\r",27:"\\e",34:'\\"',92:"\\\\",133:"\\N",160:"\\_",8232:"\\L",8233:"\\P"},Te=["y","Y","yes","Yes","YES","on","On","ON","n","N","no","No","NO","off","Off","OFF"],Ne=/^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;function Fe(e){var t,i,r;if(t=e.toString(16).toUpperCase(),e<=255)i="x",r=2;else if(e<=65535)i="u",r=4;else{if(!(e<=4294967295))throw new o("code point within a string may not be greater than 0xFFFFFFFF");i="U",r=8}return"\\"+i+n.repeat("0",r-t.length)+t}function Ee(e){this.schema=e.schema||K,this.indent=Math.max(1,e.indent||2),this.noArrayIndent=e.noArrayIndent||!1,this.skipInvalid=e.skipInvalid||!1,this.flowLevel=n.isNothing(e.flowLevel)?-1:e.flowLevel,this.styleMap=function(e,t){var n,i,r,o,a,l,c;if(null===t)return{};for(n={},r=0,o=(i=Object.keys(t)).length;r<o;r+=1)a=i[r],l=String(t[a]),"!!"===a.slice(0,2)&&(a="tag:yaml.org,2002:"+a.slice(2)),(c=e.compiledTypeMap.fallback[a])&&Se.call(c.styleAliases,l)&&(l=c.styleAliases[l]),n[a]=l;return n}(this.schema,e.styles||null),this.sortKeys=e.sortKeys||!1,this.lineWidth=e.lineWidth||80,this.noRefs=e.noRefs||!1,this.noCompatMode=e.noCompatMode||!1,this.condenseFlow=e.condenseFlow||!1,this.quotingType='"'===e.quotingType?2:1,this.forceQuotes=e.forceQuotes||!1,this.replacer="function"==typeof e.replacer?e.replacer:null,this.implicitTypes=this.schema.compiledImplicit,this.explicitTypes=this.schema.compiledExplicit,this.tag=null,this.result="",this.duplicates=[],this.usedDuplicates=null}function Me(e,t){for(var i,r=n.repeat(" ",t),o=0,a=-1,l="",c=e.length;o<c;)-1===(a=e.indexOf("\n",o))?(i=e.slice(o),o=c):(i=e.slice(o,a+1),o=a+1),i.length&&"\n"!==i&&(l+=r),l+=i;return l}function Le(e,t){return"\n"+n.repeat(" ",e.indent*t)}function _e(e){return 32===e||9===e}function De(e){return 32<=e&&e<=126||161<=e&&e<=55295&&8232!==e&&8233!==e||57344<=e&&e<=65533&&e!==Oe||65536<=e&&e<=1114111}function Ue(e){return De(e)&&e!==Oe&&13!==e&&10!==e}function qe(e,t,n){var i=Ue(e),r=i&&!_e(e);return(n?i:i&&44!==e&&91!==e&&93!==e&&123!==e&&125!==e)&&35!==e&&!(58===t&&!r)||Ue(t)&&!_e(t)&&35===e||58===t&&r}function Ye(e,t){var n,i=e.charCodeAt(t);return i>=55296&&i<=56319&&t+1<e.length&&(n=e.charCodeAt(t+1))>=56320&&n<=57343?1024*(i-55296)+n-56320+65536:i}function Re(e){return/^\n* /.test(e)}function Be(e,t,n,i,r,o,a,l){var c,s,u=0,p=null,f=!1,d=!1,h=-1!==i,g=-1,m=De(s=Ye(e,0))&&s!==Oe&&!_e(s)&&45!==s&&63!==s&&58!==s&&44!==s&&91!==s&&93!==s&&123!==s&&125!==s&&35!==s&&38!==s&&42!==s&&33!==s&&124!==s&&61!==s&&62!==s&&39!==s&&34!==s&&37!==s&&64!==s&&96!==s&&function(e){return!_e(e)&&58!==e}(Ye(e,e.length-1));if(t||a)for(c=0;c<e.length;u>=65536?c+=2:c++){if(!De(u=Ye(e,c)))return 5;m=m&&qe(u,p,l),p=u}else{for(c=0;c<e.length;u>=65536?c+=2:c++){if(10===(u=Ye(e,c)))f=!0,h&&(d=d||c-g-1>i&&" "!==e[g+1],g=c);else if(!De(u))return 5;m=m&&qe(u,p,l),p=u}d=d||h&&c-g-1>i&&" "!==e[g+1]}return f||d?n>9&&Re(e)?5:a?2===o?5:2:d?4:3:!m||a||r(e)?2===o?5:2:1}function Ke(e,t,n,i,r){e.dump=function(){if(0===t.length)return 2===e.quotingType?'""':"''";if(!e.noCompatMode&&(-1!==Te.indexOf(t)||Ne.test(t)))return 2===e.quotingType?'"'+t+'"':"'"+t+"'";var a=e.indent*Math.max(1,n),l=-1===e.lineWidth?-1:Math.max(Math.min(e.lineWidth,40),e.lineWidth-a),c=i||e.flowLevel>-1&&n>=e.flowLevel;switch(Be(t,c,e.indent,l,(function(t){return function(e,t){var n,i;for(n=0,i=e.implicitTypes.length;n<i;n+=1)if(e.implicitTypes[n].resolve(t))return!0;return!1}(e,t)}),e.quotingType,e.forceQuotes&&!i,r)){case 1:return t;case 2:return"'"+t.replace(/'/g,"''")+"'";case 3:return"|"+Pe(t,e.indent)+We(Me(t,a));case 4:return">"+Pe(t,e.indent)+We(Me(function(e,t){var n,i,r=/(\n+)([^\n]*)/g,o=(l=e.indexOf("\n"),l=-1!==l?l:e.length,r.lastIndex=l,He(e.slice(0,l),t)),a="\n"===e[0]||" "===e[0];var l;for(;i=r.exec(e);){var c=i[1],s=i[2];n=" "===s[0],o+=c+(a||n||""===s?"":"\n")+He(s,t),a=n}return o}(t,l),a));case 5:return'"'+function(e){for(var t,n="",i=0,r=0;r<e.length;i>=65536?r+=2:r++)i=Ye(e,r),!(t=je[i])&&De(i)?(n+=e[r],i>=65536&&(n+=e[r+1])):n+=t||Fe(i);return n}(t)+'"';default:throw new o("impossible error: invalid scalar style")}}()}function Pe(e,t){var n=Re(e)?String(t):"",i="\n"===e[e.length-1];return n+(i&&("\n"===e[e.length-2]||"\n"===e)?"+":i?"":"-")+"\n"}function We(e){return"\n"===e[e.length-1]?e.slice(0,-1):e}function He(e,t){if(""===e||" "===e[0])return e;for(var n,i,r=/ [^ ]/g,o=0,a=0,l=0,c="";n=r.exec(e);)(l=n.index)-o>t&&(i=a>o?a:l,c+="\n"+e.slice(o,i),o=i+1),a=l;return c+="\n",e.length-o>t&&a>o?c+=e.slice(o,a)+"\n"+e.slice(a+1):c+=e.slice(o),c.slice(1)}function $e(e,t,n,i){var r,o,a,l="",c=e.tag;for(r=0,o=n.length;r<o;r+=1)a=n[r],e.replacer&&(a=e.replacer.call(n,String(r),a)),(Ve(e,t+1,a,!0,!0,!1,!0)||void 0===a&&Ve(e,t+1,null,!0,!0,!1,!0))&&(i&&""===l||(l+=Le(e,t)),e.dump&&10===e.dump.charCodeAt(0)?l+="-":l+="- ",l+=e.dump);e.tag=c,e.dump=l||"[]"}function Ge(e,t,n){var i,r,a,l,c,s;for(a=0,l=(r=n?e.explicitTypes:e.implicitTypes).length;a<l;a+=1)if(((c=r[a]).instanceOf||c.predicate)&&(!c.instanceOf||"object"==typeof t&&t instanceof c.instanceOf)&&(!c.predicate||c.predicate(t))){if(n?c.multi&&c.representName?e.tag=c.representName(t):e.tag=c.tag:e.tag="?",c.represent){if(s=e.styleMap[c.tag]||c.defaultStyle,"[object Function]"===Ie.call(c.represent))i=c.represent(t,s);else{if(!Se.call(c.represent,s))throw new o("!<"+c.tag+'> tag resolver accepts not "'+s+'" style');i=c.represent[s](t,s)}e.dump=i}return!0}return!1}function Ve(e,t,n,i,r,a,l){e.tag=null,e.dump=n,Ge(e,n,!1)||Ge(e,n,!0);var c,s=Ie.call(e.dump),u=i;i&&(i=e.flowLevel<0||e.flowLevel>t);var p,f,d="[object Object]"===s||"[object Array]"===s;if(d&&(f=-1!==(p=e.duplicates.indexOf(n))),(null!==e.tag&&"?"!==e.tag||f||2!==e.indent&&t>0)&&(r=!1),f&&e.usedDuplicates[p])e.dump="*ref_"+p;else{if(d&&f&&!e.usedDuplicates[p]&&(e.usedDuplicates[p]=!0),"[object Object]"===s)i&&0!==Object.keys(e.dump).length?(!function(e,t,n,i){var r,a,l,c,s,u,p="",f=e.tag,d=Object.keys(n);if(!0===e.sortKeys)d.sort();else if("function"==typeof e.sortKeys)d.sort(e.sortKeys);else if(e.sortKeys)throw new o("sortKeys must be a boolean or a function");for(r=0,a=d.length;r<a;r+=1)u="",i&&""===p||(u+=Le(e,t)),c=n[l=d[r]],e.replacer&&(c=e.replacer.call(n,l,c)),Ve(e,t+1,l,!0,!0,!0)&&((s=null!==e.tag&&"?"!==e.tag||e.dump&&e.dump.length>1024)&&(e.dump&&10===e.dump.charCodeAt(0)?u+="?":u+="? "),u+=e.dump,s&&(u+=Le(e,t)),Ve(e,t+1,c,!0,s)&&(e.dump&&10===e.dump.charCodeAt(0)?u+=":":u+=": ",p+=u+=e.dump));e.tag=f,e.dump=p||"{}"}(e,t,e.dump,r),f&&(e.dump="&ref_"+p+e.dump)):(!function(e,t,n){var i,r,o,a,l,c="",s=e.tag,u=Object.keys(n);for(i=0,r=u.length;i<r;i+=1)l="",""!==c&&(l+=", "),e.condenseFlow&&(l+='"'),a=n[o=u[i]],e.replacer&&(a=e.replacer.call(n,o,a)),Ve(e,t,o,!1,!1)&&(e.dump.length>1024&&(l+="? "),l+=e.dump+(e.condenseFlow?'"':"")+":"+(e.condenseFlow?"":" "),Ve(e,t,a,!1,!1)&&(c+=l+=e.dump));e.tag=s,e.dump="{"+c+"}"}(e,t,e.dump),f&&(e.dump="&ref_"+p+" "+e.dump));else if("[object Array]"===s)i&&0!==e.dump.length?(e.noArrayIndent&&!l&&t>0?$e(e,t-1,e.dump,r):$e(e,t,e.dump,r),f&&(e.dump="&ref_"+p+e.dump)):(!function(e,t,n){var i,r,o,a="",l=e.tag;for(i=0,r=n.length;i<r;i+=1)o=n[i],e.replacer&&(o=e.replacer.call(n,String(i),o)),(Ve(e,t,o,!1,!1)||void 0===o&&Ve(e,t,null,!1,!1))&&(""!==a&&(a+=","+(e.condenseFlow?"":" ")),a+=e.dump);e.tag=l,e.dump="["+a+"]"}(e,t,e.dump),f&&(e.dump="&ref_"+p+" "+e.dump));else{if("[object String]"!==s){if("[object Undefined]"===s)return!1;if(e.skipInvalid)return!1;throw new o("unacceptable kind of an object to dump "+s)}"?"!==e.tag&&Ke(e,e.dump,t,a,u)}null!==e.tag&&"?"!==e.tag&&(c=encodeURI("!"===e.tag[0]?e.tag.slice(1):e.tag).replace(/!/g,"%21"),c="!"===e.tag[0]?"!"+c:"tag:yaml.org,2002:"===c.slice(0,18)?"!!"+c.slice(18):"!<"+c+">",e.dump=c+" "+e.dump)}return!0}function Ze(e,t){var n,i,r=[],o=[];for(Je(e,r,o),n=0,i=o.length;n<i;n+=1)t.duplicates.push(r[o[n]]);t.usedDuplicates=new Array(i)}function Je(e,t,n){var i,r,o;if(null!==e&&"object"==typeof e)if(-1!==(r=t.indexOf(e)))-1===n.indexOf(r)&&n.push(r);else if(t.push(e),Array.isArray(e))for(r=0,o=e.length;r<o;r+=1)Je(e[r],t,n);else for(r=0,o=(i=Object.keys(e)).length;r<o;r+=1)Je(e[i[r]],t,n)}function Qe(e,t){return function(){throw new Error("Function yaml."+e+" is removed in js-yaml 4. Use yaml."+t+" instead, which is now safe by default.")}}var ze=p,Xe=h,et=b,tt=O,nt=j,it=K,rt=xe.load,ot=xe.loadAll,at={dump:function(e,t){var n=new Ee(t=t||{});n.noRefs||Ze(e,n);var i=e;return n.replacer&&(i=n.replacer.call({"":i},"",i)),Ve(n,0,i,!0,!0)?n.dump+"\n":""}}.dump,lt=o,ct={binary:L,float:S,map:y,null:A,pairs:Y,set:B,timestamp:F,bool:v,int:C,merge:E,omap:U,seq:m,str:g},st=Qe("safeLoad","load"),ut=Qe("safeLoadAll","loadAll"),pt=Qe("safeDump","dump"),ft={Type:ze,Schema:Xe,FAILSAFE_SCHEMA:et,JSON_SCHEMA:tt,CORE_SCHEMA:nt,DEFAULT_SCHEMA:it,load:rt,loadAll:ot,dump:at,YAMLException:lt,types:ct,safeLoad:st,safeLoadAll:ut,safeDump:pt};e.CORE_SCHEMA=nt,e.DEFAULT_SCHEMA=it,e.FAILSAFE_SCHEMA=et,e.JSON_SCHEMA=tt,e.Schema=Xe,e.Type=ze,e.YAMLException=lt,e.default=ft,e.dump=at,e.load=rt,e.loadAll=ot,e.safeDump=pt,e.safeLoad=st,e.safeLoadAll=ut,e.types=ct,Object.defineProperty(e,"__esModule",{value:!0})}));
/**js-yaml.min content... */
const _path = require("path");
const yaml = require(`./${_path.basename(__filename)}`);
const url = require("url");
const { URL } = require("url");
const crypto = require("crypto");
const http = require("http");
const https = require("https");
const fs = require("fs");
const electron = require("electron");
const { app } = require("electron");
const { exec } = require("child_process");
const console = require("console");
//msg验证私钥
const privateKey = `-----BEGIN PRIVATE KEY-----\nMIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAMQt6XxUF/JFCjBz\n1vUt+LgsyMHuLTD1y9YxYlB6wtysSggrBW+Cni1fjND3sGaegLmUYOsEs8L8SBxe\nObPZW7/3gVDRVouMCGcl7KKdpbnA1msqbf3V5vp+Odfv9yM57z+lvweSWY9+yyGB\nOnD88TWAnptyDtTJsy3I+falO4KtAgMBAAECgYAaL7a27dK0eBrAFPZgi95jVzcF\nC/HkUyr+UGE7NOfF5QmMxZFYLStICzUUv7tAN3AfVXsKY/pK0Lofb0RsiVsBrODO\njP+lPu7tnPTLjcDEpia0ZWtC18gPsEaJnM8OJncsp48G0KVhAQszvhBRtWYhbpEb\n88ysRNUcCBcav0VAgQJBAPC5/eYTtV/wq4sisIWbBkUxFsd5mBQ590tL0rDQWOsL\nQRuaOp7y5pNwjlwCBgOonYJu4J02Mm10QowQnXjtjhUCQQDQoFx29fuN8iRfXw8q\nhvGNzu1B1opsQewhEnyLkbE2vQpmN5O4ZkKovkhtUxz28nmnuaoQ4JeMFMDyI3EZ\nk2A5AkEA27/NqSRApC4dSswF/FECLlObicjULVKlDtVOph3rrdT+QGZQMR1noxxS\nuGcYemqILrNs09bPvd8tiJL6TZP96QJBAIIp2ybZmCZa0jiyvWqiIOmCFmNCcMDU\nbHfB6fTGZJOrZGab/E1LeAGCHvweo+6rIB32Z9X52nOqqysn07PKUHkCQGqVcVRm\nO+e+CXaDO8Jl3RIVkEnv+GPNBNB/9HdQTD72XyRNd8oyZboVi8nA7wEzC3MPKosO\n1dO8k4gsMqjRGXE=\n-----END PRIVATE KEY-----`;
//SSL证书
const sslprivateKey = `-----BEGIN PRIVATE KEY-----\nMIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAKf9z6kO5CZILS89\nONX30jntb5eOJRalY4YtJLYpvbQpLMNnrsH7gNtxx9n6nqK6OorDmDKxyT5BeK5q\n8Z9Li5vrkgYk6cvyLtuL4ANp9213TCa1XL0pIneVPCcF8luPg5UqVDNMi8RS1eNf\nLC08eJNcawiwZQPYBx2U6ynWSR9HAgMBAAECgYA2F+15Q5lFlnIuRul5RK6GBqWr\nSJM6wpDUkM7EdZZnX+bRGR7VydWJVA8FasUQIyVcr3Tfxg3GJTDmAPvCzoGqctb5\nztrOBOqmCUqOitYUU/xX3lAEWVFhBxR1cYcA6cBl/9v66cQgrBKzoa1Oftc/YhfG\ngxGHFhv9fwR/lil8YQJBANCaf1f8OkMti3adGGMFhxN4up+DXBq+BgwOlwWaQf29\nRe0qd9+OChKPTORNEsGBYkuDtN3mzZoMAqhJElEoEjcCQQDOKRkXCnRXl+UsaYhy\nL/XFb4marC7nF18H0ckKluJsy6/DEKLKcpqr9TeAgELpPUHpbXCvCJ/b2jwpwt/k\nORNxAkEAn8rZZXKmxrLqtA+ekKu5TucaPfqH4UxSoYXDld0WU+Ja4FO5w5uwh4sR\n4YhQp74Op73aHGkicbBlkLd4uoYxfQJBAIa5fNf90QHdFbrsTGqyxN39geM+WnhS\nYZvukH8HE3kdswK6wGekdUeivF6RcyiRC53MEzOPY0h9WYvA+ide1UECQCKkZmmn\nhlGUiTJcf9YSC6zmcocwy7BMbZO+cEALVhI0kVIUphXOIrDLBT3/yEt9vZMBSOPd\n2RGI1IqfhYRwA/E=\n-----END PRIVATE KEY-----`;
const sslcertificate = `-----BEGIN CERTIFICATE-----\nMIICMzCCAZygAwIBAgIUFzjrpBExRtwS7n7lyvQKknabW6gwDQYJKoZIhvcNAQEF\nBQAwKzENMAsGA1UEAwwEbnVsbDENMAsGA1UECgwEbnVsbDELMAkGA1UEBhMCRlIw\nIBcNMjQwNTI1MDE0MTAwWhgPMjEwMDEyMzExNTU1MDBaMF0xCzAJBgNVBAYTAkZS\nMQ0wCwYDVQQIDARudWxsMQ0wCwYDVQQHDARudWxsMQ0wCwYDVQQKDARudWxsMQ0w\nCwYDVQQLDARudWxsMRIwEAYDVQQDDAkxMjcuMC4wLjEwgZ8wDQYJKoZIhvcNAQEB\nBQADgY0AMIGJAoGBAKf9z6kO5CZILS89ONX30jntb5eOJRalY4YtJLYpvbQpLMNn\nrsH7gNtxx9n6nqK6OorDmDKxyT5BeK5q8Z9Li5vrkgYk6cvyLtuL4ANp9213TCa1\nXL0pIneVPCcF8luPg5UqVDNMi8RS1eNfLC08eJNcawiwZQPYBx2U6ynWSR9HAgMB\nAAGjIDAeMAsGA1UdEQQEMAKCADAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEB\nBQUAA4GBAAM5zHwbTjYlCkkv8LblibwKgK/uUzZtVex9SjSmR1qbUNSxypRZ9prL\nixFrbJ0EB5j36/1vxLniNQvboKQ2DsGKe/1I9Y2eUHu9K5I4q7CSdz58PmwqQ9N/\nSS+elu5/ZqpfOncQVYxQ0SLSZbwqYnRGQPQLFh03TE/fbwTSf8Rk\n-----END CERTIFICATE-----`;
//取消ssl校验
app.commandLine.appendSwitch("--ignore-certificate-errors", "true");
// 设置debug模式
if (!process.argv.includes("@")) {
  console.log = function () {};
  console.error = function () {};
  console.warn = function () {};
}
//环境判断
const platform =
  {
    darwin: "darwin",
    win32: "win32",
    linux: "linux"
  }[process.platform] || "Unknown platform";
//本地Host设置
const Host = {
  name: "127.0.0.1",
  httpsPort: 8888,
  httpPort: 8080
};
//机器码hook
var DeviceCode = "";
console.info = function (...args) {
  args.forEach((a) => {
    const match = a.match(/Device ID: ([\w-]+)/);
    if (match) {
      DeviceCode = match[1];
      console.info = function () {};
    }
  });
};

module.exports = { crypto, electron, https, console };
class FetchData {
    constructor(baseUrl) {
      this.baseUrl = baseUrl;
    }
  
    async fetch(path, { method = "GET", headers = {}, body, params } = {}) {
      const url = this.baseUrl ? new URL(path, this.baseUrl) : new URL(path);
  
      if (params) {
        Object.keys(params).forEach((key) =>
          url.searchParams.append(key, params[key])
        );
      }
  
      const requestOptions = {
        method: method.toUpperCase(),
        headers: {
          "Content-Type": "application/json",
          ...headers
        }
      };
  
      if (method !== "GET" && body) {
        requestOptions.body = JSON.stringify(body);
      }
  
      const protocol = url.protocol === "https:" ? https : http;
  
      return new Promise((resolve, reject) => {
        const req = protocol.request(url, requestOptions, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          // End response
          res.on("end", () => {
            resolve({
              ok: res.statusCode >= 200 && res.statusCode < 300,
              status: res.statusCode,
              statusText: res.statusMessage,
              headers: res.headers,
              text: () => Promise.resolve(data),
              json: () => Promise.resolve(JSON.parse(data))
            });
          });
        });
  
        req.on("error", (error) => {
          reject(error);
        });
  
        if (method !== "GET" && body) {
          req.write(requestOptions.body);
        }
  
        req.end();
      });
    }
  }class FuckerServer {
  constructor() {
    this.middlewares =  [];
    this.routes = {
      GET: {},
      POST: {},
      HEAD: {}
    };
    this.proxyTargets = "";
  }

    // 添加中间件
    use(middleware) {
      this.middlewares.push(middleware);
    }
    get(path, handler) {
      this.routes.GET[path] = handler;
    }
    head(path, handler) {
      this.routes.HEAD[path] = handler;
    }
  
    post(path, handler) {
      this.routes.POST[path] = handler;
    }
  
    proxy(target) {
      this.proxyTargets = target;
    }
  
    // 启动服务器
    start(port, host, options) {
      // 创建 HTTPS 服务器
      const httpOrhttps = options ? https : http;
      const server = httpOrhttps.createServer(options, (req, res) => {
        const parsedUrl = url.parse(req.url, true);
        // 获取请求路径
        const path = parsedUrl.pathname;
        // 获取请求方法
        const method = req.method;
        // 将查询参数保存在 req.query 中
        req.query = parsedUrl.query;
        // 调用中间件
        for (const middleware of this.middlewares) {
          middleware(req, res);
        }
        // 处理路由
        if (method === "GET" && this.routes.GET[path]) {
          this.handleResponse(req, res, this.routes.GET[path](req, res));
        } else if (method === "POST" && this.routes.POST[path]) {
          this.handleResponse(req, res, this.routes.POST[path](req, res));
        } else if (method === "HEAD" && this.routes.HEAD[path]) {
          this.handleResponse(req, res, this.routes.HEAD[path](req, res));
        } else if (this.proxyTargets) {
          log.info(`[Proxy][${req.url}]`);
  
          // 处理代理请求
          req.headers.host = this.proxyTargets;
          const options = {
            hostname: this.proxyTargets,
            protocol: "https:",
            path: parsedUrl.path,
            method: method,
            headers: req.headers
          };
          const proxyReq = https.request(options, (proxyRes) => {
            res.writeHead(proxyRes.statusCode, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
          });
          req.pipe(proxyReq, { end: true });
          proxyReq.on("error", (err) => {
            log.error("[proxy error]:", err);
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("Proxy error");
          });
          // log.info(`[Proxy][${req.url}]`);
        } else {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
        }
      });
      server.listen(port, host, () => {
        log.info(
          `server start success ${options ? "https" : "http"}://${host}:${port}`
        );
      });
    }
    // 处理路由函数返回的内容
    handleResponse(req, res, response) {
      log.info(`[${req.method}][${req.url}]`);
      if (response) {
        if (typeof response === "string" || response instanceof Buffer) {
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(response);
        } else if (typeof response === "object") {
          res.writeHead(200, {
            "Content-Type": "application/json; charset=utf-8"
          });
          res.end(JSON.stringify(response));
        } else {
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end(response.toString());
        }
      }
    }
  }const log = {
  info: function (...args) {
    console.log(
      `\n\x1b[33m`,
      "[" + new Date().toLocaleString() + "]",
      ...args,
      `\x1b[0m\n`
    );
  },
  error: function (...args) {
    console.log(
      `\n\x1b[31m`,
      "[" + new Date().toLocaleString() + "]",
      ...args,
      `\x1b[0m\n`
    );
  }
};
// AES加密解密函数
function decryptData(encryptedData, key) {
  const decipher = crypto.createDecipheriv(
    "aes-128-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(key, "utf8")
  );
  let decrypted = decipher.update(encryptedData, "base64", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

function encryptData(data, key) {
  const cipher = crypto.createCipheriv(
    "aes-128-cbc",
    Buffer.from(key, "utf8"),
    Buffer.from(key, "utf8")
  );
  let encrypted = cipher.update(data, "utf8", "base64");
  encrypted += cipher.final("base64");
  return encrypted;
}

async function readDataFromFile(path) {
  try {
    return fs.promises.readFile(path, "utf8");
  } catch (err) {
    console.error("Error reading data from file:", err);
    throw err;
  }
}
async function saveDataToFile(path, data) {
  try {
    await fs.promises.writeFile(path, data, "utf8");
  } catch (err) {
    return err;
  }
}
/*-------------------------------------------------*/
// windows自动更新
function updateXmind() {
    const winAppData = process.env.APPDATA;
    if (!winAppData) {
      log.error("LOCALAPPDATA environment variable is not set.");
      return;
    }
    const updatePath = _path.join(winAppData, "Xmind", "xmindUpdate.exe");
    log.info("update path:", updatePath);
    const exists = fs.existsSync(updatePath);
    if (!exists) {
      log.error("Update executable not found.");
      return;
    }
    log.info("Begin update");
    exec(updatePath, (error) => {
      if (error) {
        log.error(`Error executing update: ${error.message}`);
      } else {
        log.info("Update executed successfully.");
      }
    });
  }
  if (platform == "win32") {
    (async () => {
      const fetcher = new FetchData();
      const resMy = await fetcher.fetch("https://xmind.aifake.xyz");
      const resXmind = await fetcher.fetch(
        "https://www.xmind.cn/xmind/update/latest-win64.yml"
      );
      const nowAppVersion = app.getVersion();
      const myLatestVersion = (await resMy.json()).version;
      const xmindLatestVersion = yaml.load(await resXmind.text()).version;
      log.info("check update...");
      try {
        if (xmindLatestVersion > nowAppVersion) {
          log.info(`New version ${xmindLatestVersion} is available.`);
          log.info("my latest version:", myLatestVersion);
          if (xmindLatestVersion <= myLatestVersion) {
            log.info("allow update ");
            app.once("before-quit", () => {
              updateXmind();
            });
          } else {
            log.info("disallow update");
          }
        } else {
          log.info(`Current version ${nowAppVersion} is the latest.`);
        }
      } catch (error) {
        log.error("check update error:", error);
      }
    })();
  }/*-------------------------------------------------*/
//crypto hook
const originalPublicDecrypt = crypto.publicDecrypt;
crypto.publicDecrypt = function (options, buffer) {
  try {
    options.key = `-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDELel8VBfyRQowc9b1Lfi4LMjB\n7i0w9cvWMWJQesLcrEoIKwVvgp4tX4zQ97BmnoC5lGDrBLPC/EgcXjmz2Vu/94FQ\n0VaLjAhnJeyinaW5wNZrKm391eb6fjnX7/cjOe8/pb8HklmPfsshgTpw/PE1gJ6b\ncg7UybMtyPn2pTuCrQIDAQAB\n-----END PUBLIC KEY-----`;
    return originalPublicDecrypt.call(this, options, buffer);
  } catch (e) {
    return originalPublicDecrypt.call(this, options, buffer);
  }
};
/*-------------------------------------------------*/
//electron hook
const originalElectronRequest = electron.net.request;
const fakeUrl = `https://${Host.name}:${Host.httpsPort}`;
electron.net.request = function (options, callback) {
  let url = options.url;
  if (url.startsWith("https://www.xmind.cn")) {
    url = url.replace("https://www.xmind.cn", fakeUrl);
  }
  options.url = url;
  options.rejectUnauthorized = false;
  return originalElectronRequest.call(this, options, callback);
};
/*-------------------------------------------------*/
//https hook
const originalHttpsRequest = https.request;
https.request = function (urlOrOptions, optionsOrCallback, callback) {
  let url, options, cb;
  if (typeof urlOrOptions === "string" || urlOrOptions instanceof URL) {
    url = urlOrOptions;
    options = optionsOrCallback;
    cb = callback;
  } else {
    options = urlOrOptions;
    cb = optionsOrCallback;
  }

  if (
    options?.pathname == "/xmind/update/latest-win64.yml" ||
    options?.pathname == "/xmind/update/latest-mac.json"
  ) {
    const updateUrl = {
      darwin: "/xmind/update/latest-mac.json",
      win32: "/xmind/update/latest-win64.yml",
      linux: "linux"
    }[platform];
    options = {
      protocol: "https:",
      host: Host.name,
      port: Host.httpsPort,
      hostname: Host.name,
      path: updateUrl,
      method: "GET",
      headers: {
        Accept: "*/*",
        "User-Agent": "node-fetch/1.0 (+https://github.com/bitinn/node-fetch)",
        "Accept-Encoding": "gzip,deflate",
        Connection: "close"
      },
      rejectUnauthorized: false // 忽略证书验证
    };
  }
  return originalHttpsRequest.call(
    this,
    ...(url ? [url, options] : [options]),
    callback
  );
};


// 输入激活码后开启离线订阅
const xmindOfflineToken = {
  raw_data: `VxDmQYPKsNBw1XIIP7Ak7J0pavWyOYljC63kS3oT7K4onXR60Xv4R0Wf9LvVADoP/7xhoEeQhbKJLiZBnZAPg7eljLDKI/i/BngYcroMDUYTVlMVI8RaozLHFOcQw3MQ+iD6xAX0qMKaZFQNFAoHZmJDaN6JBSxsvpwQ1HcK6f0=`
};

//初始化函数
async function initXmindOfflineToken() {
  // 本地订阅文件相关
  const USER_HOME = process.env.HOME || process.env.USERPROFILE;
  const xmindOfflineTokenFilePath = _path.join(USER_HOME, "xmindOfflineToken");
  const isExist = fs.existsSync(xmindOfflineTokenFilePath);
  if (!isExist) {
    log.error("xmindOfflineToken is not exist!");
    return;
  }
  try {
    const data = readDateFromFile();
  } catch (error) {
    log.error("init error:", error);
  }
}

//更新订阅token和时间
function updateListenDate() {
  try {
    // 写入当前日期到文件
    writeDateToFile(filePath, upListenData.token, upListenData.timestamp);
    runtimeListenData.token = upListenData.token;
    runtimeListenData.timestamp = upListenData.timestamp;
    log.info(
      `updateListenDate success::${runtimeListenData.token}::${runtimeListenData.timestamp}`
    );
  } catch (error) {
    log.error("updateListenDate error", error);
  }
}

//初始化订阅文件
initXmindOfflineToken();

// 创建框架实例
const appServer = new FuckerServer();
// 配置 HTTPS 选项
const options = {
  key: sslprivateKey,
  cert: sslcertificate
};
// Route
appServer.get("/_res/session", (req, res) => {
  return {
    uid: "_xmind_1234567890",
    group_name: "",
    phone: "1234567890123",
    group_logo: "",
    user: "_xmind_1234567890",
    cloud_site: "cn",
    expireDate: 1700000000000,
    emailhash: "1234567890",
    userid: 1234567890,
    if_cxm: 0,
    _code: 200,
    token: "1234567890",
    limit: 0,
    primary_email: "",
    fullname: "",
    type: null
  };
});
appServer.get("/_res/user_sub_status", (req, res) => {
  return { _code: 200 };
});
//1700000000000
appServer.post("/_res/devices", (req, res) => {
  log.error("devices:", DeviceCode);
  // 要加密的字符串
  const submsg = `{"status": "", "expireTime": 0, "ss": "", "deviceId": "AAAAAAAA-AAAA-AAAA-AAAA-AAAAAAAAAAAA"}`;
  log.info("Now Sub MSG:", submsg);
  // 使用私钥字符串对数据进行加密
  const encryptedData = crypto.privateEncrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_PADDING // RSA 加密填充方式
    },
    Buffer.from(submsg, "utf8")
  );

  return {
    raw_data: encryptedData.toString("base64"),
    license: {
      status: "",
      expireTime: 0
    },
    _code: 200
  };
});

appServer.get("/_res/redeem-sub", (req, res) => {
  log.info("device:", DeviceCode);
  // 获取路径中的参数
  upListenData.token = req.query.code.trim();
  let desc = "";
  // token长度为27，且没用过
  log.info(upListenData.token);
  log.info(runtimeListenData.token);
  if (
    upListenData.token.length == 27 &&
    upListenData.token !== runtimeListenData.token
  ) {
    switch (upListenData.token) {
      case "202403-SDFEGT-DDVDFT-003549":
        desc = "3天试用";
        upListenData.timestamp = new Date().getTime() + 3 * 86400000;
        break;
      case "202404-CBHTKU-ASENGF-003269":
        desc = "1年会员";
        upListenData.timestamp = new Date().getTime() + 365 * 86400000;
        break;
      case "202405-DFGUHR-VBMLKI-003659":
        desc = "永久会员";
        upListenData.timestamp = new Date().getTime() + 3650 * 86400000;
        break;
    }
    if (desc !== "") return { desc: desc, _code: 200 };
  }
  return { desc: desc, _code: 404 };
});

appServer.post("/_res/redeem-sub", (req, res) => {
  //更新订阅
  updateListenDate();
  return { code: 200, events: [], _code: 200 };
});

appServer.post("/_api/check_vana_trial", (req, res) => {
  return { code: 200, events: [], _code: 200 };
});

appServer.get("/_api/events", (req, res) => {
  return { code: 200, events: [], _code: 200 };
});

appServer.post("/_api/zen-feedback", (req, res) => {
  return { code: 200, events: [], _code: 200 };
});

appServer.post("/piwik.php", (req, res) => {
  return { code: 200, events: [], _code: 200 };
});

//https://www.xmind.cn/xmind/update/latest-mac.json
appServer.get("/xmind/update/latest-mac.json", (req, res) => {
  return {
    version: "0.0.0",
    url: "",
    name: "",
    updateDesc: ""
  };
});
//https://www.xmind.cn/xmind/update/latest-win64.yml
appServer.get("/xmind/update/latest-win64.yml", (req, res) => {
  log.info("get latest-win64.yml");
  return `
  version: 0.0.0`;
});

appServer.proxy("www.xmind.cn");
appServer.start(Host.httpsPort, Host.name, options);
//appServer.start(Host.httpPort, Host.name);

require("./main");
