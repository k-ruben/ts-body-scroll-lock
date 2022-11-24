import {
  registerLockIdOnBody,
  registerLockIdOnElement,
  lockBodyScroll,
  removeAllScrollLocks,
  lockContentScrollElement,
  removeScrollLock, getLockContentScrollResizeObserver,
} from "./lib";

export {
  removeScrollLock,
  useBodyScrollLock,
  lockBodyScroll,
  removeAllScrollLocks,
};

export default function useBodyScrollLock(
  id: string,
  containerElement: HTMLElement,
  scrollContentElement?: HTMLElement
) {
  registerLockIdOnBody(id);
  registerLockIdOnElement(containerElement, id);
  lockBodyScroll();

  console.log(scrollContentElement);

  const observer = getLockContentScrollResizeObserver()
  if (scrollContentElement && observer) {
    lockContentScrollElement(containerElement, scrollContentElement);
    Array.from(scrollContentElement.children).forEach((child: Element) => {
      console.log(child);
      observer.observe(child)
    })
  }

  return {
    removeScrollLock: () => removeScrollLock(containerElement, observer),
    removeAllScrollLocks: () => removeAllScrollLocks(observer),
  };
}
