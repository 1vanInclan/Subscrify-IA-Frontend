import api from '../lib/api';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const sendChatMessage = async (message: string): Promise<string> => {
  const response = await api.post('/ai/chat', { message });
  return response.data.text || response.data.reply || response.data.message || 'Sin respuesta.';
};