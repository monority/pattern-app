import React, { memo, useCallback, useEffect, useId, useMemo, useRef } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import Button from './Button'
import { VariantIcons } from './VariantIcons'
import { useBodyScrollLock } from '../tools/useBodyScrollLock'

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
    const cancelRef = useRef(null)
    const confirmRef = useRef(null)
    const previousActiveElement = useRef(null)
    const titleId = useId()
    const descriptionId = useId()

    const setConfirmRef = useCallback((node) => {
        confirmRef.current = node
    }, [])

    useBodyScrollLock(isOpen)

    // Focus management + restore
    useEffect(() => {
        if (!isOpen) return
        previousActiveElement.current = document.activeElement
        // Focus cancel first (safety for destructive dialogs); fallback to confirm
        const toFocus = showCancel && cancelRef.current && !cancelRef.current.disabled
            ? cancelRef.current
            : confirmRef.current
        toFocus?.focus?.()
        return () => {
            previousActiveElement.current?.focus?.()
            previousActiveElement.current = null
        }
    }, [isOpen, showCancel])

    // Tab trap — DOM order: [confirm, cancel]
    // Shift+Tab from confirm (first) wraps to cancel (last); Tab from cancel (last) wraps to confirm (first)
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') { onClose?.(); return }
        if (e.key !== 'Tab') return
        if (e.shiftKey) {
            if (document.activeElement === confirmRef.current) {
                e.preventDefault(); cancelRef.current?.focus()
            }
        } else {
            if (document.activeElement === cancelRef.current) {
                e.preventDefault(); confirmRef.current?.focus()
            }
        }
    }, [onClose])

    const handleOverlayClick = useCallback((e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) onClose?.()
    }, [closeOnOverlayClick, onClose])

    const handleConfirm = useCallback(async () => {
        await onConfirm?.()
        if (!isLoading) onClose?.()
    }, [onConfirm, onClose, isLoading])

    const renderedIcon = useMemo(() => icon ?? VariantIcons[variant], [icon, variant])

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="alert-dialog-overlay"
                    onClick={handleOverlayClick}
                    onKeyDown={handleKeyDown}
                    role="presentation"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22, ease: 'easeOut' }}
                >
                    <motion.div
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        aria-describedby={description ? descriptionId : undefined}
                        className={`alert-dialog alert-dialog-${variant}`}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ type: 'spring', stiffness: 380, damping: 36, mass: 0.8 }}
                    >
                        <div className="alert-dialog-header">
                            {renderedIcon && <div className="alert-dialog-icon">{renderedIcon}</div>}
                            <h2 id={titleId} className="alert-dialog-title">{title}</h2>
                        </div>
                        <div className="alert-dialog-body">
                            {description && <p id={descriptionId} className="alert-dialog-description">{description}</p>}
                            {children}
                        </div>
                        <div className="alert-dialog-footer">
                            <Button
                                ref={setConfirmRef}
                                variant={variant === 'danger' ? 'danger' : 'primary'}
                                onClick={handleConfirm}
                                isLoading={isLoading}
                            >
                                {confirmText}
                            </Button>
                            {showCancel && (
                                <Button ref={cancelRef} variant="secondary" onClick={onClose} disabled={isLoading}>
                                    {cancelText}
                                </Button>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}

AlertDialogComponent.displayName = 'AlertDialog'

export const AlertDialog = memo(AlertDialogComponent)
