// 간단한 PDF 생성 유틸리티 (모바일 웹용)
export function generatePDF(data: any) {
  // 모바일에서는 HTML 콘텐츠를 클립보드에 복사하여 사용자가 직접 저장하도록 안내
  const htmlContent = `
SkinAI 피부 진단 결과
====================

진단 날짜: ${data.date || new Date().toLocaleDateString('ko-KR')}
진단 결과: ${data.result || '정상'} (${data.score || 85}점)
상세 요약: ${data.summary || '피부 상태가 양호한 것으로 분석되었습니다.'}

세부 분석 항목:
- 피부 장벽 지수: ${data.details?.barrier || 91}%
- 염증 수치: ${data.details?.uv || 32}%
- 수분 균형: ${data.details?.moisture || 78}%
- 피지 분비량: ${data.details?.sebum || 64}%

생성 시간: ${new Date().toLocaleString('ko-KR')}

※ 본 결과는 SkinAI의 AI 분석 기술을 기반으로 생성되었습니다.
※ 본 결과는 참고용이며, 정확한 진단은 전문 의료진과 상담하세요.

이 내용을 메모장이나 문서 편집기에 붙여넣어 PDF로 저장할 수 있습니다.
  `.trim();

  return htmlContent;
}

// 모바일 웹용 다운로드 (클립보드 복사)
export function downloadAsPDF(content: string, filename: string) {
  // 클립보드에 복사
  navigator.clipboard.writeText(content).then(() => {
    // 토스트 메시지 표시
    const toast = document.createElement('div');
    toast.textContent = '리포트 내용이 복사되었습니다. 메모장에 붙여넣어 PDF로 저장하세요.';
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
      text-align: center;
    `;
    
    document.body.appendChild(toast);
    
    // 4초 후 제거
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 4000);
  }).catch(() => {
    // fallback
    const textArea = document.createElement('textarea');
    textArea.value = content;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    
    showToast('리포트 내용이 복사되었습니다. 메모장에 붙여넣어 PDF로 저장하세요.');
  });
}

// 토스트 메시지 표시 함수
function showToast(message: string) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 14px;
    z-index: 10000;
    max-width: 300px;
    text-align: center;
  `;
  
  document.body.appendChild(toast);
  
  // 4초 후 제거
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 4000);
}
