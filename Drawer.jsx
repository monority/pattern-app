import React, { useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react'
import { createPortal, flushSync } from 'react-dom'
import { useBodyScrollLock } from '../tools/useBodyScrollLock'

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ')

const Drawer = forwardRef((
    { open, onClose, placement = 'right', size = 'md', title, children, footer, closeOnOverlay = true, className = '', ...props },
    ref
) => {
    const titleId = useId()
    const panelRef = useRef(null)
    const lastFocusRef = useRef(null)

    const prefersReducedMotion = useMemo(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return false
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches
    }, [])

    const [isVisible, setIsVisible] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const rafRef = useRef(0)
    const timerRef = useRef(null)

    useEffect(() => {
        if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
        if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 }

        if (open) {
            if (prefersReducedMotion) {
                setIsVisible(true)
                setIsOpen(true)
                return
            }
            flushSync(() => setIsVisible(true))
            rafRef.current = requestAnimationFrame(() => {
                setIsOpen(true)
                rafRef.current = 0
            })
        } else {
            setIsOpen(false)
            if (prefersReducedMotion) { setIsVisible(false); return }
            timerRef.current = setTimeout(() => {
                setIsVisible(false)
                timerRef.current = null
            }, 320)
        }

        return () => {
            if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
            if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = 0 }
        }
    }, [open, prefersReducedMotion])

    useEffect(() => {
        if (isOpen) {
            lastFocusRef.current = document.activeElement
            const el = panelRef.current?.querySelector(FOCUSABLE)
            ;(el ?? panelRef.current)?.focus()
        }
    }, [isOpen])

    useEffect(() => {
        if (!isVisible && lastFocusRef.current) {
            lastFocusRef.current.focus()
            lastFocusRef.current = null
        }
    }, [isVisible])

    const close = useCallback(() => onClose?.(), [onClose])
    useImperativeHandle(ref, () => ({ close }), [close])
    useBodyScrollLock(isVisible)

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') { e.preventDefault(); close(); return }
        if (e.key !== 'Tab' || !panelRef.current) return
        const focusables = Array.from(panelRef.current.querySelectorAll(FOCUSABLE))
        if (!focusables.length) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus()
        }
    }, [close])

    if (!isVisible) return null

    return createPortal(
        <div
            className={['drawer-root', isOpen && 'drawer-root--open'].filter(Boolean).join(' ')}
            aria-hidden={!isOpen}
        >
            <div
                className="drawer__overlay"
                aria-hidden="true"
                onClick={closeOnOverlay ? close : undefined}
            />
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                tabIndex={-1}
                className={['drawer', `drawer--${placement}`, `drawer--${size}`, isOpen && 'drawer--open', className].filter(Boolean).join(' ')}
                onKeyDown={handleKeyDown}
                {...props}
            >
                <div className="drawer__header">
                    {title && <h2 id={titleId} className="drawer__title">{title}</h2>}
                    <button type="button" className="drawer__close" onClick={close} aria-label="Fermer">
                        <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>
                <div className="drawer__content">{children}</div>
                {footer && <div className="drawer__footer">{footer}</div>}
            </div>
        </div>,
        document.body
    )
})

Drawer.displayName = 'Drawer'
export default Drawer