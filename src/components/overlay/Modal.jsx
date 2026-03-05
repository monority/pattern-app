import React, { useCallback, useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'

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

    const handleClose = useCallback(() => {
        onClose?.()
    }, [onClose])

    useEffect(() => {
        if (!isOpen) return

        previousActiveElement.current = document.activeElement
        document.body.style.overflow = 'hidden'
        dialogRef.current?.focus()

        return () => {
            document.body.style.overflow = ''
            previousActiveElement.current?.focus?.()
        }
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
                            <button className="modal__close" onClick={handleClose} aria-label="Close modal">
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
