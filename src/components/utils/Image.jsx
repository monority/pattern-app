import React, { useState, useEffect, useRef, memo } from 'react'

const ImageComponent = ({
    src,
    alt = '',
    width,
    height,
    loading = 'lazy',
    objectFit = 'cover',
    placeholder = 'blur',
    fallbackSrc = null,
    caption,
    captionClassName = '',
    className = '',
    containerClassName = '',
    onLoad,
    onError,
    aspectRatio,
    sizes,
    srcSet,
    ...rest
}) => {
    const [imageState, setImageState] = useState('loading')
    const [currentSrc, setCurrentSrc] = useState(src)
    const imgRef = useRef(null)
    const observerRef = useRef(null)

    useEffect(() => {
        setCurrentSrc(src)
        setImageState('loading')
    }, [src])

    useEffect(() => {
        const imgElement = imgRef.current

        if (!imgElement || loading !== 'lazy') return

        observerRef.current = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = entry.target
                        if (img.dataset.src) {
                            img.src = img.dataset.src
                            img.removeAttribute('data-src')
                        }
                        observerRef.current?.unobserve(img)
                    }
                })
            },
            {
                rootMargin: '50px',
            }
        )

        if (imgElement) {
            observerRef.current.observe(imgElement)
        }

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect()
            }
        }
    }, [loading])

    const handleLoad = (e) => {
        setImageState('loaded')
        onLoad?.(e)
    }

    const handleError = (e) => {
        setImageState('error')
        if (fallbackSrc && currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc)
            setImageState('loading')
        }
        onError?.(e)
    }

    const containerClasses = [
        'image-container',
        `object-${objectFit}`,
        containerClassName,
    ]
        .filter(Boolean)
        .join(' ')

    const imageClasses = [
        'image-element',
        imageState,
        className,
    ]
        .filter(Boolean)
        .join(' ')

    const placeholderClasses = [
        'image-placeholder',
        imageState === 'loaded' && 'hidden',
    ]
        .filter(Boolean)
        .join(' ')

    const containerStyle = {
        aspectRatio: aspectRatio,
        width: width || undefined,
        height: height || undefined,
    }

    return (
        <figure className={containerClasses} style={containerStyle}>
            {placeholder !== 'none' && (
                <div className={placeholderClasses}>
                    {imageState === 'loading' && (
                        <svg
                            className="spinner"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <circle cx="12" cy="12" r="10" opacity="0.25" />
                            <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
                        </svg>
                    )}
                    {imageState === 'error' && !fallbackSrc && (
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    )}
                </div>
            )}
            <img
                ref={imgRef}
                src={loading === 'lazy' ? undefined : currentSrc}
                data-src={loading === 'lazy' ? currentSrc : undefined}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                onLoad={handleLoad}
                onError={handleError}
                className={imageClasses}
                {...rest}
            />
            {caption && (
                <figcaption className={captionClassName}>
                    {caption}
                </figcaption>
            )}
        </figure>
    )
}

ImageComponent.displayName = 'Image'

const Image = memo(ImageComponent)

export default Image
