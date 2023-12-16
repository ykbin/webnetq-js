let uintCount = 0;
const nextUint = () => {
  uintCount = Math.max(uintCount + 1, 1);
  return uintCount;
};

let idCount = 0;
const nextElementId = () => {
  idCount = Math.max(idCount + 1, 1);
  return "id" + idCount.toString().padStart(5, '0');
};

const nextPathComponent = (length) => {
  length = length || 16;

  const map  = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

  let result = '';
  for (let i = 0; i < length; i++) {
    result += map.charAt(Math.floor(Math.random() * map.length));
  }

  return result;
}

export default {
  nextUint,
  nextElementId,
  nextPathComponent,
};
