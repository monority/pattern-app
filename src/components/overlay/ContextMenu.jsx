import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'

const ContextMenuContext = createContext(null)

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const composeHandlers = (theirHandler, ourHandler) => {
    return (event) => {
        theirHandler?.(event)
        if (event.defaultPrevented) return
        ourHandler?.(event)
    }
}

const getMenuItems = (container) => {
    if (!container) return []
    return Array.from(container.querySelectorAll('[role="menuitem"]')).filter((el) => {
        if (!(el instanceof HTMLElement)) return false
        if (el.getAttribute('aria-disabled') === 'true') return false
        if (el.hasAttribute('disabled')) return false
        return true
    })
}

const ContextMenu = ({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    viewportPadding = 8,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    children,
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
    const open = typeof openProp === 'boolean' ? openProp : uncontrolledOpen

    const triggerNodeRef = useRef(null)
    const menuNodeRef = useRef(null)

    const menuId = useId()

    const [point, setPoint] = useState({ x: 0, y: 0 })

    const setOpen = useCallback((next) => {
        const value = typeof next === 'function' ? next(open) : next

        if (typeof openProp !== 'boolean') {
            setUncontrolledOpen(value)
        }
        onOpenChange?.(value)
    }, [onOpenChange, open, openProp])

    const close = useCallback(() => setOpen(false), [setOpen])

    const setTriggerNode = useCallback((node) => {
        triggerNodeRef.current = node
    }, [])

    const setMenuNode = useCallback((node) => {
        menuNodeRef.current = node
    }, [])

    const [menuStyle, setMenuStyle] = useState(null)

    const updatePosition = useCallback(() => {
        const menuNode = menuNodeRef.current
        if (!menuNode) return

        const rect = menuNode.getBoundingClientRect()
        const vw = window.innerWidth
        const vh = window.innerHeight

        const left = clamp(point.x, viewportPadding, vw - rect.width - viewportPadding)
        const top = clamp(point.y, viewportPadding, vh - rect.height - viewportPadding)

        setMenuStyle({ position: 'fixed', top, left })
    }, [point.x, point.y, viewportPadding])

    useEffect(() => {
        if (!open) return

        const raf = requestAnimationFrame(() => updatePosition())

        const onResize = () => updatePosition()
        window.addEventListener('resize', onResize)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', onResize)
        }
    }, [open, updatePosition])

    useEffect(() => {
        if (!open || !closeOnOutsideClick) return

        const onPointerDown = (event) => {
            const target = event.target
            if (!(target instanceof Node)) return

            if (triggerNodeRef.current?.contains(target)) return
            if (menuNodeRef.current?.contains(target)) return

            close()
        }

        document.addEventListener('pointerdown', onPointerDown, true)
        return () => document.removeEventListener('pointerdown', onPointerDown, true)
    }, [open, closeOnOutsideClick, close])

    useEffect(() => {
        if (!open || !closeOnEscape) return

        const onKeyDown = (event) => {
            if (event.key !== 'Escape') return
            event.preventDefault()
            close()
        }

        document.addEventListener('keydown', onKeyDown)
        return () => document.removeEventListener('keydown', onKeyDown)
    }, [open, closeOnEscape, close])

    const contextValue = useMemo(() => ({
        open,
        setOpen,
        close,
        menuId,
        menuStyle,
        updatePosition,
        setPoint,
        setTriggerNode,
        setMenuNode,
    }), [open, setOpen, close, menuId, menuStyle, updatePosition, setTriggerNode, setMenuNode])

    return (
        <ContextMenuContext.Provider value={contextValue}>
            {children}
        </ContextMenuContext.Provider>
    )
}

export const ContextMenuTrigger = React.forwardRef(({ children, className = '', ...props }, forwardedRef) => {
    const ctx = useContext(ContextMenuContext)
    if (!ctx) throw new Error('ContextMenuTrigger must be used within <ContextMenu>')

    const setNode = (node) => {
        ctx.setTriggerNode(node)
        if (!forwardedRef) return
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else forwardedRef.current = node
    }

    const openAt = (event) => {
        event.preventDefault()
        ctx.setPoint({ x: event.clientX, y: event.clientY })
        ctx.setOpen(true)
    }

    if (React.isValidElement(children)) {
        const childProps = children.props ?? {}
        const enhancedChild = React.cloneElement(children, {
            onContextMenu: composeHandlers(childProps.onContextMenu, openAt),
        })

        return (
            <span ref={setNode} className={['contextmenu__trigger', className].filter(Boolean).join(' ')} {...props}>
                {enhancedChild}
            </span>
        )
    }

    return (
        <span
            ref={setNode}
            className={['contextmenu__trigger', className].filter(Boolean).join(' ')}
            onContextMenu={openAt}
            {...props}
        >
            {children}
        </span>
    )
})

ContextMenuTrigger.displayName = 'ContextMenuTrigger'

export const ContextMenuContent = React.forwardRef(({ children, className = '', style, autoFocus = true, ...props }, forwardedRef) => {
    const ctx = useContext(ContextMenuContext)
    if (!ctx) throw new Error('ContextMenuContent must be used within <ContextMenu>')

    const localRef = useRef(null)

    const setNode = (node) => {
        localRef.current = node
        ctx.setMenuNode(node)
        if (!forwardedRef) return
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else forwardedRef.current = node
    }

    useEffect(() => {
        if (!ctx.open || !autoFocus) return

        const timer = window.setTimeout(() => {
            const items = getMenuItems(localRef.current)
                ; (items[0] ?? localRef.current)?.focus?.()
        }, 0)

        return () => window.clearTimeout(timer)
    }, [ctx.open, autoFocus])

    const onKeyDown = (event) => {
        if (!ctx.open) return

        const items = getMenuItems(localRef.current)
        if (!items.length) return

        const activeIndex = items.findIndex((el) => el === document.activeElement)

        const focusAt = (index) => {
            const next = items[clamp(index, 0, items.length - 1)]
            next?.focus?.()
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault()
                focusAt(activeIndex < 0 ? 0 : activeIndex + 1)
                break
            case 'ArrowUp':
                event.preventDefault()
                focusAt(activeIndex < 0 ? items.length - 1 : activeIndex - 1)
                break
            case 'Home':
                event.preventDefault()
                focusAt(0)
                break
            case 'End':
                event.preventDefault()
                focusAt(items.length - 1)
                break
            default:
                break
        }
    }

    const positionedStyle = ctx.menuStyle ?? { position: 'fixed', top: 0, left: 0 }

    return createPortal(
        <AnimatePresence>
            {ctx.open && (
                <motion.div
                    id={ctx.menuId}
                    ref={setNode}
                    role="menu"
                    tabIndex={-1}
                    className={['contextmenu', className].filter(Boolean).join(' ')}
                    style={{ ...positionedStyle, transformOrigin: '0 0', ...style }}
                    onKeyDown={onKeyDown}
                    initial={{ opacity: 0, scale: 0.88 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.88 }}
                    transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    {...props}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
})

ContextMenuContent.displayName = 'ContextMenuContent'

export const ContextMenuItem = React.forwardRef(({ children, onSelect, disabled = false, className = '', ...props }, forwardedRef) => {
    const ctx = useContext(ContextMenuContext)
    if (!ctx) throw new Error('ContextMenuItem must be used within <ContextMenu>')

    return (
        <button
            type="button"
            ref={forwardedRef}
            role="menuitem"
            className={['contextmenu__item', disabled && 'contextmenu__item--disabled', className].filter(Boolean).join(' ')}
            disabled={disabled}
            aria-disabled={disabled}
            onClick={(event) => {
                if (disabled) {
                    event.preventDefault()
                    return
                }
                onSelect?.(event)
                ctx.close()
            }}
            {...props}
        >
            {children}
        </button>
    )
})

ContextMenuItem.displayName = 'ContextMenuItem'

export const ContextMenuSeparator = ({ className = '', ...props }) => {
    return <div className={['contextmenu__separator', className].filter(Boolean).join(' ')} role="separator" {...props} />
}

export default ContextMenu
