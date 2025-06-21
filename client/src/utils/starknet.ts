export const stringToFelt = (str: string) => {
  // For short strings, convert directly to a single felt
  if (str.length <= 31) {
    const hexString = str
      .split("")
      .reduce((memo, c) => memo + c.charCodeAt(0).toString(16), "");
    return BigInt("0x" + hexString);
  }

  // For longer strings, split into multiple felts (though this shouldn't be needed for usernames)
  const size = Math.ceil(str.length / 31);
  const arr = Array(size);

  let offset = 0;
  for (let i = 0; i < size; i++) {
    const substr = str.substring(offset, offset + 31).split("");
    const ss = substr.reduce(
      (memo, c) => memo + c.charCodeAt(0).toString(16),
      ""
    );
    arr[i] = BigInt("0x" + ss);
    offset += 31;
  }
  return arr;
};
