import { useState, useEffect } from 'react';
import { getUserDictionary } from '../services/dictionary';
import { Word } from '../types/word';
import { useSwipeable } from 'react-swipeable';
import { LargeTitle } from '@telegram-apps/telegram-ui';

function Practice() {
  const [cards, setCards] = useState<Word[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const words = getUserDictionary();
    if (words.length > 0) {
      // Initialize with two random cards
      const firstIndex = Math.floor(Math.random() * words.length);
      const firstCard = words[firstIndex];
      
      const remainingWords = words.filter((_, index) => index !== firstIndex);
      if (remainingWords.length > 0) {
        const secondIndex = Math.floor(Math.random() * remainingWords.length);
        const secondCard = remainingWords[secondIndex];
        setCards([firstCard, secondCard]);
      } else {
        setCards([firstCard]);
      }
    }
  }, []);

  const getNextCard = () => {
    const words = getUserDictionary();
    const availableWords = words.filter(w => !cards.some(card => card.word === w.word));
    
    if (availableWords.length > 0) {
      return availableWords[Math.floor(Math.random() * availableWords.length)];
    } else if (words.length > 0) {
      return words[Math.floor(Math.random() * words.length)];
    }
    return null;
  };

  const handleCardSwipe = (direction: 'left' | 'right') => {
    if (isAnimating || cards.length === 0) return;

    setIsAnimating(true);
    setSlideDirection(direction);
    setIsDragging(false);
    setDragOffset(0);

    // Wait for the exit animation to complete
    setTimeout(() => {
      const nextCard = getNextCard();
      setCards(prevCards => {
        const newCards = prevCards.slice(1);
        if (nextCard) {
          newCards.push(nextCard);
        }
        return newCards;
      });
      setIsFlipped(false);
      setIsAnimating(false);
      setSlideDirection(null);
    }, 300); // Match this with CSS animation duration
  };

  const handlers = useSwipeable({
    onSwiping: (e) => {
      if (isAnimating) return;
      setIsDragging(true);
      setDragOffset(e.deltaX);
    },
    onSwiped: (e) => {
      if (isAnimating) return;
      const swipeThreshold = 50;
      if (Math.abs(e.deltaX) > swipeThreshold) {
        const direction = e.deltaX > 0 ? 'right' : 'left';
        handleCardSwipe(direction);
      } else {
        setIsDragging(false);
        setDragOffset(0);
      }
    },
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
    delta: 10,
    swipeDuration: 500,
  });

  return (
    <div className="practice">
      <div className="card-stack">
        {cards.map((card, index) => (
          <div
            key={card.word}
            className={`card ${index === 0 ? 'front-card' : 'back-card'} 
              ${index === 0 && isFlipped ? 'flipped' : ''}
              ${index === 0 && slideDirection ? `slide-${slideDirection}` : ''}
              ${index === 0 && isDragging ? 'dragging' : ''}`}
            style={index === 0 && isDragging ? { transform: `translateX(${dragOffset}px)` } : undefined}
            onClick={() => index === 0 && setIsFlipped(!isFlipped)}
            {...(index === 0 ? handlers : {})}
          >
            <div className="card-front">
                <LargeTitle weight="2">
                    {card.word}
                </LargeTitle>
            </div>
            <div className="card-back">
              <div className="translation">{card.translation_ru}</div>
              <div className="examples">
                {card.examples.map((example, i) => (
                  <div key={i} className="example">
                    <div className="german">{example.de}</div>
                    <div className="russian">{example.ru}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Practice;