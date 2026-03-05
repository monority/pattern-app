import React, { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '../tools/useBodyScrollLock'

const getFocusableElements = (container) => {
    if (!container) return []

    const selectors = [
        'a[href]',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
    ]

    const elements = Array.from(container.querySelectorAll(selectors.join(',')))
    return elements.filter((el) => {
        if (!(el instanceof HTMLElement)) return false
        if (el.hasAttribute('disabled')) return false
        if (el.getAttribute('aria-hidden') === 'true') return false
        if (el.tabIndex < 0) return false
        return true
    })
}

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

    const handleClose = useCallback(() => {
        onClose?.()
    }, [onClose])

    useEffect(() => {
        if (!isOpen) return

        previousActiveElement.current = document.activeElement

        const focusTimer = window.setTimeout(() => {
            const focusables = getFocusableElements(dialogRef.current)
            ;(focusables[0] ?? dialogRef.current)?.focus?.()
        }, 0)

        return () => {
            window.clearTimeout(focusTimer)
            previousActiveElement.current?.focus?.()
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const node = dialogRef.current
        if (!node) return

        const onKeyDown = (event) => {
            if (event.key !== 'Tab') return

            const focusables = getFocusableElements(node)
            if (!focusables.length) {
                event.preventDefault()
                node.focus()
                return
            }

            const first = focusables[0]
            const last = focusables[focusables.length - 1]
            const active = document.activeElement

            if (event.shiftKey) {
                if (active === first || active === node) {
                    event.preventDefault()
                    last.focus()
                }
            } else {
                if (active === last) {
                    event.preventDefault()
                    first.focus()
                }
            }
        }

        node.addEventListener('keydown', onKeyDown)
        return () => node.removeEventListener('keydown', onKeyDown)
    }, [isOpen])

    useEffect(() => {
        if (!isOpen || !closeOnEscape) return

        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.preventDefault()
                handleClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, closeOnEscape, handleClose])

    const handleOverlayClick = useCallback((event) => {
        if (event.target === event.currentTarget && closeOnOverlayClick) {
            handleClose()
        }
    }, [closeOnOverlayClick, handleClose])

    if (!isOpen) return null

    return createPortal(
        <div className="modal-overlay" onClick={handleOverlayClick} role="presentation">
            <div
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descriptionId : undefined}
                tabIndex={-1}
                className={[
                    'modal',
                    `modal--${size}`,
                    className,
                ].filter(Boolean).join(' ')}
                {...props}
            >
                {(title || showCloseButton) && (
                    <div className="modal__header">
                        {title && <h2 id={titleId} className="modal__title">{title}</h2>}
                        {showCloseButton && (
                            <button type="button" className="modal__close" onClick={handleClose} aria-label="Close modal">
                                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                        )}
                    </div>
                )}

                <div className="modal__body">
                    {description && <p id={descriptionId} className="modal__description">{description}</p>}
                    {children}
                </div>

                {footer && <div className="modal__footer">{footer}</div>}
            </div>
        </div>,
        document.body
    )
}

export default Modal
