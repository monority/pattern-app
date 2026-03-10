import React, { forwardRef, memo, useId, useState } from 'react'
import Icon from './Icon'

const InputComponent = forwardRef((props, ref) => {
    const {
        id,
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
        'aria-invalid': ariaInvalidProp,
        'aria-describedby': ariaDescribedByProp,
        ...rest
    } = props

    const generatedId = useId()
    const inputId = id ?? `input-${generatedId}`
    const errorId = error ? `${inputId}-error` : undefined
    const hintId = hint ? `${inputId}-hint` : undefined

    const [showPassword, setShowPassword] = useState(false)
    const isPasswordInput = type === 'password'
    const inputType = isPasswordInput && showPassword ? 'text' : type

    const ariaInvalid = ariaInvalidProp !== undefined
        ? ariaInvalidProp
        : (error ? 'true' : undefined)

    const ariaDescribedBy = ariaDescribedByProp !== undefined
        ? ariaDescribedByProp
        : (error ? errorId : hint ? hintId : undefined)

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
                <label htmlFor={inputId} className={labelClassName}>
                    {label}
                    {required && <span>*</span>}
                </label>
            )}
            <div className="input-wrapper">
                {leftIcon}
                <input
                    ref={ref}
                    id={inputId}
                    type={inputType}
                    disabled={disabled}
                    required={required}
                    aria-invalid={ariaInvalid}
                    aria-describedby={ariaDescribedBy}
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
                            <Icon type="eye-off" size="20" aria-hidden="true" focusable="false" />
                        ) : (
                            <Icon type="eye" size="20" aria-hidden="true" focusable="false" />
                        )}
                    </button>
                )}
                {rightIcon}
            </div>
            {error && (
                <span id={errorId} className={['input__error', errorClassName].filter(Boolean).join(' ')} role="alert">
                    {error}
                </span>
            )}
            {hint && !error && (
                <span id={hintId} className={['input__hint', hintClassName].filter(Boolean).join(' ')}>
                    {hint}
                </span>
            )}
        </div>
    )
})

InputComponent.displayName = 'Input'

const Input = memo(InputComponent)

export default Input
