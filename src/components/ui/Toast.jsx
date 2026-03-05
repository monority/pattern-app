/* eslint-disable react-refresh/only-export-components */
import React, { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const ToastContext = createContext(null)

const DEFAULT_DURATION = 3500
const DEFAULT_MAX = 5

const variantToRole = (variant) => {
    if (variant === 'danger') return 'alert'
    return 'status'
}

const ToastItem = memo(function ToastItem({ toast, onDismiss }) {
    const { id, title, description, variant = 'info', duration = DEFAULT_DURATION, actionLabel, onAction } = toast
    const timerRef = useRef(null)

    useEffect(() => {
        if (duration === null || duration === 0) return
        timerRef.current = setTimeout(() => onDismiss(id), duration)
        return () => clearTimeout(timerRef.current)
    }, [duration, id, onDismiss])

    return (
        <div
            className={['toast', `toast--${variant}`].join(' ')}
            role={variantToRole(variant)}
            aria-live={variant === 'danger' ? 'assertive' : 'polite'}
        >
            <div className="toast__content">
                {title && <div className="toast__title">{title}</div>}
                {description && <div className="toast__description">{description}</div>}
            </div>

            <div className="toast__actions">
                {actionLabel && (
                    <button
                        type="button"
                        className="toast__action"
                        onClick={() => {
                            onAction?.()
                            onDismiss(id)
                        }}
                    >
                        {actionLabel}
                    </button>
                )}
                <button type="button" className="toast__close" onClick={() => onDismiss(id)} aria-label="Dismiss toast">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>
        </div>
    )
})

const ToastViewport = memo(function ToastViewport({ toasts, position = 'bottom-right', onDismiss }) {
    if (!toasts.length) return null

    return createPortal(
        <div className={['toast-viewport', `toast-viewport--${position}`].join(' ')} aria-label="Notifications">
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>,
        document.body
    )
})

export const ToastProvider = ({ children, maxToasts = DEFAULT_MAX, position = 'bottom-right' }) => {
    const [toasts, setToasts] = useState([])
    const idRef = useRef(0)

    const dismiss = useCallback((id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const dismissAll = useCallback(() => {
        setToasts([])
    }, [])

    const toast = useCallback((payload) => {
        const id = ++idRef.current
        const next = {
            id,
            variant: 'info',
            duration: DEFAULT_DURATION,
            ...payload,
        }

        setToasts((prev) => {
            const updated = [next, ...prev]
            return updated.slice(0, maxToasts)
        })
        return id
    }, [maxToasts])

    const value = useMemo(() => ({ toast, dismiss, dismissAll }), [toast, dismiss, dismissAll])

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastViewport toasts={toasts} position={position} onDismiss={dismiss} />
        </ToastContext.Provider>
    )
}

export const useToast = () => {
    const ctx = useContext(ToastContext)
    if (!ctx) {
        throw new Error('useToast must be used within <ToastProvider>')
    }
    return ctx
}

export default ToastProvider
