import React, { forwardRef, memo, useState } from 'react'

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
        type,
        ...rest
    } = props

    const [showPassword, setShowPassword] = useState(false)
    const isPasswordInput = type === 'password'
    const inputType = isPasswordInput && showPassword ? 'text' : type

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
            <div className="input-wrapper">
                {leftIcon}
                <input
                    ref={ref}
                    type={inputType}
                    disabled={disabled}
                    required={required}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'input-error' : hint ? 'input-hint' : undefined}
                    className={inputClassName}
                    {...rest}
                />
                {isPasswordInput && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="input-password-toggle"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        disabled={disabled}
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}
                {rightIcon}
            </div>
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
