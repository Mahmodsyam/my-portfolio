const API_BASE = (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '') + '/api';

export async function apiRequest(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options,
  };
  
  // Don't set Content-Type for FormData (let browser set boundary)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, config);
    const contentType = response.headers.get('content-type');
    
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        if (!response.ok) {
          throw new Error('تعذر الاتصال بالسيرفر أو أن السيرفر غير مشغل. يرجى التأكد من تشغيل npm run dev');
        }
        data = { success: true, message: text };
      }
    }
    
    if (!response.ok) {
      throw new Error(data.error || data.message || 'حدث خطأ أثناء معالجة الطلب');
    }
    
    return data;
  } catch (err) {
    if (err.message && (err.message.includes('Unexpected end of JSON input') || err.message.includes('Failed to fetch'))) {
      throw new Error('تعذر الاتصال بسيرفر الـ API. يرجى التأكد من تشغيل `npm run dev` في سطر الأوامر.');
    }
    throw err;
  }
}
