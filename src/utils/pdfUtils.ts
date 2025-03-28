// pdfUtils.ts
import { PDFDocument } from 'pdf-lib';

const paperSizes = {
  'US Letter': { width: 612, height: 792 },
  'US Legal': { width: 612, height: 1008 }
};

export async function createPDF({
  images,
  config,
  designFileName,
  batchIndex = 0
}: {
  images: { url: string; width: number; height: number }[];
  config: any;
  designFileName: string;
  batchIndex?: number;
}): Promise<{ filename: string; blob: Blob }> {
  const pdfDoc = await PDFDocument.create();
  const { width: w, height: h } = paperSizes[config.paperSize];
  const isLandscape = config.orientation === 'landscape';
  const pageWidth = isLandscape ? h : w;
  const pageHeight = isLandscape ? w : h;
  const margin = config.margin * 72;

  for (const image of images) {
    const res = await fetch(image.url);
    const bytes = await res.arrayBuffer();
    let imgEmbed;
    try {
      imgEmbed = await pdfDoc.embedJpg(bytes);
    } catch {
      imgEmbed = await pdfDoc.embedPng(bytes);
    }

    let drawWidth = image.width;
    let drawHeight = image.height;

    if (drawWidth + 2 * margin > pageWidth || drawHeight + 2 * margin > pageHeight) {
      const scale = Math.min((pageWidth - 2 * margin) / drawWidth, (pageHeight - 2 * margin) / drawHeight);
      drawWidth *= scale;
      drawHeight *= scale;
    }

    const page = pdfDoc.addPage([pageWidth, pageHeight]);
    page.drawImage(imgEmbed, {
      x: (pageWidth - drawWidth) / 2,
      y: (pageHeight - drawHeight) / 2,
      width: drawWidth,
      height: drawHeight
    });
  }

  const bytes = await pdfDoc.save();
  const blob = new Blob([bytes], { type: 'application/pdf' });
  const filename = `${designFileName}_batch${batchIndex + 1}.pdf`;

  return { filename, blob };
}