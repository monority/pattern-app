import React from 'react'

const Breadcrumb = ({
    items = [],
    separator = '/',
    className = '',
    ...props
}) => {
    return (
        <nav aria-label="breadcrumb" className={['breadcrumb', className].filter(Boolean).join(' ')} {...props}>
            <ol className="breadcrumb__list">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1

                    return (
                        <li key={index} className="breadcrumb__item">
                            {isLast ? (
                                <span
                                    className="breadcrumb__link breadcrumb__link--current"
                                    aria-current="page"
                                >
                                    {item.label}
                                </span>
                            ) : (
                                <>
                                    <a
                                        href={item.href ?? '#'}
                                        className="breadcrumb__link"
                                    >
                                        {item.label}
                                    </a>
                                    <span className="breadcrumb__separator" aria-hidden="true">
                                        {separator}
                                    </span>
                                </>
                            )}
                        </li>
                    )
                })}
            </ol>
        </nav>
    )
}

export default Breadcrumb
