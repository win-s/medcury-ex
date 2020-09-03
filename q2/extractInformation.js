

import { trim, stripSuffix, fromMaybe, match, stripPrefix, remove, splitOnRegex, concat, regex, prop, pipe, chain, map, joinWith } from 'sanctuary';
import { replace } from './util';

const TEXT_PROP='text';
const PHONE_PROP='phone';
const NAME_PROP='name';
const ADDRESS_PROP='address';

const PHONENUMBER_PREFIX='+';
const NAME_PREFIX = '<';
const NAME_SUFFIX = '>';


const getValue = prop(TEXT_PROP);

const removeText = removeTextRegex => pipe([
  getValue,
  splitOnRegex(removeTextRegex),
  joinWith(''),
  removed => ({ [TEXT_PROP]: removed}),
]);

const getInfomation = getInfomationRegex => objectName => pipe([
  getValue,
  match(getInfomationRegex),
  map( prop('match') ),
  map( matched => ({ [objectName]: matched}) ),
  fromMaybe({}),
]);

const concatInfomation = newInformation => newText => pipe([
  remove(TEXT_PROP),
  concat(newInformation),
  concat(newText),
])

export const extractPhone = object => {
  const phoneNumberRegexString = `\\${PHONENUMBER_PREFIX}[0-9]{1,2}-[0-9]{3}-[0-9]{3}-[0-9]{4}`;
  const phoneNubmerRegex = regex('')(phoneNumberRegexString);
  const phoneNubmerRegexGlobal = regex('g')(phoneNumberRegexString);

  const getPhoneNumberWithPrefix = getInfomation (phoneNubmerRegex) (PHONE_PROP) (object);
  const getPhoneNumber = pipe([
    map( stripPrefix (PHONENUMBER_PREFIX) ),
    map( fromMaybe('') ),
  ]) (getPhoneNumberWithPrefix);

  const removePhoneNumberFromText = removeText(phoneNubmerRegexGlobal)(object);

  return concatInfomation (getPhoneNumber) (removePhoneNumberFromText) (object);
}

export const extractName = object => {
  const nameRegexString = `${NAME_PREFIX}.+${NAME_SUFFIX}`;
  const nameRegex = regex('') (nameRegexString);
  const nameRegexGlobal = regex('g') (nameRegexString);

  const getNameWithPrfixSuffix = getInfomation(nameRegex) (NAME_PROP) (object);
  const getName = pipe([
    map( stripPrefix (NAME_PREFIX) ),
    map( chain( stripSuffix (NAME_SUFFIX) ) ),
    map( fromMaybe('') ),
  ]) (getNameWithPrfixSuffix)

  const removeNameFromText = removeText(nameRegexGlobal) (object);

  return concatInfomation(getName) (removeNameFromText) (object);
}

export const extractAddress = object =>{
  const nonAlphaNumericRegex = /[^0-9a-z.-]/gi;
  const allSpaceRegex = / +/g;
  const getAddress = pipe([
    getValue,
    replace(nonAlphaNumericRegex) (' '),
    replace(allSpaceRegex) (' '),
    trim,
    address => ({[ADDRESS_PROP]:address } ),
  ])(object)

  return concatInfomation(getAddress) ( {[TEXT_PROP]:''} ) (object);
}

export const phoneObjectToString  = object => `Phone => ${object[PHONE_PROP]}, Name => ${object[NAME_PROP]}, Address => ${object[ADDRESS_PROP]}`
