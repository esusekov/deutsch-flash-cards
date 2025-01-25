import { useState } from 'react';
import { generateWordData, addWordToDictionary } from '../services/dictionary';
import { Input, Button, Snackbar, Spinner } from '@telegram-apps/telegram-ui';

function Home() {
  const [newWord, setNewWord] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;

    setIsLoading(true);
    try {
      const wordData = await generateWordData(newWord.trim());
      addWordToDictionary({
        id: newWord.toLowerCase(),
        word: newWord.trim(),
        ...wordData
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding word:', error);
      alert('Failed to add word. Please try again.');
    }
    setIsLoading(false);
    setNewWord('');
  };

  return (
    <div className="home">
      <h1 className='header'>Deutsch Flash Cards</h1>
      <form onSubmit={handleSubmit} className="add-word-form">
        <Input
          type="text"
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter a new German word"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !newWord.trim()}>
          {isLoading ? (
            <Spinner size="s" className='add-word-spinner' />
          ) : (
            'Add Word'
          )}
        </Button>
        {showSuccess && (        
            <Snackbar onClose={() => setShowSuccess(false)}>
                Word added successfully!
            </Snackbar>
        )}
      </form>
    </div>
  );
}

export default Home;