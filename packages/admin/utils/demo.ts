export const IS_DEMO = true

export const demoAlert = () => {
  console.log('[DEMO MODE] 기능 제한')
  alert('데모 모드에서는 준비 중인 기능입니다 🙂')
}

export const withDemoGuard = <T extends any[], R>(fn: (...args: T) => R) => {
  return (...args: T): R | void => {
    if (IS_DEMO) {
      demoAlert()
      return
    }

    return fn(...args)
  }
}
