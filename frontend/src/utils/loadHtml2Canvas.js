// html2canvas loader for chart download
export async function loadHtml2Canvas() {
  if (window.html2canvas) return window.html2canvas;
  const html2canvas = await import('html2canvas');
  window.html2canvas = html2canvas.default;
  return window.html2canvas;
}
