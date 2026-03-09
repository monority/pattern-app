import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const DropdownMenuContext = createContext(null)

const composeHandlers = (theirHandler, ourHandler) => {
    return (event) => {
        theirHandler?.(event)
        if (event.defaultPrevented) return
        ourHandler?.(event)
    }
}

const DropdownMenu = ({
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    placement = 'bottom',
    align = 'start',
    offset = 8,
    closeOnEscape = true,
    closeOnOutsideClick = true,
    closeOnBlur = true,
    returnFocusOnClose = true,
    className = '',
    children,
}) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
    const open = typeof openProp === 'boolean' ? openProp : uncontrolledOpen

    const rootRef = useRef(null)
    const triggerNodeRef = useRef(null)

    const menuId = useId()
    const triggerId = useId()

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

    useEffect(() => {
        if (open) return
        if (!returnFocusOnClose) return
        triggerNodeRef.current?.focus?.()
    }, [open, returnFocusOnClose])

    const onKeyDownCapture = (event) => {
        if (!open) return
        if (!closeOnEscape) return
        if (event.key !== 'Escape') return

        event.preventDefault()
        close()
    }

    const onBlurCapture = (event) => {
        if (!open) return
        if (!closeOnBlur) return

        const nextFocused = event.relatedTarget
        if (!(nextFocused instanceof Node)) {
            close()
            return
        }

        if (rootRef.current?.contains(nextFocused)) return
        close()
    }

    const contextValue = useMemo(() => ({
        open,
        setOpen,
        toggle,
        close,
        menuId,
        triggerId,
        placement,
        align,
        offset,
        setTriggerNode,
    }), [open, setOpen, toggle, close, menuId, triggerId, placement, align, offset, setTriggerNode])

    return (
        <DropdownMenuContext.Provider value={contextValue}>
            <div
                ref={rootRef}
                className={['dropdownmenu-root', className].filter(Boolean).join(' ')}
                onKeyDownCapture={onKeyDownCapture}
                onBlurCapture={onBlurCapture}
            >
                {children}
            </div>
            {open && closeOnOutsideClick && createPortal(
                <button
                    type="button"
                    className="dropdownmenu__backdrop"
                    aria-hidden="true"
                    tabIndex={-1}
                    onClick={close}
                />,
                document.body
            )}
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
            id: childProps.id ?? ctx.triggerId,
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
            id={ctx.triggerId}
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
        if (!forwardedRef) return
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else forwardedRef.current = node
    }

    useEffect(() => {
        if (!ctx.open || !autoFocus) return

        const timer = window.setTimeout(() => {
            localRef.current?.focus?.()
        }, 0)

        return () => window.clearTimeout(timer)
    }, [ctx.open, autoFocus])

    if (!ctx.open) return null

    const placementClass = `dropdownmenu--${ctx.placement}`
    const alignClass = `dropdownmenu--${ctx.align}`

    return (
        <div
            id={ctx.menuId}
            ref={setNode}
            role="menu"
            aria-labelledby={ctx.triggerId}
            tabIndex={-1}
            className={['dropdownmenu', placementClass, alignClass, className].filter(Boolean).join(' ')}
            style={{ '--dropdownmenu-offset': `${ctx.offset}px`, ...style }}
            {...props}
        >
            {children}
        </div>
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
