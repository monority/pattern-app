
import React, { memo } from 'react'

const SIZE_CLASS = {
	sm: 'spinner-sm',
	md: 'spinner-md',
	lg: 'spinner-lg',
}

const SpinnerComponent = ({
	size = 'md',
	label = 'Loading',
	decorative = false,
	className = '',
	...rest
}) => {
	const sizeClass = SIZE_CLASS[size] || ''

	const wrapperClassName = ['spinner-wrap', sizeClass, className]
		.filter(Boolean)
		.join(' ')

	return (
		<span
			className={wrapperClassName}
			role={decorative ? undefined : 'status'}
			aria-live={decorative ? undefined : 'polite'}
			aria-label={decorative ? undefined : label}
			aria-hidden={decorative ? true : undefined}
			{...rest}
		>
			<svg
				className="spinner"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="2"
				focusable="false"
			>
				<circle cx="12" cy="12" r="10" opacity="0.25" />
				<path d="M12 2a10 10 0 0 1 10 10" opacity="0.75" strokeLinecap="round" />
			</svg>
			{!decorative && <span className="visually-hidden">{label}</span>}
		</span>
	)
}

SpinnerComponent.displayName = 'Spinner'

const Spinner = memo(SpinnerComponent)

export default Spinner
