
import { curry3 } from 'sanctuary';

export const replace = curry3( (regex, replacment, string) => string.replace(regex,replacment) );

// using for debug only
export const debug = right => { console.log(right); return right;}