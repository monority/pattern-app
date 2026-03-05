import { useEffect } from 'react'

let lockCount = 0
let previousOverflow = null
let previousPaddingRight = null
let appliedPaddingRight = false

const getScrollbarWidth = () => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return 0
    return Math.max(0, window.innerWidth - document.documentElement.clientWidth)
}

const lock = () => {
    if (typeof document === 'undefined') return () => {}

    if (lockCount === 0) {
        previousOverflow = document.body.style.overflow
        previousPaddingRight = document.body.style.paddingRight

        const scrollbarWidth = getScrollbarWidth()
        if (scrollbarWidth > 0) {
            const computedPaddingRight = Number.parseFloat(window.getComputedStyle(document.body).paddingRight) || 0
            document.body.style.paddingRight = `${computedPaddingRight + scrollbarWidth}px`
            appliedPaddingRight = true
        } else {
            appliedPaddingRight = false
        }

        document.body.style.overflow = 'hidden'
    }

    lockCount += 1

    return () => {
        if (typeof document === 'undefined') return

        lockCount = Math.max(0, lockCount - 1)
        if (lockCount === 0) {
            document.body.style.overflow = previousOverflow ?? ''
            previousOverflow = null

            if (appliedPaddingRight) {
                document.body.style.paddingRight = previousPaddingRight ?? ''
            }
            previousPaddingRight = null
            appliedPaddingRight = false
        }
    }
}

export const useBodyScrollLock = (isLocked) => {
    useEffect(() => {
        if (!isLocked) return
        return lock()
    }, [isLocked])
}
