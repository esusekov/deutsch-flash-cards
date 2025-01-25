export interface Word {
  id: string;
  word: string;
  translation_ru: string;
  examples: Array<{ de: string; ru: string }>;
}