import React from 'react'

const Icon = ({ type, size = '1em', ...props }) => {
    const shared = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', ...props }

    switch (type) {
        case 'search':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width={size} height={size} {...props}>
                    <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zM10 14a4 4 0 110-8 4 4 0 010 8z" />
                </svg>
            )
        case 'chevron-left':
            return (
                <svg {...shared}>
                    <polyline points="15 18 9 12 15 6" />
                </svg>
            )
        case 'chevron-right':
            return (
                <svg {...shared}>
                    <polyline points="9 18 15 12 9 6" />
                </svg>
            )
        case 'bookmark':
            return (
                <svg {...shared}>
                    <path d="M6 3h12a1 1 0 0 1 1 1v18l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                </svg>
            )
        case 'bookmark-filled':
            return (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    width={size}
                    height={size}
                    {...props}
                >
                    <path d="M7 2h10a2 2 0 0 1 2 2v18l-7-4-7 4V4a2 2 0 0 1 2-2z" />
                </svg>
            )
        default: return null
    }
}

export default Icon