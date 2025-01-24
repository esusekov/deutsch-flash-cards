import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';
import wordsData from './data/words.json';

interface Word {
  id: string;
  word: string;
  translation_ru: string;
  examples: Array<{ de: string; ru: string }>;
}

function App() {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'in-left' | 'in-right' | 'out-left' | 'out-right' | null>(null);
  useEffect(() => {
    WebApp.ready();
    getRandomWord();
  }, []);

  const getRandomWord = (swipeDirection: 'left' | 'right' = 'right') => {
    const outDirection = swipeDirection === 'left' ? 'out-left' : 'out-right';
    const inDirection = swipeDirection === 'left' ? 'in-left' : 'in-right';
    
    setSlideDirection(outDirection);
    setIsSliding(true);
    
    setTimeout(() => {
      const words = wordsData.words;
      const randomIndex = Math.floor(Math.random() * words.length);
      setCurrentWord(words[randomIndex]);
      setIsFlipped(false);
      setSlideDirection(inDirection);
      
      setTimeout(() => {
        setIsSliding(false);
        setSlideDirection(null);
      }, 300);
    }, 300);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart) return;

    const touchEnd = e.changedTouches[0].clientX;
    const swipeDistance = touchEnd - touchStart;

    if (Math.abs(swipeDistance) > 50) {
      const direction = swipeDistance > 0 ? 'right' : 'left';
      getRandomWord(direction);
    }

    setTouchStart(null);
  };

  if (!currentWord) return <div>Loading...</div>;

  return (
    <div className="app">
      <div
        className={`card ${isFlipped ? 'flipped' : ''} ${isSliding ? `sliding-${slideDirection}` : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="card-inner">
          <div className="card-front">
            <h2>{currentWord.word}</h2>
          </div>
          <div className="card-back">
            <h2>{currentWord.translation_ru}</h2>
            <div className="examples">
              {currentWord.examples.slice(0, 2).map((example, index) => (
                <div key={index} className="example">
                  <p>{example.de}</p>
                  <p>{example.ru}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;