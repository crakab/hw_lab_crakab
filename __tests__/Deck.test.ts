import { Deck } from '../models/Deck';

describe('Deck', () => {
  test('deck has 22 cards', () => {
    const deck = new Deck();
    expect(deck.cards.length).toBe(22);
  });

  test('every card has a non-empty command and definition', () => {
    const deck = new Deck();
    for (const card of deck.cards) {
      expect(card.command.length).toBeGreaterThan(0);
      expect(card.definition.length).toBeGreaterThan(0);
    }
  });

  test('drawRandomCard returns a card that is in the deck', () => {
    const deck = new Deck();
    const card = deck.drawRandomCard();
    expect(deck.cards.some((c) => c.command === card.command)).toBe(true);
  });
});
