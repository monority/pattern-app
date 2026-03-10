import React from 'react'

const Icon = ({ type, size = '1em', ...props }) => {
    const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', ...props }

    switch (type) {
        // ── existing ──────────────────────────────────────────
        case 'search':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
            )
        case 'chevron-left':
            return <svg {...shared}><polyline points="15 18 9 12 15 6" /></svg>
        case 'chevron-right':
            return <svg {...shared}><polyline points="9 18 15 12 9 6" /></svg>
        case 'chevron-down':
            return <svg {...shared}><polyline points="6 9 12 15 18 9" /></svg>
        case 'bookmark':
            return <svg {...shared}><path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z" /></svg>
        case 'bookmark-filled':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
                    <path d="M7 2h10a2 2 0 0 1 2 2v18l-7-4-7 4V4a2 2 0 0 1 2-2z" />
                </svg>
            )

        // ── close / x ─────────────────────────────────────────
        case 'x':
            return (
                <svg {...shared}>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            )

        // ── eye (password toggle) ──────────────────────────────
        case 'eye':
            return (
                <svg {...shared}>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                </svg>
            )
        case 'eye-off':
            return (
                <svg {...shared}>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
            )

        // ── image placeholder ─────────────────────────────────
        case 'image':
            return (
                <svg {...shared}>
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                </svg>
            )

        // ── status/variant icons ───────────────────────────────
        case 'alert-circle':
            return (
                <svg {...shared}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
            )
        case 'alert-triangle':
            return (
                <svg {...shared}>
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
            )
        case 'info-circle':
            return (
                <svg {...shared}>
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
            )
        case 'check-circle':
            return (
                <svg {...shared}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
            )

        // ── checkbox icons (use viewBox="0 0 16 16" via prop) ─
        case 'check':
            return (
                <svg {...shared}>
                    <polyline points="3.5 8.5 6.8 11.5 12.5 4.8" />
                </svg>
            )
        case 'minus':
            return (
                <svg {...shared}>
                    <line x1="4" y1="8" x2="12" y2="8" />
                </svg>
            )

        default: return null
    }
}

export default Icon