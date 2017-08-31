import base62 from 'base62';


export function getFileKey () {
  base62.setCharacterSet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz');
  let code = String(Date.now() / 7173 + Math.random(0, 1) * 17779);
  return code.substr(0, 8);
}