import React, { forwardRef, memo, useId } from 'react'

const TextareaComponent = forwardRef((props, ref) => {
    const {
        id,
        label,
        error,
        hint,
        size = 'md',
        variant = 'default',
        fullWidth = false,
        disabled = false,
        required = false,
        rows = 4,
        className = '',
        containerClassName = '',
        labelClassName = '',
        errorClassName = '',
        hintClassName = '',
        'aria-invalid': ariaInvalidProp,
        'aria-describedby': ariaDescribedByProp,
        ...rest
    } = props

    const generatedId = useId()
    const textareaId = id ?? `textarea-${generatedId}`
    const errorId = error ? `${textareaId}-error` : undefined
    const hintId = hint ? `${textareaId}-hint` : undefined

    const wrapperClassName = [
        'textarea',
        fullWidth && 'textarea-full-width',
        disabled && 'textarea-disabled',
        containerClassName,
    ]
        .filter(Boolean)
        .join(' ')

    const textareaClassName = [
        'textarea-element',
        `textarea-${variant}`,
        `textarea-${size}`,
        error && 'textarea-error',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const ariaInvalid = ariaInvalidProp !== undefined
        ? ariaInvalidProp
        : (error ? 'true' : undefined)

    const ariaDescribedBy = ariaDescribedByProp !== undefined
        ? ariaDescribedByProp
        : (error ? errorId : hint ? hintId : undefined)

    return (
        <div className={wrapperClassName}>
            {label && (
                <label htmlFor={textareaId} className={labelClassName}>
                    {label}
                    {required && <span>*</span>}
                </label>
            )}

            <textarea
                ref={ref}
                id={textareaId}
                rows={rows}
                disabled={disabled}
                required={required}
                aria-invalid={ariaInvalid}
                aria-describedby={ariaDescribedBy}
                className={textareaClassName}
                {...rest}
            />

            {error && (
                <span id={errorId} className={errorClassName} role="alert">
                    {error}
                </span>
            )}

            {hint && !error && (
                <span id={hintId} className={hintClassName}>
                    {hint}
                </span>
            )}
        </div>
    )
})

TextareaComponent.displayName = 'Textarea'

const Textarea = memo(TextareaComponent)

export default Textarea
