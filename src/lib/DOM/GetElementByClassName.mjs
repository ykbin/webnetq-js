export default function(element, className) {
  if (!className)
    return undefined;
  if (element.classList.contains(className))
    return element;
  return element.querySelector("." + className);
};
