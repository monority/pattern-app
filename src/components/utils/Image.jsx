import React, { useState, useEffect, useRef, memo } from 'react'
import Spinner from '../ui/Spinner'
import Icon from './Icon'

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

    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        setCurrentSrc(src)
        setImageState('loading')
    }, [src])
    /* eslint-enable react-hooks/set-state-in-effect */

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
                        <Spinner decorative className="spinner-40" />
                    )}
                    {imageState === 'error' && !fallbackSrc && (
                        <Icon type="image" size="40" aria-hidden="true" focusable="false" />
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
