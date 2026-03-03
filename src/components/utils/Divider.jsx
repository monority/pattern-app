import React from 'react'

const Divider = ({
    orientation = 'horizontal',
    label,
    align = 'center',
    className = '',
    style = {},
    ...props
}) => (
    <div
        className={['divider', `divider--${orientation}`, label && `divider--label-${align}`, className].filter(Boolean).join(' ')}
        role="separator"
        aria-orientation={orientation}
        style={style}
        {...props}
    >
        {label && <span className="divider__label">{label}</span>}
    </div>
)

export default Divider
