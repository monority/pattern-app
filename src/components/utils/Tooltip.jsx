import React, { useState, useRef, useId } from 'react'

const Tooltip = ({
    children,
    content,
    placement = 'top',
    delay = 100,
    className = '',
    ...props
}) => {
    const [visible, setVisible] = useState(false)
    const timer = useRef(null)
    const id = useId()

    const show = () => { timer.current = setTimeout(() => setVisible(true), delay) }
    const hide = () => { clearTimeout(timer.current); setVisible(false) }

    return (
        <span
            className="tooltip-wrapper"
            onMouseEnter={show}
            onMouseLeave={hide}
            onFocus={show}
            onBlur={hide}
            aria-describedby={visible ? id : undefined}
        >
            {children}
            <span
                id={id}
                role="tooltip"
                className={['tooltip', `tooltip--${placement}`, visible && 'tooltip--visible', className].filter(Boolean).join(' ')}
                {...props}
            >
                {content}
            </span>
        </span>
    )
}

export default Tooltip
