import React, { useMemo } from 'react'
import Icon from '../utils/Icon'

const getPageRange = (current, total, siblings = 1) => {
    const totalSlots = siblings * 2 + 5 // prev + first + ... + siblings*2 + ... + last + next

    if (total <= totalSlots - 2) {
        return Array.from({ length: total }, (_, i) => i + 1)
    }

    const leftSibling = Math.max(current - siblings, 2)
    const rightSibling = Math.min(current + siblings, total - 1)

    const showLeftDots = leftSibling > 2
    const showRightDots = rightSibling < total - 1

    if (!showLeftDots && showRightDots) {
        const leftRange = Array.from({ length: 2 + siblings * 2 + 1 }, (_, i) => i + 1)
        return [...leftRange, '...', total]
    }

    if (showLeftDots && !showRightDots) {
        const rightRange = Array.from({ length: 2 + siblings * 2 + 1 }, (_, i) => total - (2 + siblings * 2) + i)
        return [1, '...', ...rightRange]
    }

    return [1, '...', ...Array.from({ length: rightSibling - leftSibling + 1 }, (_, i) => leftSibling + i), '...', total]
}

const Pagination = ({
    page = 1,
    total = 1,
    siblings = 1,
    onChange,
    className = '',
    ...props
}) => {
    const pages = useMemo(() => getPageRange(page, total, siblings), [page, total, siblings])

    const go = (p) => {
        if (p < 1 || p > total || p === page) return
        onChange?.(p)
    }

    return (
        <nav aria-label="Pagination" className={['pagination', className].filter(Boolean).join(' ')} {...props}>
            <ul className="pagination__list">

                {/* Prev */}
                <li>
                    <button
                        className="pagination__btn pagination__btn--arrow"
                        onClick={() => go(page - 1)}
                        disabled={page === 1}
                        aria-label="Page précédente"
                    >
                        <Icon type="chevron-left" />
                    </button>
                </li>

                {/* Pages */}
                {pages.map((p, i) =>
                    p === '...' ? (
                        <li key={`dots-${i}`}>
                            <span className="pagination__dots" aria-hidden="true">…</span>
                        </li>
                    ) : (
                        <li key={p}>
                            <button
                                className={['pagination__btn', p === page && 'pagination__btn--active'].filter(Boolean).join(' ')}
                                onClick={() => go(p)}
                                aria-label={`Page ${p}`}
                                aria-current={p === page ? 'page' : undefined}
                            >
                                {p}
                            </button>
                        </li>
                    )
                )}

                {/* Next */}
                <li>
                    <button
                        className="pagination__btn pagination__btn--arrow"
                        onClick={() => go(page + 1)}
                        disabled={page === total}
                        aria-label="Page suivante"
                    >
                        <Icon type="chevron-right" />
                    </button>
                </li>

            </ul>
        </nav>
    )
}

export default Pagination
