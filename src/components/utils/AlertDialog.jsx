import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import Button from './Button'
import { VariantIcons } from './VariantIcons'

const AlertDialogComponent = ({
    isOpen = false,
    onClose,
    onConfirm,
    title = 'Confirm Action',
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'danger',
    isLoading = false,
    closeOnOverlayClick = true,
    showCancel = true,
    icon,
    children,
}) => {
    const firstFocusRef = useRef(null)
    const lastFocusRef = useRef(null)
    const previousActiveElement = useRef(null)

    useEffect(() => {
        if (isOpen) {
            previousActiveElement.current = document.activeElement
            firstFocusRef.current?.focus()
        } else if (previousActiveElement.current) {
            previousActiveElement.current.focus()
            previousActiveElement.current = null
        }
    }, [isOpen])

    useEffect(() => {
        if (!isOpen) return

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose?.()
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

    const handleKeyDown = useCallback((e) => {
        if (e.key !== 'Tab') return

        if (e.shiftKey) {
            if (document.activeElement === firstFocusRef.current) {
                e.preventDefault()
                lastFocusRef.current?.focus()
            }
        } else {
            if (document.activeElement === lastFocusRef.current) {
                e.preventDefault()
                firstFocusRef.current?.focus()
            }
        }
    }, [])

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) {
            onClose?.()
        }
    }, [closeOnOverlayClick, onClose])

    const handleConfirm = useCallback(async () => {
        await onConfirm?.()
        if (!isLoading) onClose?.()
    }, [onConfirm, onClose, isLoading])

    const renderedIcon = useMemo(
        () => icon ?? VariantIcons[variant],
        [icon, variant]
    )

    if (!isOpen) return null

    return createPortal(
        <div
            className="alert-dialog-overlay"
            onClick={handleOverlayClick}
            onKeyDown={handleKeyDown}
            role="presentation"
        >
            <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="alert-dialog-title"
                aria-describedby={description ? 'alert-dialog-description' : undefined}
                className={`alert-dialog alert-dialog-${variant}`}
            >
                <div className="alert-dialog-header">
                    {renderedIcon && (
                        <div className="alert-dialog-icon">{renderedIcon}</div>
                    )}
                    <h2 id="alert-dialog-title" className="alert-dialog-title">
                        {title}
                    </h2>
                </div>

                <div className="alert-dialog-body">
                    {description && (
                        <p id="alert-dialog-description" className="alert-dialog-description">
                            {description}
                        </p>
                    )}
                    {children}
                </div>

                <div className="alert-dialog-footer">
                    {showCancel && (
                        <Button
                            ref={firstFocusRef}
                            variant="secondary"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            {cancelText}
                        </Button>
                    )}
                    <Button
                        ref={showCancel ? lastFocusRef : firstFocusRef}
                        variant={variant === 'danger' ? 'danger' : 'primary'}
                        onClick={handleConfirm}
                        isLoading={isLoading}
                    >
                        {confirmText}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    )
}

AlertDialogComponent.displayName = 'AlertDialog'

export const AlertDialog = memo(AlertDialogComponent)