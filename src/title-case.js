// Display formatting only; source titles and citations remain unchanged.
const minorWords = new Set(['a','an','and','as','at','but','by','for','from','in','into','nor','of','on','onto','or','over','the','to','under','via','with','without']);
export function titleCase(value) {
 const text = String(value ?? '');
 const pattern = /\p{L}[\p{L}\p{N}'’]*/gu;
 const words = [...text.matchAll(pattern)];
 if (!words.length) return text;
 return text.replace(pattern, (word, offset) => {
  const boundary = offset === words[0].index || offset === words.at(-1).index || /[:—–]\s*$/u.test(text.slice(0, offset));
  if (!boundary && minorWords.has(word.toLowerCase())) return word.toLowerCase();
  return word[0].toUpperCase() + word.slice(1);
 });
}
