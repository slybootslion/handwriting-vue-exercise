function patchStyle(el, prev, next) {
  const style = el.style;
  if (!next) {
    el.removeAttribute("style");
  } else {
    for (const key in next) {
      style[key] = next[key];
    }
    if (prev) {
      for (const key in prev) {
        if (!next[key]) {
          style[key] = "";
        }
      }
    }
  }
}

function patchClass(el, next) {
  if (!next) next = "";
  el.className = next;
}

function pathAttr(el, key, next) {
  if (!next) {
    el.removeAttribute(key);
  } else {
    el.setAttribute(key, next);
  }
}

function patchProps(el, key, prevVal, nextVal) {
  switch (key) {
    case "style":
      patchStyle(el, prevVal, nextVal);
      break;
    case "className":
      patchClass(el, nextVal);
    default:
      pathAttr(el, key, nextVal);
  }
}

export { patchProps };
