import React from 'react'

const Skeleton = ({
    type = 'block',
    animation = 'shimmer',
    width,
    height,
    aspectRatio,
    borderRadius,
    className = '',
    style = {},
    ...props
}) => {
    const classes = ['skeleton']

    if (type) classes.push(`skeleton--${type}`)

    if (animation && animation !== 'none') {
        classes.push(`skeleton--${animation}`)
    }

    if (className) classes.push(className)

    const mergedStyle = {
        ...style,
        ...(width ? { width } : null),
        ...(height ? { height } : null),
        ...(aspectRatio ? { aspectRatio } : null),
        ...(borderRadius ? { borderRadius } : null)
    }

    return (
        <div
            className={classes.join(' ')}
            style={mergedStyle}
            aria-busy="true"
            aria-live="polite"
            {...props}
        />
    )
}

export default Skeleton
