import { Word } from '../types/word';

interface ChatGPTResponse {
  translation_ru: string;
  examples: Array<{ de: string; ru: string }>;
}

export const generateWordData = async (word: string): Promise<ChatGPTResponse> => {
  const apiKey = localStorage.getItem('deepseek_api_key');
  if (!apiKey) {
    throw new Error('DeepSeek API key not found. Please add it in the settings.');
  }
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{
        role: 'user',
        content: `Translate the German word "${word}" to Russian and provide 2 example sentences in German with their Russian translations. Format the response as JSON with the following structure: {"translation_ru": "translation", "examples": [{"de": "German sentence", "ru": "Russian translation"}]}`
      }]
    })
  });

  const data = await response.json();
  const content = data.choices[0].message.content;
  // Remove markdown code block wrapper if present
  const cleanContent = content.replace(/^```json\n?|```$/g, '').trim();
  return JSON.parse(cleanContent);
};

export const getUserDictionary = (): Word[] => {
  const dictionary = localStorage.getItem('userDictionary');
  return dictionary ? JSON.parse(dictionary) : [];
};

export const addWordToDictionary = (word: Word): void => {
  const dictionary = getUserDictionary();
  dictionary.push(word);
  localStorage.setItem('userDictionary', JSON.stringify(dictionary));
};