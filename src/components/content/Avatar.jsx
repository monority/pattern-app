import React, { useState } from 'react'

const getInitials = (name = '') =>
    name.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('')

const Avatar = ({
    src,
    alt = '',
    name,
    size = 'md',
    shape = 'circle',
    status,
    className = '',
    style = {},
    ...props
}) => {
    const [imgFailed, setImgFailed] = useState(false)
    const showImg = src && !imgFailed
    const initials = getInitials(name || alt)

    return (
        <div
            className={['avatar', `avatar--${size}`, `avatar--${shape}`, status && `avatar--${status}`, className].filter(Boolean).join(' ')}
            title={name || alt}
            style={style}
            {...props}
        >
            {showImg
                ? <img src={src} alt={alt} onError={() => setImgFailed(true)} />
                : <span className="avatar__initials">{initials || '?'}</span>
            }
            {status && <span className="avatar__status" aria-label={status} />}
        </div>
    )
}

export const AvatarGroup = ({ children, max = 4, size = 'md' }) => {
    const all = React.Children.toArray(children)
    const visible = all.slice(0, max)
    const rest = all.length - max

    return (
        <div className="avatar-group">
            {visible.map((child, i) => React.cloneElement(child, { size, key: i }))}
            {rest > 0 && (
                <div className={`avatar avatar--${size} avatar--circle avatar__overflow`}>
                    <span className="avatar__initials">+{rest}</span>
                </div>
            )}
        </div>
    )
}

export default Avatar
