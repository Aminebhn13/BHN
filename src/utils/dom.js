export const qs = (selector, parent = document) => parent.querySelector(selector)
export const qsa = (selector, parent = document) => [...parent.querySelectorAll(selector)]

export const on = (el, event, handler, options) => el.addEventListener(event, handler, options)

export const off = (el, event, handler) => el.removeEventListener(event, handler)

export const addClass = (el, ...classes) => el.classList.add(...classes)
export const removeClass = (el, ...classes) => el.classList.remove(...classes)
export const toggleClass = (el, cls) => el.classList.toggle(cls)
export const hasClass = (el, cls) => el.classList.contains(cls)
