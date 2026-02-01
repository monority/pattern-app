import React, { forwardRef, memo } from 'react'

const Spinner = () => (
    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" opacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75" strokeLinecap="round">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.6s" repeatCount="indefinite" />
        </path>
    </svg>
)

const ButtonComponent = forwardRef((props, ref) => {
    const {
        children,
        variant = 'primary',
        size = 'md',
        fullWidth = false,
        isLoading = false,
        disabled = false,
        leftIcon,
        rightIcon,
        as: Component = 'button',
        type = 'button',
        className = '',
        onClick,
        ...rest
    } = props

    const isDisabled = disabled || isLoading

    const handleClick = (e) => {
        if (isDisabled) {
            e.preventDefault()
            return
        }
        onClick?.(e)
    }

    const buttonClassName = [
        'btn',
        `btn-${variant}`,
        `btn-${size}`,
        fullWidth && 'btn-full-width',
        isDisabled && 'btn-disabled',
        isLoading && 'btn-loading',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const renderContent = () => {
        if (typeof children === 'string' || typeof children === 'number') {
            return <span className="btn-content">{children}</span>
        }
        return children
    }

    return (
        <Component
            ref={ref}
            type={Component === 'button' ? type : undefined}
            disabled={Component === 'button' ? isDisabled : undefined}
            aria-disabled={isDisabled}
            aria-busy={isLoading}
            className={buttonClassName}
            onClick={handleClick}
            {...rest}
        >
            {isLoading && <span className="btn-spinner"><Spinner /></span>}
            {!isLoading && leftIcon && <span className="btn-icon-left">{leftIcon}</span>}
            {renderContent()}
            {!isLoading && rightIcon && <span className="btn-icon-right">{rightIcon}</span>}
        </Component>
    )
})

ButtonComponent.displayName = 'Button'

const Button = memo(ButtonComponent)

export default Button