import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const PopoverContext = createContext(null)

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const composeHandlers = (theirHandler, ourHandler) => {
    return (event) => {
        theirHandler?.(event)
        if (event.defaultPrevented) return
        ourHandler?.(event)
    }
}

const getAnchoredPosition = ({
    anchorRect,
    panelRect,
    placement,
    align,
    offset,
    viewportPadding,
}) => {
    const vw = window.innerWidth
    const vh = window.innerHeight

    let top = 0
    let left = 0

    const alignLeft = () => {
        if (align === 'start') return anchorRect.left
        if (align === 'end') return anchorRect.right - panelRect.width
        return anchorRect.left + anchorRect.width / 2 - panelRect.width / 2
    }

    const alignTop = () => {
        if (align === 'start') return anchorRect.top
        if (align === 'end') return anchorRect.bottom - panelRect.height
        return anchorRect.top + anchorRect.height / 2 - panelRect.height / 2
    }

    switch (placement) {
        case 'top':
            top = anchorRect.top - panelRect.height - offset
            left = alignLeft()
            break
        case 'bottom':
            top = anchorRect.bottom + offset
            left = alignLeft()
            break
        case 'left':
            top = alignTop()
            left = anchorRect.left - panelRect.width - offset
            break
        case 'right':
        default:
            top = alignTop()
            left = anchorRect.right + offset
            break
    }

    top = clamp(top, viewportPadding, vh - panelRect.height - viewportPadding)
    left = clamp(left, viewportPadding, vw - panelRect.width - viewportPadding)

    return { top, left }
}

const Popover = ({
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

    const anchorNodeRef = useRef(null)
    const panelNodeRef = useRef(null)

    const panelId = useId()

    const setOpen = useCallback((next) => {
        const value = typeof next === 'function' ? next(open) : next

        if (typeof openProp !== 'boolean') {
            setUncontrolledOpen(value)
        }
        onOpenChange?.(value)
    }, [onOpenChange, open, openProp])

    const close = useCallback(() => setOpen(false), [setOpen])
    const toggle = useCallback(() => setOpen((prev) => !prev), [setOpen])

    const setAnchorNode = useCallback((node) => {
        anchorNodeRef.current = node
    }, [])

    const setPanelNode = useCallback((node) => {
        panelNodeRef.current = node
    }, [])

    const [panelStyle, setPanelStyle] = useState(null)

    const updatePosition = useCallback(() => {
        const anchorNode = anchorNodeRef.current
        const panelNode = panelNodeRef.current
        if (!anchorNode || !panelNode) return

        const anchorRect = anchorNode.getBoundingClientRect()
        const panelRect = panelNode.getBoundingClientRect()

        const pos = getAnchoredPosition({
            anchorRect,
            panelRect,
            placement,
            align,
            offset,
            viewportPadding,
        })

        setPanelStyle({
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

            const anchorNode = anchorNodeRef.current
            const panelNode = panelNodeRef.current

            if (anchorNode?.contains(target)) return
            if (panelNode?.contains(target)) return

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
        panelId,
        panelStyle,
        updatePosition,
        setAnchorNode,
        setPanelNode,
    }), [open, setOpen, toggle, close, panelId, panelStyle, updatePosition, setAnchorNode, setPanelNode])

    return (
        <PopoverContext.Provider value={contextValue}>
            {children}
        </PopoverContext.Provider>
    )
}

export const PopoverAnchor = React.forwardRef(({ children, className = '', ...props }, forwardedRef) => {
    const ctx = useContext(PopoverContext)
    if (!ctx) throw new Error('PopoverAnchor must be used within <Popover>')

    const setNode = (node) => {
        ctx.setAnchorNode(node)
        if (!forwardedRef) return
        if (typeof forwardedRef === 'function') forwardedRef(node)
        else forwardedRef.current = node
    }

    if (React.isValidElement(children)) {
        const childProps = children.props ?? {}
        const enhancedChild = React.cloneElement(children, {
            'aria-expanded': ctx.open,
            'aria-controls': ctx.open ? ctx.panelId : undefined,
            onClick: composeHandlers(childProps.onClick, () => ctx.toggle()),
        })

        return (
            <span ref={setNode} className={['popover__anchor', className].filter(Boolean).join(' ')} {...props}>
                {enhancedChild}
            </span>
        )
    }

    return (
        <span
            ref={setNode}
            role="button"
            tabIndex={0}
            aria-expanded={ctx.open}
            aria-controls={ctx.open ? ctx.panelId : undefined}
            className={['popover__anchor', className].filter(Boolean).join(' ')}
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

PopoverAnchor.displayName = 'PopoverAnchor'

export const PopoverPanel = React.forwardRef(({ children, className = '', style, autoFocus = false, ...props }, forwardedRef) => {
    const ctx = useContext(PopoverContext)
    if (!ctx) throw new Error('PopoverPanel must be used within <Popover>')

    const localRef = useRef(null)

    const setNode = (node) => {
        localRef.current = node
        ctx.setPanelNode(node)
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

    const positionedStyle = ctx.panelStyle ?? {
        position: 'fixed',
        top: 0,
        left: 0,
        visibility: 'hidden',
    }

    return createPortal(
        <div
            id={ctx.panelId}
            ref={setNode}
            tabIndex={-1}
            className={['popover', className].filter(Boolean).join(' ')}
            style={{ ...positionedStyle, ...style }}
            {...props}
        >
            {children}
        </div>,
        document.body
    )
})

PopoverPanel.displayName = 'PopoverPanel'

export default Popover
