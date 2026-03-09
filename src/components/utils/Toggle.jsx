import React, { forwardRef, memo, useId } from 'react'
import Icon from './Icon'

const ToggleComponent = forwardRef((props, ref) => {
    const {
        id,
        label,
        children,
        hint,
        error,
        size = 'md',
        icon,
        iconOff = 'bookmark',
        iconOn = 'bookmark-filled',
        disabled = false,
        required = false,
        className = '',
        containerClassName = '',
        labelClassName = '',
        hintClassName = '',
        errorClassName = '',
        'aria-invalid': ariaInvalidProp,
        'aria-describedby': ariaDescribedByProp,
        ...rest
    } = props

    const generatedId = useId()
    const inputId = id ?? `toggle-${generatedId}`
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    const wrapperClassName = [
        'toggle',
        `toggle-${size}`,
        disabled && 'toggle-disabled',
        error && 'toggle-error',
        containerClassName,
    ]
        .filter(Boolean)
        .join(' ')

    const toggleLabel = children ?? label
    const resolvedIconOff = icon ?? iconOff
    const resolvedIconOn = iconOn ?? resolvedIconOff

    const ariaInvalid = ariaInvalidProp !== undefined
        ? ariaInvalidProp
        : (error ? 'true' : undefined)

    const ariaDescribedBy = ariaDescribedByProp !== undefined
        ? ariaDescribedByProp
        : (error ? errorId : hint ? hintId : undefined)

    return (
        <div className={wrapperClassName}>
            <label htmlFor={inputId} className={['toggle__label', labelClassName].filter(Boolean).join(' ')}>
                <input
                    ref={ref}
                    id={inputId}
                    type="checkbox"
                    role="switch"
                    disabled={disabled}
                    required={required}
                    aria-invalid={ariaInvalid}
                    aria-describedby={ariaDescribedBy}
                    className={['toggle__input', className].filter(Boolean).join(' ')}
                    {...rest}
                />
                <span className="toggle__control" aria-hidden="true">
                    <Icon type={resolvedIconOff} size="100%" className="toggle__icon toggle__icon-outline" aria-hidden="true" focusable="false" />
                    <Icon type={resolvedIconOn} size="100%" className="toggle__icon toggle__icon-filled" aria-hidden="true" focusable="false" />
                </span>
                {toggleLabel && (
                    <span className="toggle__text">
                        {toggleLabel}
                        {required && <span className="toggle__required">*</span>}
                    </span>
                )}
            </label>

            {error && (
                <span id={errorId} className={['toggle__error', errorClassName].filter(Boolean).join(' ')} role="alert">
                    {error}
                </span>
            )}

            {hint && !error && (
                <span id={hintId} className={['toggle__hint', hintClassName].filter(Boolean).join(' ')}>
                    {hint}
                </span>
            )}
        </div>
    )
})

ToggleComponent.displayName = 'Toggle'

const Toggle = memo(ToggleComponent)

export default Toggle
