"use strict";function walContext(){this.ctx=new window.AudioContext,this.destination=this.ctx.destination,this.filters=this.createFilters(),this.buffers=[],this.compositions=[],this.nbPlaying=0,this.filters.connect(this.destination),this.nodeIn=this.filters.nodeIn,delete this.filters.connect}!function(){var e=window.wisdom={};e.cE=e.createElement=function(e){if("<"!==e[0])return document.createElement(e);var i=document.createElement("div");return i.innerHTML=e,i.children}}(),window.AudioContext=window.AudioContext||window.webkitAudioContext,walContext.prototype={gain:function(e){return arguments.length?(this.filter.gain(e),this):this.filter.gain()},createBuffer:function(e){var i=this;return new Promise(function(t,n){new walContext.Buffer(i,e,t,n)}).then(function(e){return i.buffers.push(e),e})},createFilters:function(){return new walContext.Filters(this)},createComposition:function(){var e=new walContext.Composition(this);return this.compositions.push(e),e}},function(){function e(e){var i,t=null,n=0;e.wSamples.forEach(function(e){i=e.getEndTime(),i>n&&(n=i,t=e)}),e.lastSample=t,e.duration=t?t.getEndTime():0}function i(i){clearTimeout(i.playTimeoutId),e(i);var t=i.duration&&i.duration-i.currentTime();0>=t?i.onended():i.playTimeoutId=setTimeout(i.onended.bind(i),1e3*t)}function t(e,i){var t=e.when-i;e.start(t,t>0?e.offset:e.offset-t,t>0?e.duration:e.duration+t)}function n(e,n,s,o){var a=e.currentTime();n.getEndTime()>a&&"rm"!==s&&(n.load(),t(n,a)),e.lastSample===o&&"mv"!==s||i(e)}function s(e){clearTimeout(e.playTimeoutId),e.wSamples.forEach(function(e){e.stop()})}function o(e){var i=e.currentTime();e.wSamples.forEach(function(e){e.getEndTime()>i&&e.load()})}function a(e){var n=e.currentTime();e.wSamples.forEach(function(e){e.getEndTime()>n&&t(e,n)}),i(e)}walContext.Composition=function(e){this.wCtx=e,this.wSamples=[],this.lastSample=null,this.isPlaying=this.isPaused=!1,this.duration=this.startedTime=this._currentTime=0,this.fnOnended=this.fnOnpaused=function(){}},walContext.Composition.prototype={addSamples:function(e){var i=this;return e.forEach(function(e){i.wSamples.indexOf(e)<0&&(i.wSamples.push(e),e.composition=this,i.update(e))}),this},removeSamples:function(e){var i,t=this;return e.forEach(function(e){i=t.wSamples.indexOf(e),i>-1&&(t.wSamples.splice(i,1),e.composition=null,t.update(e,"rm"))}),this},update:function(i,t){var s,o=this,a=this.lastSample;return e(this),this.isPlaying&&(i.started?(s=i.fnOnended,i.onended(function(){n(o,i,t,a),s(),i.onended(s)}),i.stop()):n(this,i,t,a)),this},currentTime:function(e){return arguments.length?(this.isPlaying&&s(this),this._currentTime=Math.max(0,Math.min(e,this.duration)),this.isPlaying&&(this.startedTime=this.wCtx.ctx.currentTime,o(this),a(this)),this):this._currentTime+(this.isPlaying&&wa.wctx.ctx.currentTime-this.startedTime)},play:function(){return this.isPlaying||(this.isPlaying=!0,this.isPaused=!1,this.startedTime=wa.wctx.ctx.currentTime,o(this),a(this)),this},stop:function(){return(this.isPlaying||this.isPaused)&&(s(this),this.onended()),this},pause:function(){this.isPlaying&&(this.isPlaying=!1,this.isPaused=!0,this._currentTime+=wa.wctx.ctx.currentTime-this.startedTime,this.startedTime=0,s(this),this.fnOnpaused())},onended:function(e){return"function"==typeof e?this.fnOnended=e:(this.isPlaying=this.isPaused=!1,this.startedTime=this._currentTime=0,this.fnOnended()),this}}}(),function(){walContext.Buffer=function(e,i,t,n){function s(e){o.wCtx.ctx.decodeAudioData(e,function(e){o.buffer=e,o.isReady=!0,t(o)},n)}var o=this,a=new FileReader;this.wCtx=e,this.isReady=!1,i.name?(a.addEventListener("loadend",function(){s(a.result)}),a.readAsArrayBuffer(i)):s(i)},walContext.Buffer.prototype={createSample:function(){var e=new walContext.Sample(this.wCtx,this);return e},getPeaks:function(e,i,t,n){t=t||0,n=n||this.buffer.duration;for(var s,o,a,u=0,l=new Array(i),r=this.buffer.getChannelData(e),c=(n-t)*this.buffer.sampleRate,d=t*this.buffer.sampleRate,m=c/i,f=m/10;i>u;++u){for(s=d+u*m,o=s+m,a=0;o>s;s+=f)a=Math.max(a,Math.abs(r[~~s]));l[u]=a}return l}}}(),function(){function e(e,i,t){e[i]=t[0],e[i+1]=t[1],e[i+2]=t[2],e[i+3]=t[3]}function i(i,t,n,s){var o,a,u,l,r=t.data,c=t.width,d=t.height,m=d/2,f=i.getPeaks(0,c),p=i.buffer.numberOfChannels>1?i.getPeaks(1,c):f;if(s){for(o=0;o<r.length;o+=4)e(r,o,n);n=[0,0,0,0]}for(o=0;c>o;++o){for(u=~~(m*(1-f[o])),l=~~(m*(1+p[o])),a=u;l>=a;++a)e(r,4*(a*c+o),n);e(r,4*(m*c+o),n)}return t}walContext.Buffer.prototype.waveformSVG=function(e,i,t){var n,s=t/2-.5,o=t/2+.5,a="M0 "+s,u=e?e.firstChild:document.createElement("path"),l=this.getPeaks(0,i),r=this.buffer.numberOfChannels>1?this.getPeaks(1,i):l;for(e||(e=document.createElement("svg"),e.appendChild(u)),n=0;i>n;++n)a+=" L"+n+" "+(s-l[n]*s);for(n=i-1;n>=0;--n)a+=" L"+n+" "+(o+r[n]*s);return u.setAttribute("d",a),e.setAttribute("viewBox","0 0 "+i+" "+t),e},walContext.Buffer.prototype.drawWaveform=function(e,t){return i(this,e,t)},walContext.Buffer.prototype.drawInvertedWaveform=function(e,t){return i(this,e,t,!0)}}(),walContext.Filters=function(e){this.wCtx=e,this.nodes=[],this.nodeIn=e.ctx.createGain(),this.nodeOut=e.ctx.createGain(),this.nodeIn.connect(this.nodeOut),this.connect(e)},walContext.Filters.prototype={connect:function(e){e=e.nodeIn||e,e instanceof AudioNode&&(this.connectedTo=e,this.nodeOut.connect(e))},disconnect:function(){this.nodeOut.disconnect(),this.connectedTo=null},empty:function(){this.nodes.length&&(this.nodes[this.nodes.length-1].disconnect(),this.nodeIn.disconnect(),this.nodeIn.connect(this.nodeOut),this.nodes=[])},gain:function(e){return arguments.length?void(this.nodeOut.gain.value=e):this.nodeOut.gain.value},pushBack:function(e){if(this.nodes.length){var i=this.nodes[this.nodes.length-1];i.disconnect(),i.connect(e)}else this.nodeIn.disconnect(),this.nodeIn.connect(e);e.connect(this.nodeOut),this.nodes.push(e)},pushFront:function(e){this.nodes.length?(this.nodeIn.disconnect(),this.nodeIn.connect(e),e.connect(this.nodes[0]),this.nodes.unshift(e)):this.pushBack(e)},popBack:function(){var e=this.nodes.pop();if(e)if(e.disconnect(),this.nodes.length){var i=this.nodes[this.nodes.length-1];i.disconnect(),i.connect(this.nodeOut)}else this.nodeIn.disconnect(),this.nodeIn.connect(this.nodeOut);return e},popFront:function(){var e=this.nodes.shift();return e&&(e.disconnect(),this.nodeIn.disconnect(),this.nodeIn.connect(this.nodes[0]||this.nodeOut)),e}},walContext.Sample=function(e,i,t){this.wCtx=e,this.wBuffer=i,this.connectedTo=t?t.nodeIn:e.nodeIn,this.when=this.offset=0,this.duration=this.bufferDuration=i.buffer.duration,this.fnOnended=function(){},this.loaded=this.started=this.playing=!1},walContext.Sample.prototype={connect:function(e){return e=e.nodeIn||e,e instanceof AudioNode&&(this.connectedTo=e,this.source&&this.source.connect(e)),this},disconnect:function(){return this.source&&(this.source.disconnect(),this.connectedTo=null),this},load:function(){return this.loaded||(this.loaded=!0,this.source=this.wCtx.ctx.createBufferSource(),this.source.buffer=this.wBuffer.buffer,this.source.onended=this.onended.bind(this),this.connectedTo&&this.source.connect(this.connectedTo)),this},start:function(e,i,t){function n(){++s.wCtx.nbPlaying,s.playing=!0}if(this.loaded)if(this.started)console.warn("WebAudio Library: can not start a sample twice.");else{var s=this;this.started=!0,e=void 0!==e?e:this.when,this.source.start(this.wCtx.ctx.currentTime+e,void 0!==i?i:this.offset,void 0!==t?t:this.duration),e?this.playTimeoutId=setTimeout(n,1e3*e):n()}else console.warn("WebAudio Library: can not start an unloaded sample.");return this},stop:function(){return this.started&&(this.source.onended=null,this.source.stop(0),this.onended()),this},getEndTime:function(){return this.when+this.duration},onended:function(e){return"function"==typeof e?this.fnOnended=e:this.loaded&&(this.playing&&(this.playing=!1,--this.wCtx.nbPlaying),this.started&&(this.started=!1,clearTimeout(this.playTimeoutId)),this.loaded=!1,this.source=null,this.fnOnended()),this}},function(){function e(i){for(var t,n=i.firstChild;null!==n;)e(t=n),n=n.nextSibling,1!==t.nodeType&&/^\s*$/.test(t.textContent)&&i.removeChild(t)}function i(e,i){return i?e.querySelector(i):document.querySelector(e)}window.ui={},ui.elApp=i("#app");var t,n=Handlebars.templates;for(t in n)"_app"!==t&&Handlebars.registerPartial(t,n[t]);ui.elApp.innerHTML=Handlebars.templates._app({}),e(document.body),ui.tool={},ui.tracks=[],ui.nbTracksOn=0,ui.elAbout=i("#about"),ui.elVisual=i("#visual"),ui.elVisualCanvas=i(ui.elVisual,"canvas"),ui.elClockUnits=i(ui.elVisual,".clock .units"),ui.elClockMin=i(ui.elVisual,".clock > .min"),ui.elClockSec=i(ui.elVisual,".clock > .sec"),ui.elClockMs=i(ui.elVisual,".clock > .ms"),ui.elMenu=i("#menu"),ui.elPlay=i(ui.elMenu,".btn.play"),ui.elStop=i(ui.elMenu,".btn.stop"),ui.elBpmA=i(ui.elMenu,".bpm .a-bpm"),ui.elBpmInt=i(ui.elMenu,".bpm .int"),ui.elBpmDec=i(ui.elMenu,".bpm .dec"),ui.elBpmList=i(ui.elMenu,".bpm-list"),ui.elTools=i(ui.elMenu,".tools"),ui.elBtnMagnet=i(ui.elTools,".magnet"),ui.elBtnSave=i(ui.elTools,".save"),ui.elFiles=i("#files"),ui.elInputFile=i(ui.elFiles,"input[type='file']"),ui.elFileFilters=i(ui.elFiles,".filters"),ui.elFilelist=i(ui.elFiles,".filelist"),ui.elGrid=i("#grid"),ui.elGridEm=i(ui.elGrid,".emWrapper"),ui.elGridHeader=i(ui.elGrid,".header"),ui.elTimeline=i(ui.elGrid,".timeline"),ui.elTimeArrow=i(ui.elGrid,".timeArrow"),ui.elTimeCursor=i(ui.elGrid,".timeCursor"),ui.elTrackList=i(ui.elGrid,".trackList"),ui.elGridCols=i(ui.elGrid,".cols"),ui.elGridColB=i(ui.elGrid,".colB"),ui.elTrackNames=i(ui.elGrid,".trackNames"),ui.elTrackLines=i(ui.elGrid,".trackLines"),ui.elTrackLinesBg=i(ui.elGrid,".trackLinesBg"),ui.gridEm=parseFloat(getComputedStyle(ui.elGrid).fontSize),ui.gridColsY=ui.elGridCols.getBoundingClientRect().top,ui.elVisualCanvas.width=256,ui.elVisualCanvas.height=ui.elVisualCanvas.clientHeight}(),function(){function e(){var o=t;wa.wctx.nbPlaying&&(o=wa.analyserArray,wa.analyser.getByteTimeDomainData(o)),wa.oscilloscope(n,s,o),i=requestAnimationFrame(e)}var i,t=[],n=ui.elVisualCanvas,s=n.getContext("2d");ui.analyserEnabled=!1,ui.analyserToggle=function(t){"boolean"!=typeof t&&(t=!ui.analyserEnabled),ui.analyserEnabled=t,t?i=requestAnimationFrame(e):(s.clearRect(0,0,n.width,n.height),cancelAnimationFrame(i))}}(),ui.BPMem=1,ui.bpm=function(e){var i=~~e,t=Math.min(Math.round(100*(e-i)),99);ui.BPMem=e/60,ui.elBpmInt.textContent=100>i?"0"+i:i,ui.elBpmDec.textContent=10>t?"0"+t:t},ui.css=function(e,i,t){if(e){var n=getComputedStyle(e);if(2===arguments.length)return n[i];e.style[i]=t}},ui.setClockUnit=function(e){ui.elClockUnits.dataset.unit=e,ui.currentTime(gs.currentTime())},function(){function e(e){if(e>0){var i=e*ui.BPMem+"em";ui.css(ui.elTimeCursor,"left",i),ui.css(ui.elTimeArrow,"left",i)}ui.elTimeCursor.classList.toggle("visible",e>0),ui.elTimeArrow.classList.toggle("visible",e>0)}function i(e){var i,t,n;"s"===gs.clockUnit?(i=~~(e/60),t=~~(e%60)):(e*=ui.BPMem,i=1+~~e,e*=4,t=1+~~e%4),t=10>t?"0"+t:t,n=Math.floor(1e3*(e-~~e)),10>n?n="00"+n:100>n&&(n="0"+n),ui.elClockMin.textContent=i,ui.elClockSec.textContent=t,ui.elClockMs.textContent=n}ui.currentTime=function(t){e(t),i(t)}}(),function(){function e(e,i){i?e.dataset.cursor=i:e.removeAttribute("data-cursor")}var i=null;ui.cursor=function(t,n){"app"===t?(e(ui.elApp,n),e(ui.elTrackLines,n?null:i)):e(ui.elTrackLines,i=n)}}(),function(){function e(e,i){return Math.abs(e-i)<1e-4}function i(e){var i=e%t;return e-=i,i>n&&(e+=t),e}var t=.25,n=t/2;ui.xemFloor=function(n){var s=i(n);return n>s||e(s,n)?s:s-t},ui.xemCeil=function(n){var s=i(n);return s>n||e(s,n)?s:s+t},ui.getGridXem=function(e){var t=(e-ui.filesWidth-ui.trackNamesWidth-ui.trackLinesLeft)/ui.gridEm;return ui.isMagnetized?i(t):t}}(),ui.getTrackFromPageY=function(e){return ui.tracks[Math.floor((e-ui.gridColsY+ui.gridScrollTop)/ui.gridEm)]},ui.CSS_fileUnloaded=function(e){e.elIcon.classList.add("fa-download"),e.elIcon.classList.remove("fa-question"),e.elFile.classList.add("unloaded")},ui.CSS_fileWithoutData=function(e){e.elIcon.classList.add("fa-question"),e.elIcon.classList.remove("fa-download"),e.elFile.classList.add("unloaded")},ui.CSS_fileLoading=function(e){e.elIcon.classList.add("fa-refresh"),e.elIcon.classList.add("fa-spin"),e.elIcon.classList.remove("fa-download")},ui.CSS_fileLoaded=function(e){e.elFile.classList.add("loaded"),e.elFile.classList.remove("unloaded"),e.elIcon.remove()},ui.CSS_fileError=function(e){e.elIcon.classList.add("fa-times"),e.elIcon.classList.remove("fa-refresh"),e.elIcon.classList.remove("fa-spin")},ui.CSS_fileUsed=function(e){e.elFile.classList.add("used")},ui.CSS_fileUnused=function(e){e.elFile.classList.remove("used")},ui.newTrack=function(){ui.tracks.push(new ui.Track(this))},function(){function e(){ui.currentTime(wa.composition.currentTime()),i=requestAnimationFrame(e)}var i;ui.play=function(){ui.elPlay.classList.remove("fa-play"),ui.elPlay.classList.add("fa-pause"),e()},ui.pause=function(){cancelAnimationFrame(i),ui.elPlay.classList.remove("fa-pause"),ui.elPlay.classList.add("fa-play")},ui.stop=function(){ui.pause(),ui.currentTime(0)}}(),ui.resize=function(){ui.screenWidth=document.body.clientWidth,ui.screenHeight=document.body.clientHeight,ui.gridColsWidth=ui.elGridCols.getBoundingClientRect().width,ui.gridColsHeight=ui.elTrackList.clientHeight,ui.trackLinesWidth=ui.gridColsWidth-ui.trackNamesWidth,ui.updateTimeline(),ui.updateTrackLinesBg()},ui.CSS_sampleTrack=function(e){e.track.elColLinesTrack.appendChild(e.elSample)},ui.CSS_sampleWhen=function(e){ui.css(e.elSample,"left",e.wsample.when*ui.BPMem+"em")},ui.CSS_sampleSelect=function(e){e.elSample.classList.toggle("selected",e.selected)},ui.CSS_sampleDelete=function(e){e.elSample.remove()},ui.CSS_sampleOffset=function(e){ui.css(e.elSVG,"marginLeft",-e.wsample.offset*ui.BPMem+"em")},ui.CSS_sampleDuration=function(e){ui.css(e.elSample,"width",e.wsample.duration*ui.BPMem+"em"),ui.css(e.elSVG,"width",e.wsample.bufferDuration*ui.BPMem+"em")},ui.CSS_sampleWaveform=function(e){e.wsample.wBuffer.waveformSVG(e.elSVG,~~(200*e.wsample.bufferDuration),50)},ui.selectTool=function(){var e;return function(i){var t,n=ui.elTools.tool[i];n!==e&&(e&&(e.classList.remove("active"),t=ui.tool[ui.currentTool],t.mouseup&&t.mouseup({}),t.end&&t.end()),e=n,n.classList.add("active"),ui.elGrid.dataset.tool=ui.currentTool=i,t=ui.tool[i],t.start&&t.start())}}(),ui.setFilesWidth=function(e){ui.css(ui.elFiles,"width",e+"px"),ui.filesWidth=e=ui.elFiles.clientWidth,ui.gridColsWidth=ui.screenWidth-e,ui.trackLinesWidth=ui.gridColsWidth-ui.trackNamesWidth,ui.css(ui.elGrid,"left",e+"px"),ui.css(ui.elVisual,"width",e+ui.trackNamesWidth+"px"),ui.css(ui.elMenu,"left",e+ui.trackNamesWidth+"px"),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.gridScrollTop=0,ui.setGridScrollTop=function(e){ui.elGridCols.scrollTop=ui.gridScrollTop=0>=e?0:Math.min(e,ui.tracks.length*ui.gridEm-ui.gridColsHeight),ui.updateGridTopShadow()},ui.gridZoom=1,ui.setGridZoom=function(e,i,t){e=Math.min(Math.max(1,e),8);var n=e/ui.gridZoom;ui.gridZoom=e,ui.gridEm*=n,ui.css(ui.elGridEm,"fontSize",e+"em"),ui.elGrid.dataset.sampleSize=ui.gridEm<40?"small":ui.gridEm<80?"medium":"big",ui.setGridScrollTop(-(t-(ui.gridScrollTop+t)*n)),ui.setTrackLinesLeft(i-(-ui.trackLinesLeft+i)*n),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.setTrackLinesLeft=function(e){ui.trackLinesLeft=e=Math.min(~~e,0),ui.css(ui.elTrackLines,"marginLeft",e/ui.gridEm+"em"),ui.updateGridLeftShadow()},ui.trackNamesWidth=0,ui.setTrackNamesWidth=function(e){var i,t=ui.trackNamesWidth;ui.css(ui.elTrackNames,"width",e+"px"),ui.trackNamesWidth=e=ui.elTrackNames.getBoundingClientRect().width,ui.trackLinesWidth=ui.gridColsWidth-e,i=ui.filesWidth+e,ui.css(ui.elGridColB,"left",e+"px"),ui.css(ui.elTimeline,"left",e+"px"),ui.css(ui.elVisual,"width",i+"px"),ui.css(ui.elMenu,"left",i+"px"),ui.trackLinesLeft<0&&ui.setTrackLinesLeft(ui.trackLinesLeft-(e-t)),ui.updateTimeline(),ui.updateTrackLinesBg()},ui.toggleAbout=function(e){ui.elAbout.classList.toggle("show",e)},ui.isMagnetized=!1,ui.toggleMagnetism=function(e){"boolean"!=typeof e&&(e=!ui.isMagnetized),ui.isMagnetized=e,ui.elBtnMagnet.classList.toggle("active",e)},ui.toggleTracks=function(e){for(var i,t=0,n=e.isOn&&1===ui.nbTracksOn;i=ui.tracks[t++];)i.toggle(n);e.toggle(!0)},function(){var e=2,i="rgba(0,0,0,.3)",t="px "+e+"px "+i;ui.updateGridLeftShadow=function(){var e=-ui.trackLinesLeft;ui.css(ui.elTrackNames,"boxShadow",e?Math.min(2+e/8,5)+"px 0"+t:"none")},ui.updateGridTopShadow=function(){var e=ui.gridScrollTop;ui.css(ui.elGridHeader,"boxShadow",e?"0px "+Math.min(2+e/8,5)+t:"none")}}(),function(){function e(e){if(e>t){var n,s=t;for(t=e;s++<e;)n=document.createElement("div"),n.appendChild(document.createElement("span")),ui.elTimeline.appendChild(n),i=i||n}}var i,t=0;ui.updateTimeline=function(){var t=ui.trackLinesLeft/ui.gridEm,n=ui.trackLinesWidth/ui.gridEm;e(Math.ceil(-t+n)),ui.css(i,"marginLeft",t+"em"),ui.css(ui.elTimeArrow,"marginLeft",t+"em")}}(),function(){function e(e){var n,s,o,a,u,l=e-t;for(t=Math.max(e,t),n=0;l>n;++n){for(a=document.createElement("div"),s=0;4>s;++s){for(u=document.createElement("div"),o=0;4>o;++o)u.appendChild(document.createElement("div"));a.appendChild(u)}ui.elTrackLinesBg.appendChild(a)}i=i||ui.elTrackLinesBg.firstChild}var i,t=0;ui.updateTrackLinesBg=function(){e(Math.ceil(ui.trackLinesWidth/ui.gridEm/4)+2),ui.css(i,"marginLeft",ui.trackLinesLeft/ui.gridEm%8+"em")}}(),ui.Track=function(e,i){i=i||{},this.grid=e,this.id=ui.tracks.length,this.elColNamesTrack=wisdom.cE("<div class='track'>")[0],this.elColLinesTrack=wisdom.cE("<div class='track'>")[0],ui.elTrackNames.appendChild(this.elColNamesTrack),ui.elTrackLines.appendChild(this.elColLinesTrack),this.elColNamesTrack.uitrack,this.elColLinesTrack.uitrack=this,this.wfilters=wa.wctx.createFilters(),this.samples=[],this.initToggle().initEditName().toggle(i.toggle!==!1).editName(i.name||"")},ui.Track.prototype={removeSample:function(e){var i=this.samples.indexOf(e);i>=0&&this.samples.splice(i,1)}},ui.Track.prototype.initEditName=function(){var e=this;return this.elName=wisdom.cE("<span class='name text-overflow'>")[0],this.elName.ondblclick=this.editName.bind(this,!0),this.elColNamesTrack.appendChild(this.elName),this.elNameInput=wisdom.cE("<input type='text'/>")[0],this.elColNamesTrack.appendChild(this.elNameInput),this.elNameInput.onblur=function(){e.editName(this.value).editName(!1)},this.elNameInput.onkeydown=function(i){13!==i.keyCode&&27!==i.keyCode||e.editName(13===i.keyCode?this.value:e.name).editName(!1),i.stopPropagation()},this},ui.Track.prototype.editName=function(e){var i=this.elNameInput,t="Track "+(this.id+1);return"string"==typeof e?(e=e.replace(/^\s+|\s+$/,"").replace(/\s+/g," "),e=e===t?"":e,this.elName.classList.toggle("empty",""===e),this.elName.textContent=e||t,this.name=e):e?(this.elColNamesTrack.classList.add("editing"),i.value=this.name||t,i.focus(),i.select()):(i.blur(),this.elColNamesTrack.classList.remove("editing")),this},ui.Track.prototype.initToggle=function(){var e=this;return this.elToggle=wisdom.cE("<a class='toggle'>")[0],this.elColNamesTrack.appendChild(this.elToggle),this.elToggle.oncontextmenu=function(){return!1},this.elToggle.onmousedown=function(i){0===i.button?e.toggle():2===i.button&&ui.toggleTracks(e)},this},ui.Track.prototype.toggle=function(e){return"boolean"!=typeof e&&(e=!this.isOn),this.isOn!==e&&(this.wfilters.gain(+e),this.isOn=e,this.grid.nbTracksOn+=e?1:-1,this.elToggle.classList.toggle("on",e),this.elColNamesTrack.classList.toggle("off",!e),this.elColLinesTrack.classList.toggle("off",!e)),this},function(){var e=new walContext,i=e.ctx.createAnalyser();i.fftSize=256,e.filters.pushBack(i),window.wa={wctx:e,ctx:e.ctx,analyser:i,analyserArray:new Uint8Array(i.frequencyBinCount),composition:e.createComposition()}}(),wa.oscilloscope=function(){var e=0,i=Math.PI/2;return function(t,n,s){var o,a=0,u=t.width,l=t.height,r=s.length,c=r/2,d=u/(r-1);for(n.globalCompositeOperation="source-in",n.fillStyle="rgba("+Math.round(255-255*e)+","+Math.round(64*e)+","+Math.round(255*e)+","+(.95-.25*(1-Math.cos(e*i)))+")",n.fillRect(0,0,u,l),e=0,n.globalCompositeOperation="source-over",n.save(),n.translate(0,l/2),n.beginPath(),n.moveTo(0,0);r>a;++a)o=(s[a]-128)/128,e=Math.max(Math.abs(o),e),o*=.5-Math.cos((c>a?a:r-a)/c*Math.PI)/2,n.lineTo(a*d,o*l);n.lineJoin="round",n.lineWidth=1+Math.round(2*e),n.strokeStyle="rgba(255,255,255,"+Math.min(.3+4*e,1)+")",n.stroke(),n.restore()}}(),window.gs={files:[],samples:[],selectedSamples:[]},gs.bpm=function(e){if(!arguments.length)return gs._bpm;var i=gs.currentTime()*ui.BPMem;gs._bpm=Math.max(20,Math.min(e,999)),ui.bpm(gs._bpm),gs.samples.forEach(function(e){e.wsample?(e.wsample.when=e.xem/ui.BPMem,ui.CSS_sampleDuration(e),ui.CSS_sampleOffset(e)):(e.savedWhen=e.xem/ui.BPMem,ui.css(e.elSample,"width",e.savedDuration*ui.BPMem+"em"))}),gs.currentTime(i/ui.BPMem)},gs.currentTime=function(e){return arguments.length?(wa.composition.currentTime(e),void ui.currentTime(wa.composition.currentTime())):wa.composition.currentTime()},gs.playToggle=function(e){"boolean"!=typeof e&&(e=!wa.composition.isPlaying),e?gs.play():gs.pause()},gs.play=function(){!wa.composition.isPlaying&&wa.composition.wSamples.length&&gs.samples.length&&(wa.composition.play(),wa.composition.isPlaying&&(gs.isPaused=!(gs.isPlaying=!0),ui.play()))},gs.pause=function(){wa.composition.isPlaying&&(wa.composition.pause(),gs.isPaused=!(gs.isPlaying=!1),ui.pause())},gs.stop=function(){wa.composition.stop(),gs.currentTime(0),gs.isPaused=gs.isPlaying=!1,ui.stop()},function(){function e(e,i){var t=JSON.parse(i.target.result);gs.bpm(t.bpm),t.files.forEach(function(e){var i=gs.fileCreate(e);i.samplesToSet=[]}),t.tracks.forEach(function(e){for(var i=e[0];i>=ui.tracks.length;)ui.newTrack();ui.tracks[i].toggle(e[1]).editName(e[2])}),t.samples.forEach(function(e){var i=gs.sampleCreate(gs.files[e[2]]);i.gsfile.samplesToSet.push(i),i.xem=e[0],i.savedWhen=e[3],i.savedOffset=e[4],i.savedDuration=e[5],i.track=ui.tracks[e[1]],i.track.samples.push(i),ui.CSS_sampleTrack(i),ui.css(i.elSample,"left",e[3]*ui.BPMem+"em"),ui.css(i.elSample,"width",e[5]*ui.BPMem+"em")}),e()}gs.load=function(i){return new Promise(function(t,n){if(i){var s=new FileReader;s.onload=e.bind(null,t),s.readAsText(i)}else t()})}}(),gs.save=function(){var e={bpm:this._bpm,files:[],samples:[],tracks:[]};return gs.files.forEach(function(i){e.files.push([i.id,i.fullname,i.file?i.file.size:i.size])}),gs.samples.forEach(function(i){e.samples.push([i.xem,i.track.id,i.gsfile.id,i.wsample?i.wsample.when:i.savedWhen,i.wsample?i.wsample.offset:i.savedOffset,i.wsample?i.wsample.duration:i.savedDuration])}),ui.tracks.forEach(function(i){(i.isOn||i.samples.length||i.name||i.wfilters&&i.wfilters.length)&&e.tracks.push([i.id,i.isOn,i.name])}),{href:"data:text/plain;charset=utf-8,"+encodeURIComponent(JSON.stringify(e)),download:"s.txt"}},gs.reset=function(){return ui.tracks.forEach(function(e){e.editName(""),e.toggle(!0)}),gs.samples.forEach(function(e){gs.sampleSelect(e,!0)}),gs.samplesDelete(),gs.files.forEach(function(e){e.elFile.remove()}),gs.files=[],this},gs.fileCreate=function(e){var i=new gs.File(e);return i.id=gs.files.length,gs.files.push(i),ui.elFilelist.appendChild(i.elFile),i},function(){var e,i=wisdom.cE("<div class='cursor'>")[0];gs.filePlay=function(t){e&&e.stop(),t.isLoaded&&(ui.css(i,"transitionDuration",0),ui.css(i,"left",0),t.elWaveformWrap.appendChild(i),e=t.wbuff.createSample().onended(gs.fileStop).load().start(),setTimeout(function(){ui.css(i,"transitionDuration",t.wbuff.buffer.duration+"s"),ui.css(i,"left","100%")},20))},gs.fileStop=function(){e&&(e.stop(),i.remove())}}(),function(){var e;ui.elInputFile.onchange=function(){e&&(e.joinFile(this.files[0]),e=null)},gs.File=function(i){var t=this;this.isLoaded=this.isLoading=!1,this.file=i.length?null:i,this.fullname=i.name||i[1],this.name=this.fullname.replace(/\.[^.]+$/,""),this.nbSamples=0,this.elFile=wisdom.cE(Handlebars.templates.file(this))[0],this.elName=this.elFile.querySelector(".name"),this.elIcon=this.elFile.querySelector(".icon"),this.file?ui.CSS_fileUnloaded(this):(this.size=i[2],ui.CSS_fileWithoutData(this)),this.elFile.oncontextmenu=function(){return!1},this.elFile.ondragstart=this.dragstart.bind(this),this.elFile.onmousedown=function(e){0!==e.button&&gs.fileStop()},this.elFile.onclick=function(){t.isLoaded?gs.filePlay(t):t.file?t.isLoading||t.load(gs.filePlay):(alert("Choose the file to associate or drag and drop "+t.name),e=t,ui.elInputFile.click())}}}(),function(){var e,i;document.body.addEventListener("mousemove",function(t){e&&(ui.css(i,"left",t.pageX+"px"),ui.css(i,"top",t.pageY+"px"))}),document.body.addEventListener("mouseup",function(t){if(e){var n=ui.getTrackFromPageY(t.pageY),s=ui.getGridXem(t.pageX);i.remove(),n&&s>=0&&gs.sampleCreate(e,n.id,s),e=null,ui.cursor("app",null)}}),gs.File.prototype.dragstart=function(t){return this.isLoaded&&!e&&(e=this,i=this.elSVG.cloneNode(!0),ui.css(i,"left",t.pageX+"px"),ui.css(i,"top",t.pageY+"px"),i.classList.add("dragging"),document.body.appendChild(i),ui.cursor("app","grabbing")),!1}}(),gs.File.prototype.joinFile=function(e){this.file=e,ui.CSS_fileUnloaded(this),this.fullname!==e.name&&(this.fullname=e.name,this.name=this.fullname.replace(/\.[^.]+$/,""),this.elName.textContent=this.name),this.samplesToSet.length&&this.load(function(e){e.samplesToSet.forEach(function(i){i.wsample=e.wbuff.createSample(),i.when(i.savedWhen),i.slip(i.savedOffset),i.duration(i.savedDuration),i.wsample.connect(i.track.wfilters),wa.composition.addSamples([i.wsample]),i.elName.textContent=e.name,ui.CSS_sampleDuration(i),ui.CSS_sampleWaveform(i)})})},gs.File.prototype.load=function(e){var i=this;this.isLoading=!0,ui.CSS_fileLoading(this),wa.wctx.createBuffer(this.file).then(function(t){i.wbuff=t,i.isLoaded=!0,i.isLoading=!1,i.elSVG=i.elFile.querySelector("svg"),i.elWaveformWrap=i.elSVG.parentNode,t.waveformSVG(i.elSVG,400,50),ui.CSS_fileLoaded(i),e(i)},function(){i.isLoading=!1,ui.CSS_fileError(i),alert('At this day, the file: "'+i.fullname+'" can not be decoded by your browser.\n')})},gs.sampleCreate=function(e,i,t){var n=new gs.Sample(e,i,t);return gs.samples.push(n),ui.CSS_fileUsed(e),++e.nbSamples,n},gs.sampleSelect=function(e,i){e&&e.wsample&&e.selected!==i&&(e.select(i),i?gs.selectedSamples.push(e):gs.selectedSamples.splice(gs.selectedSamples.indexOf(e),1))},gs.sampleDelete=function(e){e&&e.wsample&&(gs.sampleSelect(e,!1),gs.samples.splice(gs.samples.indexOf(e),1),--e.gsfile.nbSamples||ui.CSS_fileUnused(e.gsfile),e["delete"]())},gs.samplesForEach=function(e,i){e&&e.wsample&&(e.selected?gs.selectedSamples.forEach(function(e){e.wsample&&i(e)}):i(e))},function(){var e,i=[];gs.samplesCopy=function(){var t=1/0,n=-(1/0);i=gs.selectedSamples.map(function(e){return t=Math.min(t,e.xem),n=Math.max(n,e.xem+e.wsample.duration*ui.BPMem),e}),ui.isMagnetized&&(t=ui.xemFloor(t),n=ui.xemCeil(n)),e=n-t},gs.samplesPaste=function(){gs.samplesUnselect(),i.forEach(function(i){var t=gs.sampleCreate(i.gsfile,i.track.id,i.xem+e);t.slip(i.wsample.offset),t.duration(i.wsample.duration),gs.sampleSelect(t,!0)}),gs.samplesCopy()}}(),gs.samplesCut=function(e,i){if(e.wsample){var t=i-e.wsample.when;gs.samplesForEach(e,function(e){e.cut(t)})}},gs.samplesDelete=function(){gs.selectedSamples.slice(0).forEach(gs.sampleDelete),gs.selectedSamples=[]},gs.samplesDuration=function(e,i){function t(e){n=Math.min(n,e.wsample.duration),i=Math.min(i,e.wsample.bufferDuration-e.wsample.duration)}var n=1/0;return e.wsample&&(i/=ui.BPMem,e.selected?gs.selectedSamples.forEach(t):t(e),0>i&&(i=-Math.min(n,-i)),gs.samplesForEach(e,function(e){e.duration(e.wsample.duration+i)})),i*ui.BPMem},gs.samplesMoveX=function(e,i){if(e.selected&&e.wsample&&0>i){var t=1/0;gs.selectedSamples.forEach(function(e){t=Math.min(t,e.xem)}),i=-Math.min(t,-i)}gs.samplesForEach(e,function(e){e.moveX(Math.max(0,e.xem+i))})},gs.samplesSlip=function(e,i){i/=ui.BPMem,gs.samplesForEach(e,function(e){e.slip(e.wsample.offset-i)})},gs.samplesUnselect=function(){gs.selectedSamples.forEach(function(e){e.select(!1)}),gs.selectedSamples=[]},gs.Sample=function(e,i,t){this.gsfile=e,this.elSample=wisdom.cE(Handlebars.templates.sample(e))[0],this.elSVG=this.elSample.querySelector("svg"),this.elName=this.elSample.querySelector(".name"),this.elCropStart=this.elSample.querySelector(".crop.start"),this.elCropEnd=this.elSample.querySelector(".crop.end");for(var n,s=0,o=this.elSample.querySelectorAll("*");n=o[s++];)n.gsSample=this;e.file&&(this.wsample=e.wbuff.createSample(),this.inTrack(i),this.moveX(t),ui.CSS_sampleDuration(this),ui.CSS_sampleWaveform(this),wa.composition.addSamples([this.wsample])),this.select(!1)},gs.Sample.prototype.cut=function(e){if(this.wsample&&this.wsample.duration>e){var i=gs.sampleCreate(this.gsfile,this.track.id,(this.wsample.when+e)*ui.BPMem);i.slip(this.wsample.offset+e),i.duration(this.wsample.duration-e),this.duration(e)}},gs.Sample.prototype["delete"]=function(){this.wsample&&(this.wsample.stop(),this.track.removeSample(this),wa.composition.removeSamples([this.wsample],"rm"),ui.CSS_sampleDelete(this))},gs.Sample.prototype.duration=function(e){this.wsample&&(this.wsample.duration=Math.max(0,Math.min(e,this.wsample.bufferDuration)),ui.CSS_sampleDuration(this))},gs.Sample.prototype.inTrack=function(e){var i=ui.tracks[e];i!==this.track&&this.wsample&&(this.wsample.disconnect(),this.wsample.connect(i.wfilters),this.track&&this.track.removeSample(this),this.track=i,this.track.samples.push(this),ui.CSS_sampleTrack(this))},gs.Sample.prototype.moveX=function(e){this.wsample&&(this.xem=e,this.when(e/ui.BPMem))},gs.Sample.prototype.mute=function(){lg("sample muted (in development)")},gs.Sample.prototype.select=function(e){this.wsample&&(this.selected=e,ui.CSS_sampleSelect(this))},gs.Sample.prototype.slip=function(e){this.wsample&&(this.wsample.offset=Math.min(this.wsample.bufferDuration,Math.max(e,0)),ui.CSS_sampleOffset(this))},gs.Sample.prototype.when=function(e){this.wsample&&(this.wsample.when=e,ui.CSS_sampleWhen(this))},window.onhashchange=function(){ui.toggleAbout("#about"===location.hash)},function(){function e(e,i){i=i.deltaY,gs.bpm(gs._bpm+(i>0?-e:i?e:0))}ui.elBpmInt.onwheel=e.bind(null,1),ui.elBpmDec.onwheel=e.bind(null,.01),ui.elBpmA.onmousedown=function(e){ui.elBpmA.classList.toggle("clicked"),e.stopPropagation()},ui.elBpmList.onmousedown=function(e){var i=+e.target.textContent;i&&gs.bpm(i)},document.body.addEventListener("mousedown",function(){ui.elBpmA.classList.remove("clicked")})}(),ui.elTimeline.onmouseup=function(e){gs.currentTime(ui.getGridXem(e.pageX)/ui.BPMem)},ui.elClockUnits.onclick=function(e){var i=e.target.className;return"s"!==i&&"b"!==i||ui.setClockUnit(gs.clockUnit=i),!1},function(){for(var e,i,t=0,n=!1,s=document.querySelectorAll(".extend"),o={files:function(e){var i=e.pageX;ui.setFilesWidth(35>i?0:i)},trackNames:function(e){var i=e.pageX-ui.elGrid.getBoundingClientRect().left;ui.setTrackNamesWidth(35>i?0:i)}};i=s[t++];)i.onmousedown=function(i){0===i.button&&(n=!0,ui.cursor("app","col-resize"),e=o[this.dataset.mousemoveFn])};document.body.addEventListener("mouseup",function(e){0===e.button&&n&&(n=!1,ui.cursor("app",null))}),document.body.addEventListener("mousemove",function(i){n&&e(i)})}(),function(){function e(i){return new Promise(function(t){if(i.isFile)i.file(function(e){e.type&&"text/plain"!==e.type?s.push(e):n||(n=e,gs.reset()),t()});else if(i.isDirectory){var o=i.createReader();o.readEntries(function(i){var n=[];i.forEach(function(i){n.push(e(i))}),Promise.all(n).then(t)})}})}function i(i){for(var o,a=0,u=[];o=i[a++];)(o=o.webkitGetAsEntry())&&u.push(e(o));Promise.all(u).then(function(){gs.load(n).then(function(){t(s)})})}function t(e){e.forEach(function(e){gs.files.some(function(i){var t=i.file?i.file.size:i.size;return i.fullname===e.name&&t===e.size?(i.file||i.joinFile(e),!0):void 0})||gs.fileCreate(e)})}document.body.ondragover=function(){return!1},document.body.ondrop=function(e){
var n=e&&e.dataTransfer,s=!1,o=[];if(n.items)i(n.items);else if(n.files.length){for(var a,u=0;a=n.files[u++];)a.type&&"text/plain"!==a.type?o.push(a):s||(s=a,gs.reset());gs.load(s).then(function(){t(o)})}else alerte("Your browser doesn't support folders.");return!1};var n,s=[]}(),function(){function e(e){return n.every(function(i){return i===e||!t.contains(i)})}function i(e){t.toggle("used",e),t.toggle("loaded",e),t.toggle("unloaded",e)}ui.elFileFilters.onclick=ui.elFileFilters.oncontextmenu=function(){return!1},ui.elFileFilters.onmouseup=function(n){var s,o=n.target;"A"===o.nodeName&&(0===n.button?t.toggle(o.className):2===n.button&&(s=t.contains(o.className)&&e(o.className),i(s),s||t.add(o.className)))};var t=ui.elFileFilters.classList,n=["used","loaded","unloaded"];i(!0)}(),function(){function e(){t&&(ui.selectTool(t),t=null),i=!1}window.addEventListener("blur",e),ui.elGridCols.onwheel=function(e){return"zoom"===ui.currentTool?(ui.tool.zoom.wheel(e),!1):void 0},ui.elGridCols.onscroll=function(){ui.gridScrollTop=ui.elGridCols.scrollTop,ui.updateGridTopShadow()},ui.elTrackLines.oncontextmenu=function(){return!1},ui.elTrackLines.onmousedown=function(e){if(!i){i=!0,n=ui.getGridXem(e.pageX),s=e.pageX,o=e.pageY,2===e.button&&(t=ui.currentTool,ui.selectTool("delete"));var a=ui.tool[ui.currentTool].mousedown;a&&a(e,e.target.gsSample)}},document.body.onwheel=function(e){return e.ctrlKey?!1:void 0},document.body.addEventListener("mousemove",function(e){if(i){var t=ui.tool[ui.currentTool].mousemove,a=ui.getGridXem(e.pageX);t&&t(e,e.target.gsSample,"hand"!==ui.currentTool?(a-n)*ui.gridEm:e.pageX-s,e.pageY-o),n=a,s=e.pageX,o=e.pageY}}),document.body.addEventListener("mouseup",function(t){if(i){var n=ui.tool[ui.currentTool].mouseup;n&&n(t,t.target.gsSample),e()}});var i,t,n,s=0,o=0}(),function(){function e(){a&&ui.selectTool(a),o=a=null}function i(i){var t=i.keyCode,n=ui.tool[ui.currentTool];L[t]=!1,n.keyup&&n.keyup(i),t===o&&(o=null,e())}function t(e){var i,t=e.keyCode;return L[t]||(L[t]=!0,u[t]&&(u[t](e),i=ui.tool[ui.currentTool].keydown,i&&i(e))),b.indexOf(t)>-1?!1:void 0}function n(e){a=ui.currentTool,ui.selectTool(e)}function s(e,i){o||(o=e,n(i))}window.addEventListener("blur",e),document.body.onkeydown=t,document.body.onkeyup=i;var o,a,u={},l=8,r=16,c=17,d=18,m=32,f=46,p=27,h=66,g=67,w=68,v=71,S=72,T=77,k=83,C=86,y=90,b=[m,l,d],L=[];u[f]=gs.samplesDelete,u[v]=ui.toggleMagnetism,u[d]=s.bind(null,d,"hand"),u[c]=s.bind(null,c,"zoom"),u[r]=s.bind(null,r,"select"),u[h]=n.bind(null,"paint"),u[w]=n.bind(null,"delete"),u[T]=function(){},u[k]=n.bind(null,"slip"),u[S]=n.bind(null,"hand"),u[y]=n.bind(null,"zoom"),u[g]=function(e){e.ctrlKey?gs.samplesCopy():n("cut")},u[C]=function(e){e.ctrlKey?gs.samplesPaste():n("select")},u[m]=function(e){gs.fileStop(),e.ctrlKey?gs.playToggle():gs.isPlaying?gs.stop():gs.play()},u[p]=function(){ui.elAbout.classList.contains("show")&&(ui.toggleAbout(!1),location.hash="")}}(),ui.elPlay.onclick=function(){gs.fileStop(),gs.playToggle()},ui.elStop.onclick=function(){gs.fileStop(),gs.stop()},wa.composition.onended(gs.stop),window.onresize=ui.resize(),ui.elBtnSave.onclick=function(){var e=gs.save();ui.elBtnSave.setAttribute("href",e.href),ui.elBtnSave.setAttribute("download",e.download)},function(){ui.elBtnMagnet.onclick=ui.toggleMagnetism,ui.elTools.onclick=function(e){(e=e.target.dataset.tool)&&ui.selectTool(e)};var e,i=ui.elTools.children,t=0;for(ui.elTools.tool={};e=i[t++];)e.dataset.tool&&(ui.elTools.tool[e.dataset.tool]=e)}(),function(){var e;ui.tool.cut={mousedown:function(i,t){e=t},mouseup:function(i){e&&gs.samplesCut(e,ui.getGridXem(i.pageX)/ui.BPMem),e=null}}}(),ui.tool["delete"]={mousedown:function(e,i){gs.sampleDelete(i)},mousemove:function(e,i){gs.sampleDelete(i)}},ui.tool.hand={start:function(){ui.cursor("grid","grab")},end:function(){ui.cursor("grid",null)},mousedown:function(){ui.cursor("app","grabbing")},mouseup:function(){ui.cursor("app",null)},mousemove:function(e,i,t,n){ui.setTrackLinesLeft(ui.trackLinesLeft+t),ui.setGridScrollTop(ui.gridScrollTop-n),ui.updateTimeline(),ui.updateTrackLinesBg()}},ui.tool.mute={mousedown:function(e,i){i&&i.mute()},mousemove:function(e,i){i&&i.mute()}},function(){var e,i,t,n;ui.tool.paint={mousedown:function(s,o){o?(t=s.target.classList.contains("start"),n=s.target.classList.contains("end"),i=t||n,i&&o[t?"elCropStart":"elCropEnd"].classList.add("hover"),e=o,ui.cursor("app",i?t?"w-resize":"e-resize":"grabbing")):gs.samplesUnselect()},mouseup:function(){e&&(gs.samplesForEach(e,function(e){wa.composition.update(e.wsample,"mv")}),i&&(e[t?"elCropStart":"elCropEnd"].classList.remove("hover"),i=t=n=!1),e=null,ui.cursor("app",null))},mousemove:function(t,s,o,a){if(e)if(o/=ui.gridEm,i)n?gs.samplesDuration(e,o):(o=-gs.samplesDuration(e,-o))&&(gs.samplesMoveX(e,o),gs.samplesSlip(e,-o));else{gs.samplesMoveX(e,o),t=t.target;var u,l=1/0,r=t.uitrack||t.gsSample&&t.gsSample.track;r&&(e.selected?(u=r.id-e.track.id,0>u&&(gs.selectedSamples.forEach(function(e){l=Math.min(e.track.id,l)}),u=-Math.min(l,-u)),gs.selectedSamples.forEach(function(e){e.inTrack(e.track.id+u)})):e.inTrack(r.id))}}}}(),function(){var e,i,t,n,s,o,a=0,u=wisdom.cE("<div id='squareSelection'>")[0];ui.tool.select={mousedown:function(t,n){s=!0,e=t.pageX,i=t.pageY,t.shiftKey||gs.samplesUnselect(),n&&gs.sampleSelect(n,!n.selected)},mouseup:function(){s=o=!1,ui.css(u,"width","0px"),ui.css(u,"height","0px"),u.remove()},mousemove:function(l){if(s){var r,c,d=l.pageX,m=l.pageY;if(!o&&Math.max(Math.abs(d-e),Math.abs(m-i))>5&&(++a,o=!0,t=ui.getTrackFromPageY(i).id,n=ui.getGridXem(e),ui.elTrackLines.appendChild(u)),o){r=ui.getTrackFromPageY(m),r=r?r.id:0,c=Math.max(0,ui.getGridXem(d));var f=Math.min(t,r),p=Math.max(t,r),h=Math.min(n,c),g=Math.max(n,c);gs.samples.forEach(function(e){var i,t,n=e.track.id;if(e.wsample){if(n>=f&&p>=n&&(i=e.xem,t=i+e.wsample.duration*ui.BPMem,i>=h&&g>i||t>h&&g>=t||h>=i&&t>=g))return void(e.selected||(e.squareSelected=a,gs.sampleSelect(e,!0)));e.squareSelected===a&&gs.sampleSelect(e,!1)}}),ui.css(u,"top",f+"em"),ui.css(u,"left",h+"em"),ui.css(u,"width",g-h+"em"),ui.css(u,"height",p-f+1+"em")}}}}}(),function(){var e;ui.tool.slip={mousedown:function(i,t){e=t},mouseup:function(){e&&gs.samplesForEach(e,function(e){wa.composition.update(e.wsample,"mv")}),e=null},mousemove:function(i,t,n){e&&gs.samplesSlip(e,n/ui.gridEm)}}}(),function(){function e(e,i){ui.setGridZoom(ui.gridZoom*i,e.pageX-ui.filesWidth-ui.trackNamesWidth,e.pageY-ui.gridColsY)}ui.tool.zoom={start:function(){ui.cursor("grid","zoom-in")},end:function(){ui.cursor("grid",null)},keydown:function(e){18===e.keyCode&&ui.cursor("grid","zoom-out")},keyup:function(e){18===e.keyCode&&ui.cursor("grid","zoom-in")},wheel:function(i){e(i,i.deltaY<0?1.1:.9)},mousedown:function(i){0===i.button&&e(i,i.altKey?.7:1.3)}}}(),ui.resize(),ui.setFilesWidth(200),ui.setTrackLinesLeft(0),ui.setTrackNamesWidth(125),ui.setGridZoom(1.5,0,0),ui.analyserToggle(!0),ui.toggleMagnetism(!0),ui.updateTrackLinesBg(),gs.bpm(120),gs.currentTime(0),ui.elClockUnits.querySelector(".s").click(),ui.elMenu.querySelector("[data-tool='paint']").click();for(var i=0;42>i;++i)ui.newTrack();window.onhashchange();