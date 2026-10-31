// Z85's ASCII alphabet has no JSON escapes and stores four bytes in five
// characters. A leading padding count lets the last group keep any byte length.
const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#';

export function encodeEmbeddedAsset(bytes) {
  const padding = (4 - bytes.length % 4) % 4;
  const groups = [String(padding)];
  for (let i = 0; i < bytes.length; i += 4) {
    let value = 0;
    for (let j = 0; j < 4; j++) value = value * 256 + (bytes[i + j] ?? 0);
    let group = '';
    for (let j = 0; j < 5; j++) {
      group = alphabet[value % 85] + group;
      value = Math.floor(value / 85);
    }
    groups.push(group);
  }
  return groups.join('');
}

// Self-contained: this exact function is emitted into the Worker.
export function decodeEmbeddedAsset(encoded) {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#';
  const digits = new Uint8Array(128);
  for (let i = 0; i < alphabet.length; i++) digits[alphabet.charCodeAt(i)] = i;
  const bytes = new Uint8Array((encoded.length - 1) / 5 * 4 - Number(encoded[0]));
  let offset = 0;
  for (let i = 1; i < encoded.length; i += 5) {
    let value = 0;
    for (let j = 0; j < 5; j++) value = value * 85 + digits[encoded.charCodeAt(i + j)];
    for (let j = 3; j >= 0; j--) {
      if (offset + j < bytes.length) bytes[offset + j] = value % 256;
      value = Math.floor(value / 256);
    }
    offset += 4;
  }
  return bytes;
}
