
import { assert } from 'chai';
import { songDecoder } from './stringDecode';

describe('question 1 stringDecode', () => {

  describe('expected from user story', () => {

    it('WUB should be replaced by 1 space', () => {
      assert.equal(songDecoder('AWUBBWUBC'), 'A B C');
    });

    it('multiples WUB should be replaced by only 1 space', () => {
      assert.equal(songDecoder('AWUBWUBWUBBWUBWUBWUBC'), 'A B C',);
    });

    it('heading or trailing spaces should be removed', () => {
      assert.equal(songDecoder('WUBAWUBBWUBCWUB'), 'A B C');
    });
  });
});
