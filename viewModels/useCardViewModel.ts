import { useState } from 'react';
import { Deck } from '../models/Deck';
import { Flashcard } from '../models/Flashcard';

const deck = new Deck();

export function useCardViewModel() {
  const [flashcard, setFlashcard] = useState<Flashcard>(deck.drawRandomCard());

  function drawNewCard() {
    setFlashcard(deck.drawRandomCard());
  }

  return { flashcard, drawNewCard };
}
