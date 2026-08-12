// ══════════════════════════════════════
//  NestFinder — App Init
// ══════════════════════════════════════

// Close lightbox with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (!document.getElementById('lightbox').classList.contains('hidden')) {
      closeLightbox();
    } else if (!document.getElementById('modal-overlay').classList.contains('hidden')) {
      closeModal();
    }
  }
  if (!document.getElementById('lightbox').classList.contains('hidden')) {
    if (e.key === 'ArrowLeft')  lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  }
});

// App is ready — auth page is shown by default in HTML
console.log('NestFinder loaded ✓');
