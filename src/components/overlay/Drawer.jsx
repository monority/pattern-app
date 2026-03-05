import React, { useEffect, useRef, useState, useCallback, forwardRef, useImperativeHandle } from 'react'

const DURATION = 220

const Drawer = forwardRef((
    { open, onClose, placement = 'right', size = 'md', title, children, footer, closeOnOverlay = true, className = '', ...props },
    ref
) => {
    const [shown, setShown] = useState(false) // mounts/unmounts the DOM
    const [animated, setAnimated] = useState(false) // drives CSS transition
    const nodeRef = useRef(null)
    const timerRef = useRef(null)

    // Open: mount → next 2 frames → add --open class
    useEffect(() => {
        if (!open) return
        setShown(true)
        requestAnimationFrame(() =>
            requestAnimationFrame(() => setAnimated(true))
        )
    }, [open])

    // Close: remove --open → wait → unmount → notify parent
    const close = useCallback(() => {
        setAnimated(false)
        timerRef.current = setTimeout(() => {
            setShown(false)
            onClose?.()
        }, DURATION)
    }, [onClose])

    useImperativeHandle(ref, () => ({ close }), [close])

    useEffect(() => () => clearTimeout(timerRef.current), [])

    // Focus trap + keyboard
    useEffect(() => {
        if (!shown) return
        const prev = document.activeElement
        nodeRef.current?.focus()
        const onKey = (e) => e.key === 'Escape' && close()
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
            prev?.focus()
        }
    }, [shown, close])

    if (!shown) return null

    return (
        <div
            className={['drawer-root', animated && 'drawer-root--open'].filter(Boolean).join(' ')}
            aria-hidden={!animated}
        >
            <div className="drawer__overlay" onClick={closeOnOverlay ? close : undefined} aria-hidden="true" />
            <div
                ref={nodeRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className={['drawer', `drawer--${placement}`, `drawer--${size}`, animated && 'drawer--open', className].filter(Boolean).join(' ')}
                {...props}
            >
                <div className="drawer__header">
                    {title && <h2 className="drawer__title">{title}</h2>}
                    <button className="drawer__close" onClick={close} aria-label="Fermer">
                        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="drawer__content">{children}</div>
                {footer && <div className="drawer__footer">{footer}</div>}
            </div>
        </div>
    )
})

export default Drawer
