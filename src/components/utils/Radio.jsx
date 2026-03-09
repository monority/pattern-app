import React, { forwardRef, memo, useId } from 'react'

const RadioComponent = forwardRef((props, ref) => {
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
    const inputId = id ?? `radio-${generatedId}`
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined

    const wrapperClassName = [
        'radio',
        `radio-${size}`,
        disabled && 'radio-disabled',
        error && 'radio-error',
        containerClassName,
    ]
        .filter(Boolean)
        .join(' ')

    const radioLabel = children ?? label

    return (
        <div className={wrapperClassName}>
            <label htmlFor={inputId} className={['radio__label', labelClassName].filter(Boolean).join(' ')}>
                <input
                    ref={ref}
                    id={inputId}
                    type="radio"
                    disabled={disabled}
                    required={required}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? errorId : hint ? hintId : undefined}
                    className={['radio__input', className].filter(Boolean).join(' ')}
                    {...rest}
                />
                <span className="radio__control" aria-hidden="true">
                    <span className="radio__dot" />
                </span>
                {radioLabel && (
                    <span className="radio__text">
                        {radioLabel}
                        {required && <span className="radio__required">*</span>}
                    </span>
                )}
            </label>

            {error && (
                <span id={errorId} className={['radio__error', errorClassName].filter(Boolean).join(' ')} role="alert">
                    {error}
                </span>
            )}

            {hint && !error && (
                <span id={hintId} className={['radio__hint', hintClassName].filter(Boolean).join(' ')}>
                    {hint}
                </span>
            )}
        </div>
    )
})

RadioComponent.displayName = 'Radio'

const Radio = memo(RadioComponent)

export default Radio
