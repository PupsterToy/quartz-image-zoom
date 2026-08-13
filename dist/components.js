var o = () => {
  let e = () => null;
  e.css = `
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
  /* Removed max-width/max-height – size is now controlled via transform */
  transform-origin: center center;
  cursor: grab;
  user-select: none;
  -webkit-user-drag: none;
  will-change: transform;
  image-rendering: auto; /* auto for photos, crisp-edges for pixel art / screenshots */
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
  e.afterDOMLoaded = `
(function () {
  if (window.__imgZoomReady) return;
  window.__imgZoomReady = true;

  var overlay, zoomImg, hint;
  var scale = 1, posX = 0, posY = 0, panning = false, startX = 0, startY = 0;

  // Apply current transform (translate + scale)
  function apply() {
    zoomImg.style.transform = 'translate(' + posX + 'px,' + posY + 'px) scale(' + scale + ')';
  }

  // Calculate the initial scale so the image fits inside the viewport with padding
  function getFitScale() {
    if (!zoomImg) return 1;
    var rect = overlay.getBoundingClientRect();
    var pad = 40; // padding from edges
    var maxW = rect.width - pad * 2;
    var maxH = rect.height - pad * 2;
    var naturalW = zoomImg.naturalWidth || zoomImg.width;
    var naturalH = zoomImg.naturalHeight || zoomImg.height;
    if (naturalW === 0 || naturalH === 0) return 1;
    var scaleX = maxW / naturalW;
    var scaleY = maxH / naturalH;
    return Math.min(scaleX, scaleY, 1); // never scale up beyond original size
  }

  // Reset zoom and position to fit the image in the viewport
  function reset() {
    scale = getFitScale();
    posX = 0;
    posY = 0;
    apply();
  }

  // Open the lightbox with the given image
  function openImg(src, alt) {
    zoomImg.src = src;
    zoomImg.alt = alt;
    zoomImg.style.opacity = '0';
    overlay.classList.add('open');

    // Wait for the image to load so we can get natural dimensions
    zoomImg.onload = function () {
      var fitScale = getFitScale();
      scale = fitScale;
      posX = 0;
      posY = 0;
      apply();
      zoomImg.style.opacity = '1';
    };
    // If already cached, trigger onload immediately
    if (zoomImg.complete) {
      zoomImg.onload();
    }
  }

  // Close the lightbox
  function closeImg() {
    overlay.classList.remove('open');
  }

  // Ensure the overlay DOM exists (re‑create it after SPA navigation if needed)
  function ensureOverlay() {
    overlay = document.querySelector('.img-zoom-overlay');
    if (overlay) {
      zoomImg = overlay.querySelector('.img-zoom-img');
      return;
    }

    overlay = document.createElement('div');
    overlay.className = 'img-zoom-overlay';
    zoomImg = document.createElement('img');
    zoomImg.className = 'img-zoom-img';
    hint = document.createElement('div');
    hint.className = 'img-zoom-hint';
    hint.textContent = 'Scroll to zoom · Drag to pan · Double-click to reset · Esc to close';
    overlay.appendChild(zoomImg);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);

    overlay.addEventListener('wheel', function (e) {
      e.preventDefault();
      var factor = e.deltaY < 0 ? 1.12 : 0.89;
      scale = Math.min(Math.max(scale * factor, 0.2), 8);
      apply();
    }, { passive: false });

    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeImg();
    });
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

  // Attach global event listeners (document never gets replaced, so we only need to add them once)
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
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeImg();
    });
  }

  function init() {
    ensureOverlay();
    ensureDocListeners();
  }

  init();
  // Rebuild overlay after SPA navigation (document listeners are reused)
  document.addEventListener('nav', init);
  document.addEventListener('render', init);
})();
`;
  return e;
};
export { o as ImageZoom };
