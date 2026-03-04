import React from 'react'

const Card = ({
    children,
    variant = 'default',
    hover = false,
    onClick,
    className = '',
    style = {},
    ...props
}) => (
    <div
        className={['card', `card--${variant}`, hover && 'card--hover', onClick && 'card--clickable', className].filter(Boolean).join(' ')}
        onClick={onClick}
        style={style}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
        {...props}
    >
        {children}
    </div>
)

const CardMedia = ({ src, alt = '', aspectRatio = '16/9', children }) => (
    <div className="card__media" style={{ aspectRatio }}>
        {src ? <img src={src} alt={alt} /> : children}
    </div>
)

const CardHeader = ({ title, subtitle, action, avatar }) => (
    <div className="card__header">
        {avatar && <div className="card__header-avatar">{avatar}</div>}
        <div className="card__header-text">
            {title && <p className="card__title">{title}</p>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
        </div>
        {action && <div className="card__header-action">{action}</div>}
    </div>
)

const CardBody = ({ children }) => <div className="card__body">{children}</div>
const CardFooter = ({ children }) => <div className="card__footer">{children}</div>

Card.Media = CardMedia
Card.Header = CardHeader
Card.Body = CardBody
Card.Footer = CardFooter

export default Card
