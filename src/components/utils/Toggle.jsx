import React, { forwardRef, memo, useId } from 'react'

const ToggleComponent = forwardRef((props, ref) => {
    const {
        id,
        label,
        children,
        hint,
        error,
        size = 'md',
        disabled = false,
        required = false,
        className = '',
        containerClassName = '',
        labelClassName = '',
        hintClassName = '',
        errorClassName = '',
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
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? errorId : hint ? hintId : undefined}
                    className={['toggle__input', className].filter(Boolean).join(' ')}
                    {...rest}
                />
                <span className="toggle__track" aria-hidden="true">
                    <span className="toggle__thumb" />
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
