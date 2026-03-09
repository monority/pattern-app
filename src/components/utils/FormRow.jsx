import React, { memo } from 'react'

const FormRowComponent = ({ children, className = '', ...rest }) => {
    return (
        <div className={['form-row', className].filter(Boolean).join(' ')} {...rest}>
            {children}
        </div>
    )
}

FormRowComponent.displayName = 'FormRow'

const FormRow = memo(FormRowComponent)

export default FormRow
