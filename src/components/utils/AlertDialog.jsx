import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import FocusLock from 'react-focus-lock'
import Button from './Button'
import { VariantIcons } from './icons'

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
    useEffect(() => {
        if (!isOpen) return

        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose?.()
        }

        document.addEventListener('keydown', handleEscape)
        return () => document.removeEventListener('keydown', handleEscape)
    }, [isOpen, onClose])

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
        <FocusLock returnFocus>
            <div
                className="alert-dialog-overlay"
                onClick={handleOverlayClick}
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
                            <Button variant="secondary" onClick={onClose} disabled={isLoading}>
                                {cancelText}
                            </Button>
                        )}
                        <Button
                            variant={variant === 'danger' ? 'danger' : 'primary'}
                            onClick={handleConfirm}
                            isLoading={isLoading}
                        >
                            {confirmText}
                        </Button>
                    </div>
                </div>
            </div>
        </FocusLock>,
        document.body
    )
}

AlertDialogComponent.displayName = 'AlertDialog'

export const AlertDialog = memo(AlertDialogComponent)