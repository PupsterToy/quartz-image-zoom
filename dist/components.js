// components.ts
var ImageZoom = () => null;
ImageZoom.css = `
.img-zoom-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.88);
  display: none;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  cursor: zoom-out;
  overflow: hidden;
}
.img-zoom-overlay.open { display: flex; }
.img-zoom-img {
  max-width: 90vw;
  max-height: 90vh;
  transform-origin: center center;
  cursor: grab;
  user-select: none;
  -webkit-user-drag: none;
  will-change: transform;
}
.img-zoom-img.grabbing { cursor: grabbing; }
.img-zoom-hint {
  position: fixed;
  bottom: 18px;
  left: 50%;
  transform: translateX(-50%);
  color: #ddd;
  font-size: 13px;
  background: rgba(0, 0, 0, 0.45);
  padding: 6px 14px;
  border-radius: 20px;
  pointer-events: none;
}
`;
ImageZoom.afterDOMLoaded = `
if (window.__imgZoomReady) return;
window.__imgZoomReady = true;

var overlay = document.createElement('div');
overlay.className = 'img-zoom-overlay';
var zoomImg = document.createElement('img');
zoomImg.className = 'img-zoom-img';
var hint = document.createElement('div');
hint.className = 'img-zoom-hint';
hint.textContent = '\u6EDA\u8F6E\u7F29\u653E \xB7 \u62D6\u62FD\u5E73\u79FB \xB7 \u53CC\u51FB\u590D\u4F4D \xB7 Esc \u5173\u95ED';
overlay.appendChild(zoomImg);
overlay.appendChild(hint);
document.body.appendChild(overlay);

var scale = 1, posX = 0, posY = 0, panning = false, startX = 0, startY = 0;

function apply() {
  zoomImg.style.transform = 'translate(' + posX + 'px,' + posY + 'px) scale(' + scale + ')';
}
function reset() { scale = 1; posX = 0; posY = 0; apply(); }
function openImg(src, alt) { zoomImg.src = src; zoomImg.alt = alt; reset(); overlay.classList.add('open'); }
function closeImg() { overlay.classList.remove('open'); }

// \u70B9\u51FB\u6B63\u6587\u56FE\u7247\u6253\u5F00\u706F\u7BB1\uFF08\u4E8B\u4EF6\u59D4\u6258\uFF0C\u517C\u5BB9 SPA \u9875\u9762\u5207\u6362\uFF09
document.addEventListener('click', function (e) {
  var img = e.target;
  if (!img || img.tagName !== 'IMG') return;
  if (img.closest('header')) return;
  if (img.closest('.explorer')) return;
  if (img.closest('[data-component="explorer"]')) return;
  if (/icon|logo/i.test(img.className || '')) return;
  e.preventDefault();
  openImg(img.currentSrc || img.src, img.alt);
});

overlay.addEventListener('wheel', function (e) {
  e.preventDefault();
  var factor = e.deltaY < 0 ? 1.12 : 0.89;
  scale = Math.min(Math.max(scale * factor, 0.2), 8);
  apply();
}, { passive: false });

zoomImg.addEventListener('pointerdown', function (e) {
  panning = true;
  startX = e.clientX - posX;
  startY = e.clientY - posY;
  zoomImg.classList.add('grabbing');
  zoomImg.setPointerCapture(e.pointerId);
});
zoomImg.addEventListener('pointermove', function (e) {
  if (!panning) return;
  posX = e.clientX - startX;
  posY = e.clientY - startY;
  apply();
});
zoomImg.addEventListener('pointerup', function () {
  panning = false;
  zoomImg.classList.remove('grabbing');
});
zoomImg.addEventListener('dblclick', reset);
overlay.addEventListener('click', function (e) { if (e.target === overlay) closeImg(); });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeImg(); });
`;
export {
  ImageZoom
};
