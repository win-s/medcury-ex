
import { isLeft, fromMaybe, fromLeft, fromRight, head, pipe, chain, lines, filter, Left, Right, map} from 'sanctuary';
import { extractPhone, extractName, extractAddress, phoneObjectToString } from './extractInformation';

const searchPhoneNumberFormat = phoneNumber => `+${phoneNumber}`;
const isPhoneNumberExist = phoneNumber => name => name.indexOf( searchPhoneNumberFormat(phoneNumber) ) !== -1;

const notFound = array => array.length === 0;
const notFoundErrorMessage = phoneNumber => Left(`Error => Not found: ${phoneNumber}`);
const tooManyPeople = array => array.length > 1;
const tooManyPeopleErrorMessage = phoneNumber => Left(`Error => Too many people: ${phoneNumber}`);

const findPeople = phoneNumber => pipe([
  lines,
  filter ( isPhoneNumberExist(phoneNumber) ),
]);
const detectError = phoneNumber => pipe([
  Right,
  chain ( right => notFound(right) ? notFoundErrorMessage(phoneNumber): Right(right) ),
  chain ( right => tooManyPeople(right) ? tooManyPeopleErrorMessage(phoneNumber): Right(right) ),
]);
const extractPeopleText = pipe([
  fromRight([]),
  head,
]);
const extractPeopleDetail = pipe([
  map( text => ({ text }) ),
  map( extractPhone ),
  map( extractName ),
  map( extractAddress ),
  map( phoneObjectToString ),
  fromMaybe(''),
]);



export const phone = (directoryString, phoneNumber) => {

  const foundPeople = findPeople(phoneNumber)(directoryString);
  const eitherErrorOrText = detectError(phoneNumber) ( foundPeople );

  // has an error
  if( isLeft( eitherErrorOrText ) ){
    return fromLeft ('') (eitherErrorOrText);
  }

  const foundPeopleText = extractPeopleText(eitherErrorOrText);
  return extractPeopleDetail( foundPeopleText );

};