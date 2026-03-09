import React, { memo } from 'react'

const TagChipComponent = (props) => {
    const {
        label,
        children,
        variant = 'default',
        size = 'md',
        pill = true,
        className = '',
        ...rest
    } = props

    const content = children ?? label

    return (
        <span
            className={[
                'tagchip',
                `tagchip--${variant}`,
                `tagchip--${size}`,
                pill && 'tagchip--pill',
                className,
            ]
                .filter(Boolean)
                .join(' ')}
            {...rest}
        >
            {content}
        </span>
    )
}

TagChipComponent.displayName = 'TagChip'

const TagChip = memo(TagChipComponent)

export default TagChip
