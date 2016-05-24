/* tslint:disable:no-string-literal */

const IS_FOCUSABLE_ATTRIBUTE = 'data-is-focusable';
const FOCUSZONE_ID_ATTRIBUTE = 'data-focuszone-id';

export function getFirstFocusable(
  rootElement: HTMLElement,
  currentElement: HTMLElement,
  includeElementsInFocusZones?: boolean,
  includeInputElements?: boolean): HTMLElement {

  return getNextElement(rootElement, currentElement, true, false, false, includeElementsInFocusZones, includeInputElements);
}

export function getLastFocusable(
  rootElement: HTMLElement,
  currentElement: HTMLElement,
  includeElementsInFocusZones?: boolean,
  includeInputElements?: boolean): HTMLElement {

  return getPreviousElement(rootElement, currentElement, true, false, true, includeElementsInFocusZones, includeInputElements);
}

/** Traverse to find the previous element. */
export function getPreviousElement(
  rootElement: HTMLElement,
  currentElement: HTMLElement,
  checkNode?: boolean,
  suppressParentTraversal?: boolean,
  traverseChildren?: boolean,
  includeElementsInFocusZones?: boolean,
  includeInputElements?: boolean): HTMLElement {

  if (!currentElement ||
    currentElement === rootElement) {
    return null;
  }

  let isCurrentElementVisible = isElementVisible(currentElement);

  // Check its children.
  if (traverseChildren && (includeElementsInFocusZones || !isElementFocusZone(currentElement)) && isCurrentElementVisible) {
    const childMatch = getPreviousElement(rootElement, currentElement.lastElementChild as HTMLElement, true, true, true, includeElementsInFocusZones, includeInputElements);

    if (childMatch) {
      return childMatch;
    }
  }

  // Check the current node, if it's not the first traversal.
  if (checkNode && isCurrentElementVisible && isElementTabbable(currentElement, includeInputElements)) {
    return currentElement;
  }

  // Check its previous sibling.
  const siblingMatch = getPreviousElement(rootElement, currentElement.previousElementSibling as HTMLElement, true, true, true, includeElementsInFocusZones, includeInputElements);

  if (siblingMatch) {
    return siblingMatch;
  }

  // Check its parent.
  if (!suppressParentTraversal) {
    return getPreviousElement(rootElement, currentElement.parentElement, true, false, false, includeElementsInFocusZones, includeInputElements);
  }

  return null;
}

/** Traverse to find the next focusable element. */
export function getNextElement(
  rootElement: HTMLElement,
  currentElement: HTMLElement,
  checkNode?: boolean,
  suppressParentTraversal?: boolean,
  suppressChildTraversal?: boolean,
  includeElementsInFocusZones?: boolean,
  includeInputElements?: boolean): HTMLElement {

  if (
    !currentElement ||
    (currentElement === rootElement && suppressChildTraversal)) {
    return null;
  }

  let isCurrentElementVisible = isElementVisible(currentElement);

  // Check the current node, if it's not the first traversal.
  if (checkNode && isCurrentElementVisible && isElementTabbable(currentElement, includeInputElements) ) {
    return currentElement;
  }

  // Check its children.
  if (!suppressChildTraversal && isCurrentElementVisible && (includeElementsInFocusZones || !isElementFocusZone(currentElement))) {
    const childMatch = getNextElement(rootElement, currentElement.firstElementChild as HTMLElement, true, true, false, includeElementsInFocusZones, includeInputElements);

    if (childMatch) {
      return childMatch;
    }
  }

  if (currentElement === rootElement) {
    return null;
  }

  // Check its sibling.
  const siblingMatch = getNextElement(rootElement, currentElement.nextElementSibling as HTMLElement, true, true, false, includeElementsInFocusZones, includeInputElements);

  if (siblingMatch) {
    return siblingMatch;
  }

  if (!suppressParentTraversal) {
    return getNextElement(rootElement, currentElement.parentElement, false, false, true, includeElementsInFocusZones, includeInputElements);
  }

  return null;
}

export function isElementVisible(element: HTMLElement): boolean {
  return (
    !!element &&
    (element.offsetParent !== null ||
    (element as any).isVisible === true) // used as a workaround for testing.
  );
}

export function isElementTabbable(element: HTMLElement, includeInput?: boolean): boolean {
  return (
    !!element &&
    (element.tagName === 'A' ||
      (element.tagName === 'BUTTON' && !(element as HTMLButtonElement).disabled) ||
      (includeInput && element.tagName === 'INPUT' && !(element as HTMLButtonElement).disabled) ||
      (element.getAttribute && element.getAttribute(IS_FOCUSABLE_ATTRIBUTE) === 'true')));
}

export function isElementFocusZone(element?: HTMLElement): boolean {
  return element && !!element.getAttribute(FOCUSZONE_ID_ATTRIBUTE);
}