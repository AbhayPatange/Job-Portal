export function redactResumeForReview(value = '') {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email removed]')
    .replace(/(?:https?:\/\/|www\.)\S+/gi, '[link removed]')
    .replace(/(?:\+?\d[\d ().-]{7,}\d)/g, '[number removed]')
    .replace(/^\s*(?:address|date of birth|dob|gender|marital status|nationality|religion)\s*:.*$/gim, '[personal detail removed]');
}

export async function extractResumeText(source) {
  const [{ GlobalWorkerOptions, getDocument }, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ]);
  GlobalWorkerOptions.workerSrc = worker.default;
  const bytes = source instanceof File
    ? await source.arrayBuffer()
    : await (await fetch(source)).arrayBuffer();
  const pdf = await getDocument({ data: new Uint8Array(bytes) }).promise;
  if (pdf.numPages > 20) throw new Error('Please use a résumé with 20 pages or fewer.');
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map(item => `${item.str || ''}${item.hasEOL ? '\n' : ' '}`).join(''));
  }
  const text = pages.join('\n').replace(/\s{3,}/g, '\n').trim();
  if (text.length < 100) throw new Error('This PDF has little selectable text. Paste your résumé text instead.');
  return text;
}
