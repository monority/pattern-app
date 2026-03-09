import React, { forwardRef, memo } from 'react'
import Input from './Input'

const pad2 = (value) => String(value).padStart(2, '0')

const formatLocalDate = (date) => {
    const year = date.getFullYear()
    const month = pad2(date.getMonth() + 1)
    const day = pad2(date.getDate())
    return `${year}-${month}-${day}`
}

const DatePickerComponent = forwardRef((props, ref) => {
    const {
        defaultToNow = false,
        type: _type,
        ...rest
    } = props

    const inputType = 'date'
    const shouldDefaultToNow =
        defaultToNow &&
        rest.value === undefined &&
        rest.defaultValue === undefined

    const computedDefaultValue = shouldDefaultToNow
        ? formatLocalDate(new Date())
        : undefined

    return <Input ref={ref} type={inputType} defaultValue={computedDefaultValue} {...rest} />
})

DatePickerComponent.displayName = 'DatePicker'

const DatePicker = memo(DatePickerComponent)

export default DatePicker
