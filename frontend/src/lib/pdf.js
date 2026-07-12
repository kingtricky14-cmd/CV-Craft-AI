// Client-side PDF export. We render the SAME DOM node the user already sees
// in the live preview (#resume-preview-sheet), so "what you see is what you
// download" — no separate PDF-only template to maintain.
//
// html2pdf.js = html2canvas (DOM -> image) + jsPDF (image -> PDF) bundled
// together, which matches the PRD's suggested "react-pdf or html2pdf" and is
// the simpler option since it reuses our existing HTML/Tailwind templates
// instead of re-declaring them in react-pdf's separate component API.

export function slugifyFilename(title) {
  const base = (title || 'resume').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  return `${base || 'resume'}.pdf`;
}

export async function downloadResumeAsPdf(elementId, filename) {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Could not find the resume preview to export.');
  }

  // Dynamic import: keeps html2pdf.js (and its canvas/jsPDF deps) out of the
  // main bundle until someone actually clicks "Download PDF".
  const { default: html2pdf } = await import('html2pdf.js');

  const opt = {
    margin: 0,
    filename: filename || 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  await html2pdf().set(opt).from(element).save();
}
