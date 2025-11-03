const DEFAULT_OLLAMA_URL = 'http://localhost:11434';

export interface OllamaModel {
  name: string;
  modified_at?: string;
  size?: number;
  digest?: string;
}

export interface OllamaModelsResponse {
  models: OllamaModel[];
}

export const listOllamaModels = async (
  baseUrl: string = DEFAULT_OLLAMA_URL,
): Promise<OllamaModel[]> => {
  try {
    const response = await fetch(`${baseUrl}/api/tags`);
    if (!response.ok) {
      throw new Error(`Ollama responded with status ${response.status}`);
    }

    const payload = (await response.json()) as OllamaModelsResponse;
    return payload.models ?? [];
  } catch (error) {
    console.error('Failed to query Ollama models', error);
    return [];
  }
};

export const pullOllamaModel = async (
  model: string,
  baseUrl: string = DEFAULT_OLLAMA_URL,
): Promise<boolean> => {
  try {
    const response = await fetch(`${baseUrl}/api/pull`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model }),
    });

    return response.ok;
  } catch (error) {
    console.error(`Failed to pull Ollama model ${model}`, error);
    return false;
  }
};

export const getOllamaStatus = async (
  baseUrl: string = DEFAULT_OLLAMA_URL,
): Promise<'online' | 'offline'> => {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, { method: 'GET' });
    return response.ok ? 'online' : 'offline';
  } catch (error) {
    console.warn('Ollama status check failed', error);
    return 'offline';
  }
};
