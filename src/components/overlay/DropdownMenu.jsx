import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const DropdownMenuContext = createContext(null)

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const composeHandlers = (theirHandler, ourHandler) => {
    return (event) => {
        theirHandler?.(event)
        if (event.defaultPrevented) return
        ourHandler?.(event)
    }
}

const getAnchoredPosition = ({ anchorRect, panelRect, placement, align, offset, viewportPadding }) => {
    const vw = window.innerWidth
    const vh = window.innerHeight

    let top = 0
    let left = 0

    const alignLeft = () => {
        if (align === 'start') return anchorRect.left
        if (align === 'end') return anchorRect.right - panelRect.width
        return anchorRect.left + anchorRect.width / 2 - panelRect.width / 2
    }

    switch (placement) {
        case 'top':
            top = anchorRect.top - panelRect.height - offset
            left = alignLeft()
            break
        case 'bottom':
        default:
            top = anchorRect.bottom + offset
            left = alignLeft()
            break
    }

    top = clamp(top, viewportPadding, vh - panelRect.height - viewportPadding)
    left = clamp(left, viewportPadding, vw - panelRect.width - viewportPadding)

    return { top, left }
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

const DropdownMenu = ({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = 'bottom',
    align = 'start',
    offset = 8,
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

    const setOpen = useCallback((next) => {
        const value = typeof next === 'function' ? next(open) : next

        if (typeof openProp !== 'boolean') {
            setUncontrolledOpen(value)
        }
        onOpenChange?.(value)
    }, [onOpenChange, open, openProp])

    const close = useCallback(() => setOpen(false), [setOpen])
    const toggle = useCallback(() => setOpen((prev) => !prev), [setOpen])

    const setTriggerNode = useCallback((node) => {
        triggerNodeRef.current = node
    }, [])

    const setMenuNode = useCallback((node) => {
        menuNodeRef.current = node
    }, [])

    const [menuStyle, setMenuStyle] = useState(null)

    const updatePosition = useCallback(() => {
        const triggerNode = triggerNodeRef.current
        const menuNode = menuNodeRef.current
        if (!triggerNode || !menuNode) return

        const triggerRect = triggerNode.getBoundingClientRect()
        const menuRect = menuNode.getBoundingClientRect()

        const pos = getAnchoredPosition({
            anchorRect: triggerRect,
            panelRect: menuRect,
            placement,
            align,
            offset,
            viewportPadding,
        })

        setMenuStyle({
            position: 'fixed',
            top: pos.top,
            left: pos.left,
            visibility: 'visible',
        })
    }, [placement, align, offset, viewportPadding])

    useEffect(() => {
        if (!open) return

        const raf = requestAnimationFrame(() => updatePosition())

        const onScrollOrResize = () => updatePosition()
        window.addEventListener('resize', onScrollOrResize)
        window.addEventListener('scroll', onScrollOrResize, true)

        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener('resize', onScrollOrResize)
            window.removeEventListener('scroll', onScrollOrResize, true)
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
        toggle,
        close,
        menuId,
        menuStyle,
        updatePosition,
        setTriggerNode,
        setMenuNode,
    }), [open, setOpen, toggle, close, menuId, menuStyle, updatePosition, setTriggerNode, setMenuNode])

    return (
        <DropdownMenuContext.Provider value={contextValue}>
            {children}
        </DropdownMenuContext.Provider>
    )
}

export const DropdownMenuTrigger = React.forwardRef(({ children, className = '', ...props }, forwardedRef) => {
    const ctx = useContext(DropdownMenuContext)
    if (!ctx) throw new Error('DropdownMenuTrigger must be used within <DropdownMenu>')

    const setNode = (node) => {
        ctx.setTriggerNode(node)
        if (!forwardedRef) return
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else forwardedRef.current = node
    }

    if (React.isValidElement(children)) {
        const childProps = children.props ?? {}
        const enhancedChild = React.cloneElement(children, {
            'aria-haspopup': 'menu',
            'aria-expanded': ctx.open,
            'aria-controls': ctx.open ? ctx.menuId : undefined,
            onClick: composeHandlers(childProps.onClick, () => ctx.toggle()),
        })

        return (
            <span ref={setNode} className={['dropdownmenu__trigger', className].filter(Boolean).join(' ')} {...props}>
                {enhancedChild}
            </span>
        )
    }

    return (
        <span
            ref={setNode}
            role="button"
            tabIndex={0}
            aria-haspopup="menu"
            aria-expanded={ctx.open}
            aria-controls={ctx.open ? ctx.menuId : undefined}
            className={['dropdownmenu__trigger', className].filter(Boolean).join(' ')}
            onClick={() => ctx.toggle()}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    ctx.toggle()
                }
            }}
            {...props}
        >
            {children}
        </span>
    )
})

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger'

export const DropdownMenuContent = React.forwardRef(({ children, className = '', style, autoFocus = true, ...props }, forwardedRef) => {
    const ctx = useContext(DropdownMenuContext)
    if (!ctx) throw new Error('DropdownMenuContent must be used within <DropdownMenu>')

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

    if (!ctx.open) return null

    const positionedStyle = ctx.menuStyle ?? {
        position: 'fixed',
        top: 0,
        left: 0,
        visibility: 'hidden',
    }

    return createPortal(
        <div
            id={ctx.menuId}
            ref={setNode}
            role="menu"
            tabIndex={-1}
            className={['dropdownmenu', className].filter(Boolean).join(' ')}
            style={{ ...positionedStyle, ...style }}
            onKeyDown={onKeyDown}
            {...props}
        >
            {children}
        </div>,
        document.body
    )
})

DropdownMenuContent.displayName = 'DropdownMenuContent'

export const DropdownMenuItem = React.forwardRef(({
    children,
    onSelect,
    disabled = false,
    className = '',
    ...props
}, forwardedRef) => {
    const ctx = useContext(DropdownMenuContext)
    if (!ctx) throw new Error('DropdownMenuItem must be used within <DropdownMenu>')

    return (
        <button
            type="button"
            ref={forwardedRef}
            role="menuitem"
            className={['dropdownmenu__item', disabled && 'dropdownmenu__item--disabled', className].filter(Boolean).join(' ')}
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

DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuSeparator = ({ className = '', ...props }) => {
    return <div className={['dropdownmenu__separator', className].filter(Boolean).join(' ')} role="separator" {...props} />
}

export default DropdownMenu
