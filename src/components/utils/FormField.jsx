import React, { memo, useId } from 'react'

const FormFieldComponent = (props) => {
    const {
        id,
        label,
        children,
        hint,
        error,
        size = 'md',
        fullWidth = false,
        disabled = false,
        required = false,
        className = '',
        labelClassName = '',
        controlClassName = '',
        hintClassName = '',
        errorClassName = '',
    } = props

    const generatedId = useId()
    const controlId = id ?? `field-${generatedId}`

    const hintId = hint ? `${controlId}-hint` : undefined
    const errorId = error ? `${controlId}-error` : undefined
    const describedBy = error ? errorId : hint ? hintId : undefined

    const wrapperClassName = [
        'form-field',
        `form-field-${size}`,
        fullWidth && 'form-field-full-width',
        disabled && 'form-field-disabled',
        error && 'form-field-error',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const controlProps = {
        id: controlId,
        disabled,
        required,
        'aria-invalid': error ? 'true' : 'false',
        'aria-describedby': describedBy,
    }

    let renderedControl = null

    if (typeof children === 'function') {
        renderedControl = children({
            id: controlId,
            hintId,
            errorId,
            describedBy,
            invalid: Boolean(error),
            disabled,
            required,
        })
    } else if (React.isValidElement(children)) {
        renderedControl = React.cloneElement(children, {
            ...(children.props ?? {}),
            ...(children.props?.id ? {} : { id: controlId }),
            ...(children.props?.disabled !== undefined ? {} : { disabled }),
            ...(children.props?.required !== undefined ? {} : { required }),
            ...(children.props?.['aria-invalid'] !== undefined ? {} : { 'aria-invalid': controlProps['aria-invalid'] }),
            ...(children.props?.['aria-describedby'] ? {} : { 'aria-describedby': describedBy }),
        })
    } else {
        renderedControl = children
    }

    return (
        <div className={wrapperClassName}>
            {label && (
                <label htmlFor={controlId} className={['form-field__label', labelClassName].filter(Boolean).join(' ')}>
                    {label}
                    {required && <span className="form-field__required">*</span>}
                </label>
            )}

            <div className={['form-field__control', controlClassName].filter(Boolean).join(' ')}>
                {renderedControl}
            </div>

            {error && (
                <span id={errorId} className={['form-field__error', errorClassName].filter(Boolean).join(' ')} role="alert">
                    {error}
                </span>
            )}

            {hint && !error && (
                <span id={hintId} className={['form-field__hint', hintClassName].filter(Boolean).join(' ')}>
                    {hint}
                </span>
            )}
        </div>
    )
}

FormFieldComponent.displayName = 'FormField'

const FormField = memo(FormFieldComponent)

export default FormField
