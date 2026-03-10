
export const getXiaoDaResponse = async (query: string, history: any[]) => {
  const isEmergency = /出血|痛|發燒|破水|不動/.test(query);

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, history }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return { text: data.text, isEmergency: data.isEmergency || isEmergency };
  } catch (error: any) {
    console.error('Chat API error:', error);
    // 試著從 error 中提取訊息，或者如果是 fetch 失敗則回傳特定訊息
    const errorMsg = error?.message || '連線稍微斷了';
    return { text: `哎呀，${errorMsg}，再試一次嗎？🧸`, isEmergency: false };
  }
};
