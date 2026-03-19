export const randomDateBetween = (
  start: Date,
  end: Date,
  seed?: number,
): string => {
  const startTime = start.getTime()
  const endTime = end.getTime()

  if (
    Number.isNaN(startTime) ||
    Number.isNaN(endTime) ||
    startTime >= endTime
  ) {
    return String(Date.now())
  }

  let r: number
  if (typeof seed === 'number') {
    const a = 1664525
    const c = 1013904223
    const m = 2 ** 32
    r = ((a * seed + c) % m) / m
  } else {
    r = Math.random()
  }

  const t = Math.floor(startTime + r * (endTime - startTime))
  return String(t) // ✅ parseInt 먹히는 형태
}
