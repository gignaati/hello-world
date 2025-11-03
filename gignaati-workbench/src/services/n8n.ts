const DEFAULT_N8N_URL = 'http://localhost:5678';

export const getN8nUrl = (baseUrl: string = DEFAULT_N8N_URL): string => baseUrl;

export const checkN8nStatus = async (
  baseUrl: string = DEFAULT_N8N_URL,
): Promise<'online' | 'offline'> => {
  try {
    const response = await fetch(baseUrl, { method: 'HEAD' });
    return response.ok ? 'online' : 'offline';
  } catch (error) {
    console.warn('n8n status check failed', error);
    return 'offline';
  }
};
