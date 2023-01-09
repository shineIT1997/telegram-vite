"use strict";(self.webpackChunktelegram_t=self.webpackChunktelegram_t||[]).push([[7941],{67941:(t,e,i)=>{i.r(e),i.d(e,{default:()=>F});var s=i(77361),r=i(26926);function a(t,e,i){return(e=function(t){var e=function(t,e){if("object"!=typeof t||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var s=i.call(t,e);if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t,"string");return"symbol"==typeof e?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}class n{constructor(t){this.worker=t,a(this,"requestStates",new Map),a(this,"requestStatesByCallback",new Map),this.subscribe()}request(t){const{worker:e,requestStates:i,requestStatesByCallback:s}=this,a=(0,r.Z)(i),n={type:"callMethod",messageId:a,...t},o={messageId:a},h=new Promise(((t,e)=>{Object.assign(o,{resolve:t,reject:e})}));if("function"==typeof n.args[n.args.length-1]){n.withCallback=!0;const t=n.args.pop();o.callback=t,s.set(t,o)}return i.set(a,o),h.catch((()=>{})).finally((()=>{i.delete(a),o.callback&&s.delete(o.callback)})),e.postMessage(n),h}cancelCallback(t){t.isCanceled=!0;const{messageId:e}=this.requestStatesByCallback.get(t)||{};e&&this.worker.postMessage({type:"cancelProgress",messageId:e})}subscribe(){const{worker:t,requestStates:e}=this;t.addEventListener("message",(t=>{let{data:i}=t;if("methodResponse"===i.type){const t=e.get(i.messageId);t&&(i.error?t.reject(i.error):t.resolve(i.response))}else if("methodCallback"===i.type)e.get(i.messageId)?.callback?.(...i.callbackArgs);else if("unhandledError"===i.type)throw new Error(i.error?.message)}))}}var o=i(9933),h=i(3570),d=i(69118);function c(t,e,i){return(e=function(t){var e=function(t,e){if("object"!=typeof t||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var s=i.call(t,e);if("object"!=typeof s)return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t,"string");return"symbol"==typeof e?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}const m=Symbol("WAITING"),l=s.wB?.75:1,u=s.wZ?.5:.75,g=24,p=s.s$?2:4,f=new Map,v=new Array(4).fill(void 0).map((()=>new n(new Worker(new URL(i.p+i.u(2993),i.b)))));let y=-1;class x{static init(){for(var t=arguments.length,e=new Array(t),i=0;i<t;i++)e[i]=arguments[i];const[s,r,a,n,,o]=e;let h=f.get(n);return h?h.addContainer(s,r,a,o?.coords):(h=new x(...e),f.set(n,h)),h}constructor(t,e,i,s,r){let a=arguments.length>5&&void 0!==arguments[5]?arguments[5]:{},n=arguments.length>6?arguments[6]:void 0,o=arguments.length>7?arguments[7]:void 0,h=arguments.length>8?arguments[8]:void 0;this.id=s,this.tgsUrl=r,this.params=a,this.customColor=n,this.onEnded=o,this.onLoop=h,c(this,"containers",new Map),c(this,"imgSize",void 0),c(this,"imageData",void 0),c(this,"msPerFrame",1e3/60),c(this,"reduceFactor",1),c(this,"cacheModulo",void 0),c(this,"workerIndex",void 0),c(this,"frames",[]),c(this,"framesCount",void 0),c(this,"isAnimating",!1),c(this,"isWaiting",!0),c(this,"isEnded",!1),c(this,"isDestroyed",!1),c(this,"isRendererInited",!1),c(this,"approxFrameIndex",0),c(this,"prevFrameIndex",-1),c(this,"stopFrameIndex",0),c(this,"speed",1),c(this,"direction",1),c(this,"lastRenderAt",void 0),this.addContainer(t,e,i,a.coords),this.initConfig(),this.initRenderer()}removeContainer(t){const{canvas:e,ctx:i,isSharedCanvas:s,coords:r}=this.containers.get(t);s?i.clearRect(r.x,r.y,this.imgSize,this.imgSize):e.remove(),this.containers.delete(t),this.containers.size||this.destroy()}isPlaying(){return this.isAnimating||this.isWaiting}play(){let t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=arguments.length>1?arguments[1]:void 0;e&&(this.containers.get(e).isPaused=!1),this.isEnded&&t&&(this.approxFrameIndex=Math.floor(0)),this.stopFrameIndex=void 0,this.direction=1,this.doPlay()}pause(t){t&&(this.containers.get(t).isPaused=!0,!Array.from(this.containers.values()).every((t=>{let{isPaused:e}=t;return e})))||(this.isWaiting?this.stopFrameIndex=this.approxFrameIndex:this.isAnimating=!1,this.params.isLowPriority||(this.frames=this.frames.map(((t,e)=>e===this.prevFrameIndex?t:void(t&&t!==m&&t.close())))))}playSegment(t){let[e,i]=t;this.approxFrameIndex=Math.floor(e/this.reduceFactor),this.stopFrameIndex=Math.floor(i/this.reduceFactor),this.direction=e<i?1:-1,this.doPlay()}setSpeed(t){this.speed=t}setNoLoop(t){this.params.noLoop=t}setSharedCanvasCoords(t,e){const i=this.containers.get(t),{canvas:s,ctx:r}=i;if(!s.dataset.isJustCleaned||"false"===s.dataset.isJustCleaned){const t=this.calcSizeFactor();w(s,t),r.clearRect(0,0,s.width,s.height),s.dataset.isJustCleaned="true",(0,d.T2)((()=>{s.dataset.isJustCleaned="false"}))}i.coords={x:Math.round((e?.x||0)*s.width),y:Math.round((e?.y||0)*s.height)};const a=this.getFrame(this.prevFrameIndex)||this.getFrame(Math.round(this.approxFrameIndex));a&&a!==m&&r.drawImage(a,i.coords.x,i.coords.y)}addContainer(t,e,i,s){const r=this.calcSizeFactor();let a;if(e instanceof HTMLDivElement){if(!(e.parentNode instanceof HTMLElement))throw new Error("[RLottie] Container is not mounted");let{size:s}=this.params;if(!s&&(s=e.offsetWidth||parseInt(e.style.width,10)||e.parentNode.offsetWidth,!s))throw new Error("[RLottie] Failed to detect width from container");const n=document.createElement("canvas"),o=n.getContext("2d");n.style.width=`${s}px`,n.style.height=`${s}px`,a=Math.round(s*r),n.width=a,n.height=a,e.appendChild(n),this.containers.set(t,{canvas:n,ctx:o,onLoad:i})}else{if(!e.offsetParent)throw new Error("[RLottie] Shared canvas is not mounted");const n=e,o=n.getContext("2d");w(n,r),a=Math.round(this.params.size*r),this.containers.set(t,{canvas:n,ctx:o,isSharedCanvas:!0,coords:{x:Math.round((s?.x||0)*n.width),y:Math.round((s?.y||0)*n.height)},onLoad:i})}this.imgSize||(this.imgSize=a,this.imageData=new ImageData(a,a)),this.isRendererInited&&this.doPlay()}calcSizeFactor(){const{isLowPriority:t,size:e,quality:i=(t&&(!e||e>g)?u:l)}=this.params;return Math.max(s.cL*i,1)}destroy(){this.isDestroyed=!0,this.pause(),this.clearCache(),this.destroyRenderer(),f.delete(this.id)}clearCache(){this.frames.forEach((t=>{t&&t!==m&&t.close()})),this.imageData=void 0,this.frames=[]}initConfig(){const{isLowPriority:t}=this.params;this.cacheModulo=t?0:p}setColor(t){this.customColor=t}initRenderer(){this.workerIndex=(0,h.Z)(4,++y),v[this.workerIndex].request({name:"init",args:[this.id,this.tgsUrl,this.imgSize,this.params.isLowPriority,this.customColor,this.onRendererInit.bind(this)]})}destroyRenderer(){v[this.workerIndex].request({name:"destroy",args:[this.id]})}onRendererInit(t,e,i){this.isRendererInited=!0,this.reduceFactor=t,this.msPerFrame=e,this.framesCount=i,this.isWaiting&&this.doPlay()}changeData(t){this.pause(),this.tgsUrl=t,this.initConfig(),v[this.workerIndex].request({name:"changeData",args:[this.id,this.tgsUrl,this.params.isLowPriority,this.onChangeData.bind(this)]})}onChangeData(t,e,i){this.reduceFactor=t,this.msPerFrame=e,this.framesCount=i,this.isWaiting=!1,this.isAnimating=!1,this.doPlay()}doPlay(){this.framesCount&&(this.isDestroyed||this.isAnimating||(this.isWaiting||(this.lastRenderAt=void 0),this.isEnded=!1,this.isAnimating=!0,this.isWaiting=!1,(0,o.jt)((()=>{if(this.isDestroyed)return!1;if(!this.isAnimating&&Array.from(this.containers.values()).every((t=>{let{isLoaded:e}=t;return e})))return!1;const t=Math.round(this.approxFrameIndex),e=this.getFrame(t);if(!e||e===m)return e||this.requestFrame(t),this.isAnimating=!1,this.isWaiting=!0,!1;this.cacheModulo&&t%this.cacheModulo==0&&this.cleanupPrevFrame(t),t!==this.prevFrameIndex&&(this.containers.forEach((t=>{const{ctx:i,isLoaded:s,isPaused:r,coords:{x:a,y:n}={},onLoad:o}=t;s&&r||(i.clearRect(a||0,n||0,this.imgSize,this.imgSize),i.drawImage(e,a||0,n||0)),s||(t.isLoaded=!0,o?.())})),this.prevFrameIndex=t);const i=Date.now(),s=this.lastRenderAt?this.msPerFrame/(i-this.lastRenderAt):1,r=Math.min(1,this.direction*this.speed/s),a=Math.round(this.approxFrameIndex+r);if(this.lastRenderAt=i,r>0&&(t===this.framesCount-1||a>this.framesCount-1)){if(this.params.noLoop)return this.isAnimating=!1,this.isEnded=!0,this.onEnded?.(),!1;this.onLoop?.(),this.approxFrameIndex=0}else if(r<0&&(0===t||a<0)){if(this.params.noLoop)return this.isAnimating=!1,this.isEnded=!0,this.onEnded?.(),!1;this.onLoop?.(),this.approxFrameIndex=this.framesCount-1}else{if(void 0!==this.stopFrameIndex&&(t===this.stopFrameIndex||r>0&&a>this.stopFrameIndex||r<0&&a<this.stopFrameIndex))return this.stopFrameIndex=void 0,this.isAnimating=!1,!1;this.approxFrameIndex+=r}const n=Math.round(this.approxFrameIndex);return!!this.getFrame(n)||(this.requestFrame(n),this.isWaiting=!0,this.isAnimating=!1,!1)}))))}getFrame(t){return this.frames[t]}requestFrame(t){this.frames[t]=m,v[this.workerIndex].request({name:"renderFrames",args:[this.id,t,this.onFrameLoad.bind(this)]})}cleanupPrevFrame(t){if(this.framesCount<3)return;const e=(0,h.Z)(this.framesCount,t-1);this.frames[e]=void 0}onFrameLoad(t,e){this.frames[t]===m&&(this.frames[t]=e,this.isWaiting&&this.doPlay())}}function w(t,e){const i=Math.round(t.offsetWidth*e),s=Math.round(t.offsetHeight*e);t.width===i&&t.height===s||(t.width=i,t.height=s)}const F=x},3570:(t,e,i)=>{function s(t,e){return e-Math.floor(e/t)*t}i.d(e,{Z:()=>s})}}]);
//# sourceMappingURL=7941.55b0f148b16a6efd2e8a.js.map