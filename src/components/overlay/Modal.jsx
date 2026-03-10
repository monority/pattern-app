import React, { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { useBodyScrollLock } from '../tools/useBodyScrollLock'
import Icon from '../utils/Icon'

const FOCUSABLE = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
].join(',')

const Modal = ({
    isOpen = false,
    onClose,
    title,
    description,
    children,
    footer,
    size = 'md',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    className = '',
    ...props
}) => {
    const dialogRef = useRef(null)
    const previousActiveElement = useRef(null)
    const titleId = useId()
    const descriptionId = useId()

    useBodyScrollLock(isOpen)

    const handleClose = useCallback(() => onClose?.(), [onClose])

    // Focus management + restore on close
    useEffect(() => {
        if (!isOpen) return
        previousActiveElement.current = document.activeElement
        const timer = window.setTimeout(() => {
            const focusables = Array.from(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])
                ; (focusables[0] ?? dialogRef.current)?.focus?.()
        }, 0)
        return () => {
            window.clearTimeout(timer)
            previousActiveElement.current?.focus?.()
        }
    }, [isOpen])

    // Escape key (global so it works even if focus is outside)
    useEffect(() => {
        if (!isOpen || !closeOnEscape) return
        const onKeyDown = (e) => { if (e.key === 'Escape') { e.preventDefault(); handleClose() } }
        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [isOpen, closeOnEscape, handleClose])

    // Tab trap — React synthetic event on dialog, no DOM listener needed
    const handleKeyDown = useCallback((e) => {
        if (e.key !== 'Tab' || !dialogRef.current) return
        const focusables = Array.from(dialogRef.current.querySelectorAll(FOCUSABLE))
        if (!focusables.length) { e.preventDefault(); return }
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey) {
            if (document.activeElement === first || document.activeElement === dialogRef.current) {
                e.preventDefault(); last.focus()
            }
        } else {
            if (document.activeElement === last) { e.preventDefault(); first.focus() }
        }
    }, [])

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) handleClose()
    }, [closeOnOverlayClick, handleClose])

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="modal-overlay"
                    onClick={handleOverlayClick}
                    role="presentation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                    <motion.div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={title ? titleId : undefined}
                        aria-describedby={description ? descriptionId : undefined}
                        tabIndex={-1}
                        className={['modal', `modal--${size}`, className].filter(Boolean).join(' ')}
                        onKeyDown={handleKeyDown}
                        initial={{ opacity: 0, y: 16, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.99 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.8 }}
                        {...props}
                    >
                        {(title || showCloseButton) && (
                            <div className="modal__header">
                                {title && <h2 id={titleId} className="modal__title">{title}</h2>}
                                {showCloseButton && (
                                    <button type="button" className="modal__close" onClick={handleClose} aria-label="Close modal">
                                        <Icon type="x" aria-hidden="true" focusable="false" />
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="modal__body">
                            {description && <p id={descriptionId} className="modal__description">{description}</p>}
                            {children}
                        </div>
                        {footer && <div className="modal__footer">{footer}</div>}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

export default Modal
