import {splitOnRegex,pipe, trim, join, joinWith, maybe} from 'sanctuary';

const stringDecoder = pipe([
  splitOnRegex(/(WUB)+/g),
  joinWith(' '),
  trim
]);

export const songDecoder = stringDecoder;