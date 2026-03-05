import React, { forwardRef, memo, useId } from 'react'

const SelectComponent = forwardRef((props, ref) => {
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
        placeholder,
        options,
        className = '',
        containerClassName = '',
        labelClassName = '',
        errorClassName = '',
        hintClassName = '',
        children,
        ...rest
    } = props

    const generatedId = useId()
    const selectId = id ?? `select-${generatedId}`
    const errorId = error ? `${selectId}-error` : undefined
    const hintId = hint ? `${selectId}-hint` : undefined

    const wrapperClasses = [
        'select',
        fullWidth && 'select-full-width',
        disabled && 'select-disabled',
        containerClassName,
    ]
        .filter(Boolean)
        .join(' ')

    const selectClasses = [
        'select-element',
        `select-${variant}`,
        `select-${size}`,
        error && 'select-error',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const renderedOptions = (() => {
        if (children) return children
        const list = Array.isArray(options) ? options : []

        return (
            <>
                {placeholder != null && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}
                {list.map((opt) => {
                    if (typeof opt === 'string' || typeof opt === 'number') {
                        return (
                            <option key={String(opt)} value={String(opt)}>
                                {String(opt)}
                            </option>
                        )
                    }

                    const value = opt?.value ?? ''
                    const optionLabel = opt?.label ?? String(value)
                    return (
                        <option key={String(value)} value={String(value)} disabled={Boolean(opt?.disabled)}>
                            {optionLabel}
                        </option>
                    )
                })}
            </>
        )
    })()

    return (
        <div className={wrapperClasses}>
            {label && (
                <label htmlFor={selectId} className={labelClassName}>
                    {label}
                    {required && <span>*</span>}
                </label>
            )}

            <div className="select-wrapper">
                <select
                    ref={ref}
                    id={selectId}
                    disabled={disabled}
                    required={required}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? errorId : hint ? hintId : undefined}
                    className={selectClasses}
                    {...rest}
                >
                    {renderedOptions}
                </select>

                <span className="select-chevron" aria-hidden="true">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9" />
                    </svg>
                </span>
            </div>

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

SelectComponent.displayName = 'Select'

const Select = memo(SelectComponent)

export default Select
