export const lerp = (a, b, t) => a + (b - a) * t

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export const map = (value, inMin, inMax, outMin, outMax) => {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin)
}

export const randFloat = (min, max) => Math.random() * (max - min) + min

export const randInt = (min, max) => Math.floor(randFloat(min, max + 1))

export const degToRad = (deg) => deg * (Math.PI / 180)
