import { hasProfanity } from '@/lib/profanity';

describe('Profanity Filter (hasProfanity)', () => {
  describe('Clean/valid Inputs', () => {
    test('should return false for normal programming related sentences', () => {
      expect(hasProfanity('This is a great binary tree visualization! Help me understand.')).toBe(false);
      expect(hasProfanity('How does selection sort work?')).toBe(false);
    });

    test('should return false for words that are parts of other benign words', () => {
      expect(hasProfanity('Scunthorpe is a town in England.')).toBe(false); // Scunthorpe problem
      expect(hasProfanity('Penalize is a common word.')).toBe(false);
      expect(hasProfanity('Associate is also fine.')).toBe(false);
    });
  });

  describe('Profane Inputs', () => {
    test('should return true for standard profanity words', () => {
      expect(hasProfanity('shit')).toBe(true);
      expect(hasProfanity('fuck')).toBe(true);
      expect(hasProfanity('bitch')).toBe(true);
      expect(hasProfanity('asshole')).toBe(true);
    });

    test('should return true for profanity embedded in a sentence', () => {
      expect(hasProfanity('This is fucking awesome!')).toBe(true);
      expect(hasProfanity('You are a piece of shit.')).toBe(true);
    });

    test('should be case-insensitive', () => {
      expect(hasProfanity('SHIT')).toBe(true);
      expect(hasProfanity('FuCk')).toBe(true);
      expect(hasProfanity('BITCH')).toBe(true);
    });

    test('should detect profanity with character substitutions', () => {
      expect(hasProfanity('sh!t')).toBe(true);
      expect(hasProfanity('f*ck')).toBe(true);
      expect(hasProfanity('b1tch')).toBe(true);
      expect(hasProfanity('4sshole')).toBe(true);
    });

    test('should detect profanity with character repetition and accents', () => {
      expect(hasProfanity('fuuuuuck')).toBe(true);
      expect(hasProfanity('fûck')).toBe(true);
    });
  });
});
