import React, { memo } from 'react'
import Icon from '../utils/Icon'

const ListComponent = (props) => {
    const {
        items,
        renderItem,
        ordered = false,
        divided = false,
        icon,
        dense = false,
        className = '',
        ...rest
    } = props

    const Tag = ordered ? 'ol' : 'ul'

    const listClassName = [
        'list',
        divided && 'list--divided',
        dense && 'list--dense',
        icon && 'list--icon',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    if (!Array.isArray(items)) {
        return (
            <Tag className={listClassName} {...rest}>
                {props.children}
            </Tag>
        )
    }

    return (
        <Tag className={listClassName} {...rest}>
            {items.map((item, index) => (
                <li key={index} className="list__item">
                    {icon ? (
                        <span className="list__icon" aria-hidden="true">
                            <Icon type={icon} size="1em" />
                        </span>
                    ) : (
                        <span className="list__bullet" aria-hidden="true" />
                    )}
                    <div className="list__content">
                        {renderItem ? renderItem(item, index) : item}
                    </div>
                </li>
            ))}
        </Tag>
    )
}

ListComponent.displayName = 'List'

const List = memo(ListComponent)

export default List
