export function toHiccup(node) {
  switch (node.nodeType) {
    case 1: { // Element
      const attrs = {};
      if (node.hasAttributes()) {
        for (const attr of node.attributes)
          attrs[attr.name] = attr.value;
      }
      const result = [ node.tagName.toLowerCase(), attrs ];
      for ( const iter of node.childNodes) {
        const item = toHiccup(iter);
        if (item !== undefined)
          result.push(item);
      }
      return result;
    }

    case 3: { // Text
      const text = node.textContent;
      const trimmed = text.trim();
      return trimmed ? text : undefined;
    }

    default:
      return undefined;
  }
}

function fromHiccupUnsafe(obj, doc) {
  if (typeof obj === "string")
    return doc.createTextNode(obj);
  const elem = doc.createElement(obj[0]);
  for (const [key, val] of Object.entries(obj[1]))
    elem.setAttribute(key, val);
  for (let i = 2; i < obj.length; i++)
    elem.appendChild(fromHiccupUnsafe(obj[i], doc));
  return elem;
}

export function fromHiccup(obj, doc) {
  doc = doc || (typeof document !== "undefined" ? document : undefined);
  return doc ? fromHiccupUnsafe(obj, doc) : undefined;
}
