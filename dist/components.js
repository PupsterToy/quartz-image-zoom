var o=()=>{let e=()=>null;return e.css=`
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
`,e.afterDOMLoaded=`
(function () {
  if (window.__imgZoomReady) return;
  window.__imgZoomReady = true;

  var overlay, zoomImg, hint;
  var scale = 1, posX = 0, posY = 0, panning = false, startX = 0, startY = 0;

  function apply() {
    zoomImg.style.transform = 'translate(' + posX + 'px,' + posY + 'px) scale(' + scale + ')';
  }
  function reset() { scale = 1; posX = 0; posY = 0; apply(); }
  function openImg(src, alt) { zoomImg.src = src; zoomImg.alt = alt; reset(); overlay.classList.add('open'); }
  function closeImg() { overlay.classList.remove('open'); }

  // \u91CD\u5EFA\u706F\u7BB1 DOM\uFF08\u5207\u9875\u540E body \u88AB micromorph \u66FF\u6362\uFF0Coverlay \u4F1A\u88AB\u9500\u6BC1\uFF0C\u9700\u91CD\u5EFA\uFF09
  function ensureOverlay() {
    overlay = document.querySelector('.img-zoom-overlay');
    if (overlay) { zoomImg = overlay.querySelector('.img-zoom-img'); return; }

    overlay = document.createElement('div');
    overlay.className = 'img-zoom-overlay';
    zoomImg = document.createElement('img');
    zoomImg.className = 'img-zoom-img';
    hint = document.createElement('div');
    hint.className = 'img-zoom-hint';
    hint.textContent = '\u6EDA\u8F6E\u7F29\u653E \xB7 \u62D6\u62FD\u5E73\u79FB \xB7 \u53CC\u51FB\u590D\u4F4D \xB7 Esc \u5173\u95ED';
    overlay.appendChild(zoomImg);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);

    overlay.addEventListener('wheel', function (e) {
      e.preventDefault();
      var factor = e.deltaY < 0 ? 1.12 : 0.89;
      scale = Math.min(Math.max(scale * factor, 0.2), 8);
      apply();
    }, { passive: false });

    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeImg(); });
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
  }

  // document \u7EA7\u76D1\u542C\u53EA\u9700\u6302\u4E00\u6B21\uFF08document \u672C\u8EAB\u4E0D\u4F1A\u88AB\u66FF\u6362\uFF0C\u4E8B\u4EF6\u59D4\u6258\u5BF9\u5207\u9875\u540E\u7684\u65B0\u56FE\u7247\u540C\u6837\u751F\u6548\uFF09
  function ensureDocListeners() {
    if (window.__imgZoomDocReady) return;
    window.__imgZoomDocReady = true;

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
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeImg(); });
  }

  function init() { ensureOverlay(); ensureDocListeners(); }

  init();
  // SPA \u5207\u9875\u540E\u91CD\u5EFA overlay\uFF08document \u76D1\u542C\u590D\u7528\uFF0C\u65E0\u9700\u91CD\u6302\uFF09
  document.addEventListener('nav', init);
  document.addEventListener('render', init);
})();
`,e};export{o as ImageZoom};
