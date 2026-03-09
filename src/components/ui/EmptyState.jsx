import React, { memo } from 'react'
import Icon from '../utils/Icon'

const EmptyStateComponent = (props) => {
    const {
        icon,
        title,
        description,
        action,
        className = '',
        ...rest
    } = props

    return (
        <div className={['empty-state', className].filter(Boolean).join(' ')} {...rest}>
            {icon && (
                <div className="empty-state__icon" aria-hidden="true">
                    <Icon type={icon} size="1.6em" />
                </div>
            )}
            {title && <p className="empty-state__title">{title}</p>}
            {description && <p className="empty-state__description">{description}</p>}
            {action && <div className="empty-state__action">{action}</div>}
        </div>
    )
}

EmptyStateComponent.displayName = 'EmptyState'

const EmptyState = memo(EmptyStateComponent)

export default EmptyState
