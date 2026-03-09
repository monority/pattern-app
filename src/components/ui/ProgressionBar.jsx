import React, { memo } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const SIZE_CLASS = {
    sm: 'progress-sm',
    md: 'progress-md',
    lg: 'progress-lg',
}

const ProgressionBarComponent = (props) => {
    const {
        value,
        min = 0,
        max = 100,
        size = 'md',
        label = 'Loading',
        showValue = false,
        className = '',
        ...rest
    } = props

    const isDeterminate = typeof value === 'number' && Number.isFinite(value)
    const safeMin = Number.isFinite(min) ? min : 0
    const safeMax = Number.isFinite(max) ? max : 100
    const rawPercent = isDeterminate ? ((value - safeMin) / (safeMax - safeMin)) * 100 : 0
    const percent = isDeterminate ? clamp(rawPercent, 0, 100) : undefined

    const wrapperClassName = [
        'progress',
        SIZE_CLASS[size] || '',
        !isDeterminate && 'progress--indeterminate',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <div
            className={wrapperClassName}
            role="progressbar"
            aria-label={label}
            aria-valuemin={isDeterminate ? safeMin : undefined}
            aria-valuemax={isDeterminate ? safeMax : undefined}
            aria-valuenow={isDeterminate ? clamp(value, safeMin, safeMax) : undefined}
            {...rest}
        >
            <div className="progress__track" aria-hidden="true">
                <div
                    className="progress__bar"
                    style={isDeterminate ? { width: `${percent}%` } : undefined}
                />
            </div>
            {showValue && isDeterminate && (
                <span className="progress__value" aria-hidden="true">
                    {Math.round(percent)}%
                </span>
            )}
        </div>
    )
}

ProgressionBarComponent.displayName = 'ProgressionBar'

const ProgressionBar = memo(ProgressionBarComponent)

export default ProgressionBar
