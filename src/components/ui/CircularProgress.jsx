import React, { memo } from 'react'

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

const SIZE_CLASS = {
    sm: 'circular-progress-sm',
    md: 'circular-progress-md',
    lg: 'circular-progress-lg',
}

const CircularProgressComponent = (props) => {
    const {
        value,
        min = 0,
        max = 100,
        size = 'md',
        label = 'Loading',
        thickness = 2.5,
        className = '',
        ...rest
    } = props

    const isDeterminate = typeof value === 'number' && Number.isFinite(value)
    const safeMin = Number.isFinite(min) ? min : 0
    const safeMax = Number.isFinite(max) ? max : 100

    const viewBoxSize = 24
    const center = viewBoxSize / 2
    const radius = (viewBoxSize - thickness) / 2
    const circumference = 2 * Math.PI * radius

    const rawPercent = isDeterminate ? ((value - safeMin) / (safeMax - safeMin)) * 100 : 0
    const percent = isDeterminate ? clamp(rawPercent, 0, 100) : undefined
    const dashOffset = isDeterminate ? circumference - (circumference * percent) / 100 : undefined

    const wrapperClassName = [
        'circular-progress',
        SIZE_CLASS[size] || '',
        !isDeterminate && 'circular-progress--indeterminate',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    return (
        <span
            className={wrapperClassName}
            role="progressbar"
            aria-label={label}
            aria-valuemin={isDeterminate ? safeMin : undefined}
            aria-valuemax={isDeterminate ? safeMax : undefined}
            aria-valuenow={isDeterminate ? clamp(value, safeMin, safeMax) : undefined}
            {...rest}
        >
            <svg className="circular-progress__svg" viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} focusable="false" aria-hidden="true">
                <circle
                    className="circular-progress__track"
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    strokeWidth={thickness}
                />
                <circle
                    className="circular-progress__indicator"
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="none"
                    strokeWidth={thickness}
                    strokeDasharray={circumference}
                    strokeDashoffset={isDeterminate ? dashOffset : undefined}
                    strokeLinecap="round"
                />
            </svg>
        </span>
    )
}

CircularProgressComponent.displayName = 'CircularProgress'

const CircularProgress = memo(CircularProgressComponent)

export default CircularProgress
