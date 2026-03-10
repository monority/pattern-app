import React, { useCallback, useEffect, useId, useImperativeHandle, useRef, forwardRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useBodyScrollLock } from '../tools/useBodyScrollLock'
import Icon from '../utils/Icon'

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ')

// Variantes d'animation par placement
const panelVariants = {
    right: { hidden: { x: '100%' }, visible: { x: 0 } },
    left: { hidden: { x: '-100%' }, visible: { x: 0 } },
    top: { hidden: { y: '-100%' }, visible: { y: 0 } },
    bottom: { hidden: { y: '100%' }, visible: { y: 0 } },
}

const spring = { type: 'spring', stiffness: 320, damping: 32, mass: 0.9 }
const fastOut = { type: 'tween', ease: [0.55, 0, 1, 0.45], duration: 0.22 }

const Drawer = forwardRef((
    { open, onClose, placement = 'right', size = 'md', title, children, footer, closeOnOverlay = true, className = '', ...props },
    ref
) => {
    const titleId = useId()
    const panelRef = useRef(null)
    const lastFocusRef = useRef(null)

    useBodyScrollLock(open)

    // Focus trap + restore
    useEffect(() => {
        if (!open) return
        lastFocusRef.current = document.activeElement
        const el = panelRef.current?.querySelector(FOCUSABLE)
            ; (el ?? panelRef.current)?.focus()
        return () => { lastFocusRef.current?.focus(); lastFocusRef.current = null }
    }, [open])

    const close = useCallback(() => onClose?.(), [onClose])
    useImperativeHandle(ref, () => ({ close }), [close])

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

    const { hidden, visible } = panelVariants[placement] ?? panelVariants.right

    return createPortal(
        <AnimatePresence>
            {open && (
                <div className="drawer-root" aria-hidden={false}>
                    {/* Overlay */}
                    <motion.div
                        className="drawer__overlay"
                        aria-hidden="true"
                        onClick={closeOnOverlay ? close : undefined}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                    />

                    {/* Panel */}
                    <motion.div
                        ref={panelRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? titleId : undefined}
                        tabIndex={-1}
                        className={['drawer', `drawer--${placement}`, `drawer--${size}`, className].filter(Boolean).join(' ')}
                        onKeyDown={handleKeyDown}
                        initial={hidden}
                        animate={{ ...visible, transition: spring }}
                        exit={{ ...hidden, transition: fastOut }}
                        {...props}
                    >
                        <div className="drawer__header">
                            {title && <h2 id={titleId} className="drawer__title">{title}</h2>}
                            <button type="button" className="drawer__close" onClick={close} aria-label="Fermer">
                                <Icon type="x" strokeWidth={2.5} aria-hidden="true" focusable="false" />
                            </button>
                        </div>
                        <div className="drawer__content">{children}</div>
                        {footer && <div className="drawer__footer">{footer}</div>}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    )
})

Drawer.displayName = 'Drawer'
export default Drawer
