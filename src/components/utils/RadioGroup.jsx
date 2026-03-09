import React, { memo, useId } from 'react'
import Radio from './Radio'

const RadioGroupComponent = (props) => {
    const {
        id,
        legend,
        name,
        value,
        onChange,
        options = [],
        size = 'md',
        disabled = false,
        required = false,
        hint,
        error,
        className = '',
        legendClassName = '',
        hintClassName = '',
        errorClassName = '',
        ...rest
    } = props

    const generatedId = useId()
    const groupId = id ?? `radiogroup-${generatedId}`
    const hintId = hint ? `${groupId}-hint` : undefined
    const errorId = error ? `${groupId}-error` : undefined
    const describedBy = error ? errorId : hint ? hintId : undefined

    const groupClassName = [
        'radio-group',
        `radio-group-${size}`,
        disabled && 'radio-group-disabled',
        error && 'radio-group-error',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <fieldset
            id={groupId}
            className={groupClassName}
            disabled={disabled}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedBy}
            {...rest}
        >
            {legend && (
                <legend className={['radio-group__legend', legendClassName].filter(Boolean).join(' ')}>
                    {legend}
                    {required && <span className="radio-group__required">*</span>}
                </legend>
            )}

            <div className="radio-group__options">
                {options.map((option) => {
                    const optionValue = typeof option === 'string' ? option : option.value
                    const optionLabel = typeof option === 'string' ? option : option.label
                    const optionDisabled = disabled || (typeof option === 'object' && Boolean(option.disabled))

                    return (
                        <Radio
                            key={optionValue}
                            name={name}
                            value={optionValue}
                            size={size}
                            disabled={optionDisabled}
                            required={required}
                            checked={value === optionValue}
                            onChange={(e) => {
                                if (optionDisabled) return
                                onChange?.(e)
                            }}
                            label={optionLabel}
                        />
                    )
                })}
            </div>

            {error && (
                <span id={errorId} className={['radio-group__error', errorClassName].filter(Boolean).join(' ')} role="alert">
                    {error}
                </span>
            )}

            {hint && !error && (
                <span id={hintId} className={['radio-group__hint', hintClassName].filter(Boolean).join(' ')}>
                    {hint}
                </span>
            )}
        </fieldset>
    )
}

RadioGroupComponent.displayName = 'RadioGroup'

const RadioGroup = memo(RadioGroupComponent)

export default RadioGroup
