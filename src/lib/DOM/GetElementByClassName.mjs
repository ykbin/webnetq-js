export default function(element, className) {
  if (!className)
    return null;
  if (element.classList.contains(className))
    return element;
  return element.querySelector("." + className);
};
