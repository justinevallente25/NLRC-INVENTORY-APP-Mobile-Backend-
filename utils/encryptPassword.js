//utils/encryptPasswrod.js
// ✅ Mimics VB6 ChrW/AscW + overflow exactly
export function func_Encrypt(lcp_s_password) {
  lcp_s_password = lcp_s_password.trim();
  let result = "";

  for (let i = 1; i <= lcp_s_password.length; i++) {
    let ch = lcp_s_password.charCodeAt(i - 1);
    // VB: ChrW(255 - (AscW(char) + i))
    let enc = (255 - ((ch + i) & 0xff)) & 0xffff;
    result += String.fromCharCode(enc);
  }

  return result;
}

export function func_Decrypt(encryptedText) {
  let result = "";

  for (let i = 1; i <= encryptedText.length; i++) {
    let ch = encryptedText.charCodeAt(i - 1);
    // Reverse the same formula
    let dec = (255 - ch - i) & 0xff;
    result += String.fromCharCode(dec);
  }

  return result.trim();
}
