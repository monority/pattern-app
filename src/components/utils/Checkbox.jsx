import React, { forwardRef, memo, useEffect, useId, useImperativeHandle, useRef } from 'react'
import Icon from './Icon'

const CheckboxComponent = forwardRef((props, ref) => {
    const {
        id,
        label,
        children,
        hint,
        error,
        size = 'md',
        disabled = false,
        required = false,
        indeterminate = false,
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
    const inputId = id ?? `checkbox-${generatedId}`
    const hintId = hint ? `${inputId}-hint` : undefined
    const errorId = error ? `${inputId}-error` : undefined
    const inputRef = useRef(null)

    useImperativeHandle(ref, () => inputRef.current, [])

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.indeterminate = Boolean(indeterminate)
        }
    }, [indeterminate])

    const wrapperClassName = [
        'checkbox',
        `checkbox-${size}`,
        disabled && 'checkbox-disabled',
        error && 'checkbox-error',
        containerClassName,
    ]
        .filter(Boolean)
        .join(' ')

    const checkboxLabel = children ?? label

    const ariaInvalid = ariaInvalidProp !== undefined
        ? ariaInvalidProp
        : (error ? 'true' : undefined)

    const ariaDescribedBy = ariaDescribedByProp !== undefined
        ? ariaDescribedByProp
        : (error ? errorId : hint ? hintId : undefined)

    return (
        <div className={wrapperClassName}>
            <label htmlFor={inputId} className={['checkbox__label', labelClassName].filter(Boolean).join(' ')}>
                <input
                    ref={inputRef}
                    id={inputId}
                    type="checkbox"
                    disabled={disabled}
                    required={required}
                    aria-invalid={ariaInvalid}
                    aria-describedby={ariaDescribedBy}
                    className={['checkbox__input', className].filter(Boolean).join(' ')}
                    {...rest}
                />
                <span className={['checkbox__control', indeterminate && 'checkbox__control--indeterminate'].filter(Boolean).join(' ')} aria-hidden="true">
                    <Icon type="check" viewBox="0 0 16 16" className="checkbox__icon checkbox__icon-check" focusable="false" />
                    <Icon type="minus" viewBox="0 0 16 16" className="checkbox__icon checkbox__icon-line" focusable="false" />
                </span>
                {checkboxLabel && (
                    <span className="checkbox__text">
                        {checkboxLabel}
                        {required && <span className="checkbox__required">*</span>}
                    </span>
                )}
            </label>

            {error && (
                <span id={errorId} className={['checkbox__error', errorClassName].filter(Boolean).join(' ')} role="alert">
                    {error}
                </span>
            )}

            {hint && !error && (
                <span id={hintId} className={['checkbox__hint', hintClassName].filter(Boolean).join(' ')}>
                    {hint}
                </span>
            )}
        </div>
    )
})

CheckboxComponent.displayName = 'Checkbox'

const Checkbox = memo(CheckboxComponent)

export default Checkbox
