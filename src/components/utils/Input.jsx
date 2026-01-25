import React, { forwardRef, memo } from 'react'

const InputComponent = forwardRef((props, ref) => {
    const {
        label,
        error,
        hint,
        size = 'md',
        variant = 'default',
        fullWidth = false,
        leftIcon,
        rightIcon,
        disabled = false,
        required = false,
        className = '',
        containerClassName = '',
        labelClassName = '',
        errorClassName = '',
        hintClassName = '',
        ...rest
    } = props

    const inputClassName = [
        'input-element',
        `input-${variant}`,
        `input-${size}`,
        error && 'input-error',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const wrapperClasses = [
        'input',
        fullWidth && 'input-full-width',
        disabled && 'input-disabled',
        containerClassName,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div className={wrapperClasses}>
            {label && (
                <label className={labelClassName}>
                    {label}
                    {required && <span>*</span>}
                </label>
            )}
            {leftIcon}
            <input
                ref={ref}
                disabled={disabled}
                required={required}
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'input-error' : hint ? 'input-hint' : undefined}
                className={inputClassName}
                {...rest}
            />
            {rightIcon}
            {error && (
                <span id="input-error" className={errorClassName} role="alert">
                    {error}
                </span>
            )}
            {hint && !error && (
                <span id="input-hint" className={hintClassName}>
                    {hint}
                </span>
            )}
        </div>
    )
})

InputComponent.displayName = 'Input'

const Input = memo(InputComponent)

export default Input
