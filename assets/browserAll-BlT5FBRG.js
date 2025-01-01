import{r as V,F,E as w,b as B,e as K,C as U}from"./index-Bxs7hegR.js";import"./webworkerAll-DPBq_5eo.js";import"./colorToUniform-BrcILXRt.js";var m=/iPhone/i,T=/iPod/i,E=/iPad/i,M=/\biOS-universal(?:.+)Mac\b/i,x=/\bAndroid(?:.+)Mobile\b/i,A=/Android/i,b=/(?:SD4930UR|\bSilk(?:.+)Mobile\b)/i,y=/Silk/i,d=/Windows Phone/i,I=/\bWindows(?:.+)ARM\b/i,D=/BlackBerry/i,k=/BB10/i,C=/Opera Mini/i,O=/\b(CriOS|Chrome)(?:.+)Mobile/i,H=/Mobile(?:.+)Firefox\b/i,$=function(s){return typeof s<"u"&&s.platform==="MacIntel"&&typeof s.maxTouchPoints=="number"&&s.maxTouchPoints>1&&typeof MSStream>"u"};function z(s){return function(e){return e.test(s)}}function P(s){var e={userAgent:"",platform:"",maxTouchPoints:0};!s&&typeof navigator<"u"?e={userAgent:navigator.userAgent,platform:navigator.platform,maxTouchPoints:navigator.maxTouchPoints||0}:typeof s=="string"?e.userAgent=s:s&&s.userAgent&&(e={userAgent:s.userAgent,platform:s.platform,maxTouchPoints:s.maxTouchPoints||0});var t=e.userAgent,n=t.split("[FBAN");typeof n[1]<"u"&&(t=n[0]),n=t.split("Twitter"),typeof n[1]<"u"&&(t=n[0]);var i=z(t),l={apple:{phone:i(m)&&!i(d),ipod:i(T),tablet:!i(m)&&(i(E)||$(e))&&!i(d),universal:i(M),device:(i(m)||i(T)||i(E)||i(M)||$(e))&&!i(d)},amazon:{phone:i(b),tablet:!i(b)&&i(y),device:i(b)||i(y)},android:{phone:!i(d)&&i(b)||!i(d)&&i(x),tablet:!i(d)&&!i(b)&&!i(x)&&(i(y)||i(A)),device:!i(d)&&(i(b)||i(y)||i(x)||i(A))||i(/\bokhttp\b/i)},windows:{phone:i(d),tablet:i(I),device:i(d)||i(I)},other:{blackberry:i(D),blackberry10:i(k),opera:i(C),firefox:i(H),chrome:i(O),device:i(D)||i(k)||i(C)||i(H)||i(O)},any:!1,phone:!1,tablet:!1};return l.any=l.apple.device||l.android.device||l.windows.device||l.other.device,l.phone=l.apple.phone||l.android.phone||l.windows.phone,l.tablet=l.apple.tablet||l.android.tablet||l.windows.tablet,l}const R=P.default??P,W=R(globalThis.navigator),N=9,g=100,X=0,Y=0,S=2,L=1,Z=-1e3,G=-1e3,q=2;class j{constructor(e,t=W){this._mobileInfo=t,this.debug=!1,this._isActive=!1,this._isMobileAccessibility=!1,this._pool=[],this._renderId=0,this._children=[],this._androidUpdateCount=0,this._androidUpdateFrequency=500,this._hookDiv=null,(t.tablet||t.phone)&&this._createTouchHook();const n=document.createElement("div");n.style.width=`${g}px`,n.style.height=`${g}px`,n.style.position="absolute",n.style.top=`${X}px`,n.style.left=`${Y}px`,n.style.zIndex=S.toString(),this._div=n,this._renderer=e,this._onKeyDown=this._onKeyDown.bind(this),this._onMouseMove=this._onMouseMove.bind(this),globalThis.addEventListener("keydown",this._onKeyDown,!1)}get isActive(){return this._isActive}get isMobileAccessibility(){return this._isMobileAccessibility}get hookDiv(){return this._hookDiv}_createTouchHook(){const e=document.createElement("button");e.style.width=`${L}px`,e.style.height=`${L}px`,e.style.position="absolute",e.style.top=`${Z}px`,e.style.left=`${G}px`,e.style.zIndex=q.toString(),e.style.backgroundColor="#FF0000",e.title="select to enable accessibility for this content",e.addEventListener("focus",()=>{this._isMobileAccessibility=!0,this._activate(),this._destroyTouchHook()}),document.body.appendChild(e),this._hookDiv=e}_destroyTouchHook(){this._hookDiv&&(document.body.removeChild(this._hookDiv),this._hookDiv=null)}_activate(){var e;this._isActive||(this._isActive=!0,globalThis.document.addEventListener("mousemove",this._onMouseMove,!0),globalThis.removeEventListener("keydown",this._onKeyDown,!1),this._renderer.runners.postrender.add(this),(e=this._renderer.view.canvas.parentNode)==null||e.appendChild(this._div))}_deactivate(){var e;!this._isActive||this._isMobileAccessibility||(this._isActive=!1,globalThis.document.removeEventListener("mousemove",this._onMouseMove,!0),globalThis.addEventListener("keydown",this._onKeyDown,!1),this._renderer.runners.postrender.remove(this),(e=this._div.parentNode)==null||e.removeChild(this._div))}_updateAccessibleObjects(e){if(!e.visible||!e.accessibleChildren)return;e.accessible&&e.isInteractive()&&(e._accessibleActive||this._addChild(e),e._renderId=this._renderId);const t=e.children;if(t)for(let n=0;n<t.length;n++)this._updateAccessibleObjects(t[n])}init(e){this.debug=(e==null?void 0:e.debug)??this.debug,this._renderer.runners.postrender.remove(this)}postrender(){const e=performance.now();if(this._mobileInfo.android.device&&e<this._androidUpdateCount||(this._androidUpdateCount=e+this._androidUpdateFrequency,!this._renderer.renderingToScreen||!this._renderer.view.canvas))return;this._renderer.lastObjectRendered&&this._updateAccessibleObjects(this._renderer.lastObjectRendered);const{x:t,y:n,width:i,height:l}=this._renderer.view.canvas.getBoundingClientRect(),{width:c,height:h,resolution:u}=this._renderer,_=i/c*u,f=l/h*u;let o=this._div;o.style.left=`${t}px`,o.style.top=`${n}px`,o.style.width=`${c}px`,o.style.height=`${h}px`;for(let p=0;p<this._children.length;p++){const r=this._children[p];if(r._renderId!==this._renderId)r._accessibleActive=!1,V(this._children,p,1),this._div.removeChild(r._accessibleDiv),this._pool.push(r._accessibleDiv),r._accessibleDiv=null,p--;else{o=r._accessibleDiv;let a=r.hitArea;const v=r.worldTransform;r.hitArea?(o.style.left=`${(v.tx+a.x*v.a)*_}px`,o.style.top=`${(v.ty+a.y*v.d)*f}px`,o.style.width=`${a.width*v.a*_}px`,o.style.height=`${a.height*v.d*f}px`):(a=r.getBounds().rectangle,this._capHitArea(a),o.style.left=`${a.x*_}px`,o.style.top=`${a.y*f}px`,o.style.width=`${a.width*_}px`,o.style.height=`${a.height*f}px`,o.title!==r.accessibleTitle&&r.accessibleTitle!==null&&(o.title=r.accessibleTitle||""),o.getAttribute("aria-label")!==r.accessibleHint&&r.accessibleHint!==null&&o.setAttribute("aria-label",r.accessibleHint||"")),(r.accessibleTitle!==o.title||r.tabIndex!==o.tabIndex)&&(o.title=r.accessibleTitle||"",o.tabIndex=r.tabIndex,this.debug&&this._updateDebugHTML(o))}}this._renderId++}_updateDebugHTML(e){e.innerHTML=`type: ${e.type}</br> title : ${e.title}</br> tabIndex: ${e.tabIndex}`}_capHitArea(e){e.x<0&&(e.width+=e.x,e.x=0),e.y<0&&(e.height+=e.y,e.y=0);const{width:t,height:n}=this._renderer;e.x+e.width>t&&(e.width=t-e.x),e.y+e.height>n&&(e.height=n-e.y)}_addChild(e){let t=this._pool.pop();t||(t=document.createElement("button"),t.style.width=`${g}px`,t.style.height=`${g}px`,t.style.backgroundColor=this.debug?"rgba(255,255,255,0.5)":"transparent",t.style.position="absolute",t.style.zIndex=S.toString(),t.style.borderStyle="none",navigator.userAgent.toLowerCase().includes("chrome")?t.setAttribute("aria-live","off"):t.setAttribute("aria-live","polite"),navigator.userAgent.match(/rv:.*Gecko\//)?t.setAttribute("aria-relevant","additions"):t.setAttribute("aria-relevant","text"),t.addEventListener("click",this._onClick.bind(this)),t.addEventListener("focus",this._onFocus.bind(this)),t.addEventListener("focusout",this._onFocusOut.bind(this))),t.style.pointerEvents=e.accessiblePointerEvents,t.type=e.accessibleType,e.accessibleTitle&&e.accessibleTitle!==null?t.title=e.accessibleTitle:(!e.accessibleHint||e.accessibleHint===null)&&(t.title=`container ${e.tabIndex}`),e.accessibleHint&&e.accessibleHint!==null&&t.setAttribute("aria-label",e.accessibleHint),this.debug&&this._updateDebugHTML(t),e._accessibleActive=!0,e._accessibleDiv=t,t.container=e,this._children.push(e),this._div.appendChild(e._accessibleDiv),e._accessibleDiv.tabIndex=e.tabIndex}_dispatchEvent(e,t){const{container:n}=e.target,i=this._renderer.events.rootBoundary,l=Object.assign(new F(i),{target:n});i.rootTarget=this._renderer.lastObjectRendered,t.forEach(c=>i.dispatchEvent(l,c))}_onClick(e){this._dispatchEvent(e,["click","pointertap","tap"])}_onFocus(e){e.target.getAttribute("aria-live")||e.target.setAttribute("aria-live","assertive"),this._dispatchEvent(e,["mouseover"])}_onFocusOut(e){e.target.getAttribute("aria-live")||e.target.setAttribute("aria-live","polite"),this._dispatchEvent(e,["mouseout"])}_onKeyDown(e){e.keyCode===N&&this._activate()}_onMouseMove(e){e.movementX===0&&e.movementY===0||this._deactivate()}destroy(){this._destroyTouchHook(),this._div=null,globalThis.document.removeEventListener("mousemove",this._onMouseMove,!0),globalThis.removeEventListener("keydown",this._onKeyDown),this._pool=null,this._children=null,this._renderer=null}}j.extension={type:[w.WebGLSystem,w.WebGPUSystem],name:"accessibility"};const J={accessible:!1,accessibleTitle:null,accessibleHint:null,tabIndex:0,_accessibleActive:!1,_accessibleDiv:null,accessibleType:"button",accessiblePointerEvents:"auto",accessibleChildren:!0,_renderId:-1},Q={onclick:null,onmousedown:null,onmouseenter:null,onmouseleave:null,onmousemove:null,onglobalmousemove:null,onmouseout:null,onmouseover:null,onmouseup:null,onmouseupoutside:null,onpointercancel:null,onpointerdown:null,onpointerenter:null,onpointerleave:null,onpointermove:null,onglobalpointermove:null,onpointerout:null,onpointerover:null,onpointertap:null,onpointerup:null,onpointerupoutside:null,onrightclick:null,onrightdown:null,onrightup:null,onrightupoutside:null,ontap:null,ontouchcancel:null,ontouchend:null,ontouchendoutside:null,ontouchmove:null,onglobaltouchmove:null,ontouchstart:null,onwheel:null,get interactive(){return this.eventMode==="dynamic"||this.eventMode==="static"},set interactive(s){this.eventMode=s?"static":"passive"},_internalEventMode:void 0,get eventMode(){return this._internalEventMode??B.defaultEventMode},set eventMode(s){this._internalEventMode=s},isInteractive(){return this.eventMode==="static"||this.eventMode==="dynamic"},interactiveChildren:!0,hitArea:null,addEventListener(s,e,t){const n=typeof t=="boolean"&&t||typeof t=="object"&&t.capture,i=typeof t=="object"?t.signal:void 0,l=typeof t=="object"?t.once===!0:!1,c=typeof e=="function"?void 0:e;s=n?`${s}capture`:s;const h=typeof e=="function"?e:e.handleEvent,u=this;i&&i.addEventListener("abort",()=>{u.off(s,h,c)}),l?u.once(s,h,c):u.on(s,h,c)},removeEventListener(s,e,t){const n=typeof t=="boolean"&&t||typeof t=="object"&&t.capture,i=typeof e=="function"?void 0:e;s=n?`${s}capture`:s,e=typeof e=="function"?e:e.handleEvent,this.off(s,e,i)},dispatchEvent(s){if(!(s instanceof F))throw new Error("Container cannot propagate events outside of the Federated Events API");return s.defaultPrevented=!1,s.path=null,s.target=this,s.manager.dispatchEvent(s),!s.defaultPrevented}};K.add(j);U.mixin(J);K.add(B);U.mixin(Q);