// 직접 PDF 생성을 위한 간단한 라이브러리 구현
export class SimplePDF {
  private content: string[] = [];
  private currentY: number = 20;
  private pageHeight: number = 800;
  private pageWidth: number = 600;
  private lineHeight: number = 20;

  constructor() {
    this.content.push('%PDF-1.4');
  }

  addText(text: string, fontSize: number = 12, x: number = 50) {
    const lines = this.wrapText(text, this.pageWidth - 2 * x);
    lines.forEach(line => {
      this.currentY += this.lineHeight;
      if (this.currentY > this.pageHeight - 50) {
        this.addNewPage();
      }
      this.content.push(`BT /F1 ${fontSize} Tf ${x} ${this.pageHeight - this.currentY} Td (${line}) Tj ET`);
    });
  }

  addTitle(text: string) {
    this.addText(text, 18, 50);
    this.currentY += 10;
  }

  addSubtitle(text: string) {
    this.addText(text, 14, 50);
    this.currentY += 5;
  }

  addNewPage() {
    this.currentY = 20;
  }

  private wrapText(text: string, maxWidth: number): string[] {
    // 간단한 텍스트 래핑 (실제로는 더 정교한 계산 필요)
    const maxCharsPerLine = Math.floor(maxWidth / 6); // 대략적인 계산
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length <= maxCharsPerLine) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // 단어가 너무 길면 강제로 분리
          lines.push(word.substring(0, maxCharsPerLine));
          currentLine = word.substring(maxCharsPerLine);
        }
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }

    return lines;
  }

  generatePDF(): Uint8Array {
    // 간단한 PDF 구조 생성
    const pdfObjects = [
      '1 0 obj',
      '<< /Type /Catalog /Pages 2 0 R >>',
      'endobj',
      '2 0 obj',
      '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
      'endobj',
      '3 0 obj',
      '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + this.pageWidth + ' ' + this.pageHeight + '] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>',
      'endobj',
      '4 0 obj',
      '<< /Length ' + (this.content.length * 50) + ' >>',
      'stream',
      'q',
      'BT',
      '/F1 12 Tf',
      ...this.content.map(line => line),
      'ET',
      'Q',
      'endstream',
      'endobj',
      '5 0 obj',
      '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
      'endobj',
      'xref',
      '0 6',
      '0000000000 65535 f ',
      '0000000009 00000 n ',
      '0000000058 00000 n ',
      '0000000115 00000 n ',
      '0000000274 00000 n ',
      '0000000320 00000 n ',
      'trailer',
      '<< /Size 6 /Root 1 0 R >>',
      'startxref',
      '0000000371',
      '%%EOF'
    ];

    const pdfString = pdfObjects.join('\n');
    return new TextEncoder().encode(pdfString);
  }
}

// 진단 결과 PDF 생성
export function generateDirectPDF(data: any): Uint8Array {
  const pdf = new SimplePDF();
  
  pdf.addTitle('SkinAI 피부 진단 결과');
  pdf.addSubtitle('AI 기반 피부 상태 분석 리포트');
  pdf.addText('');
  
  pdf.addSubtitle('진단 정보');
  pdf.addText(`진단 날짜: ${data.date || new Date().toLocaleDateString('ko-KR')}`);
  pdf.addText(`진단 결과: ${data.result || '정상'} (${data.score || 85}점)`);
  pdf.addText(`상세 요약: ${data.summary || '피부 상태가 양호한 것으로 분석되었습니다.'}`);
  pdf.addText('');
  
  if (data.details) {
    pdf.addSubtitle('세부 분석 항목');
    pdf.addText(`피부 장벽 지수: ${data.details.barrier || 91}%`);
    pdf.addText(`염증 수치: ${data.details.uv || 32}%`);
    pdf.addText(`수분 균형: ${data.details.moisture || 78}%`);
    pdf.addText(`피지 분비량: ${data.details.sebum || 64}%`);
    pdf.addText('');
  }
  
  pdf.addSubtitle('안내사항');
  pdf.addText(`생성 시간: ${new Date().toLocaleString('ko-KR')}`);
  pdf.addText('');
  pdf.addText('※ 본 결과는 SkinAI의 AI 분석 기술을 기반으로 생성되었습니다.');
  pdf.addText('※ 본 결과는 참고용이며, 정확한 진단은 전문 의료진과 상담하세요.');
  
  return pdf.generatePDF();
}

// PDF 다운로드
export function downloadPDF(pdfData: Uint8Array, filename: string): boolean {
  const blob = new Blob([pdfData], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  
  try {
    link.click();
    return true;
  } catch (error) {
    // 모바일에서 다운로드 실패 시 Blob URL을 새 창으로 열기
    window.open(url, '_blank');
    return false;
  } finally {
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
  }
}
