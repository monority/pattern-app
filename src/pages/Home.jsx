import React, { useEffect, useState } from 'react'
import Input from '../components/utils/Input'
import Button from '../components/utils/Button'
import Image from '../components/utils/Image'
import { AlertDialog } from '../components/utils/AlertDialog'
import Skeleton from '../components/utils/Skeleton'
import Accordion from '../components/utils/Accordion'
import Avatar, { AvatarGroup } from '../components/utils/Avatar'

const Home = () => {
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [videoLoading, setVideoLoading] = useState(true)
    const [iframeLoading, setIframeLoading] = useState(true)
    const [activeMode, setActiveMode] = useState('light')

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', activeMode)
    }, [activeMode])




    const handleDelete = () => {
        console.log('Item deleted')
        setDeleteDialog(false)
    }

    const DisplayModeToggle = ({ mode, label }) => {
        const handleToggle = () => {
            setActiveMode(mode)
            document.documentElement.setAttribute('data-theme', mode)
        }
        return (
            <button
                className={`mode-toggle ${activeMode === mode ? 'active' : ''}`}
                onClick={handleToggle}
            >
                {label}
            </button>
        )
    }
    return (
        <>
            <div className="element">
                <h1>UI Component Library Showcase</h1>
                <p>
                    This page demonstrates the various components available in our UI library, including different states, variants, and responsive behaviors. Explore the inputs, buttons, images, and skeleton loaders to see how they can be used in your projects.
                </p>
            </div>
            <div className="displaymode">
                <h2>Display Modes</h2>
                <DisplayModeToggle mode="light" label="Light Mode" />
                <DisplayModeToggle mode="dark" label="Dark Mode" />
                <DisplayModeToggle mode="high-contrast" label="High Contrast Mode" />
            </div>
            <div className="elements-grid">
                <div className="element">
                    <h2>Input Variants</h2>
                    <Input
                        label="Default Input"
                        placeholder="Enter text..."
                        variant="default"
                    />
                    <Input
                        label="Outlined Input"
                        placeholder="Enter text..."
                        variant="outlined"
                    />
                    <Input
                        label="Filled Input"
                        placeholder="Enter text..."
                        variant="filled"
                    />
                </div>

                <div className="element">
                    <h2>Input Sizes</h2>
                    <Input
                        label="Small"
                        placeholder="Small input"
                        size="sm"
                    />
                    <Input
                        label="Medium"
                        placeholder="Medium input"
                        size="md"
                    />
                    <Input
                        label="Large"
                        placeholder="Large input"
                        size="lg"
                    />
                </div>

                <div className="element">
                    <h2>Input States</h2>
                    <Input
                        label="Required Field"
                        placeholder="Enter required data"
                        required
                    />
                    <Input
                        label="Disabled Input"
                        placeholder="Disabled"
                        disabled
                    />
                    <Input
                        label="With Error"
                        placeholder="Enter email"
                        error="This field is required"
                    />
                    <Input
                        label="With Hint"
                        placeholder="Password"
                        type="password"
                        hint="Must be at least 8 characters"
                    />
                </div>

                <div className="element">
                    <h2>Full Width Input</h2>
                    <Input
                        label="Email Address"
                        placeholder="your.email@example.com"
                        fullWidth
                    />
                </div>

                <div className="element">
                    <h2>Button Variants</h2>
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="danger">Danger</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                </div>

                <div className="element">
                    <h2>Button States</h2>
                    <Button>Normal</Button>
                    <Button disabled>Disabled</Button>
                    <Button isLoading>Loading</Button>
                </div>

                <div className="element">
                    <h2>With Icons</h2>
                    <Button leftIcon={<span>←</span>}>Back</Button>
                    <Button rightIcon={<span>→</span>}>Next</Button>
                </div>

                <div className="element">
                    <Button fullWidth>Full Width Button</Button>
                </div>

                <div className="element">
                    <h2>Alert Dialog</h2>
                    <Button
                        variant="danger"
                        onClick={() => setDeleteDialog(true)}
                    >
                        Open Delete Dialog
                    </Button>
                </div>

                <div className="element">
                    <Image
                        src="/images.png"
                        alt="Description"
                        aspectRatio="4/3"
                        loading="lazy"
                        fallbackSrc="/placeholder.jpg"
                    />
                </div>

                <div className="element">
                    <h2>Skeleton (Image)</h2>
                    <div className="media-loader" data-loading={String(imageLoading)}>
                        <Skeleton type="image" aspectRatio="4/3" />
                        <img
                            src="/image-placeholder.png"
                            alt="Image placeholder"
                            onLoad={() => setImageLoading(false)}
                            onError={() => setImageLoading(false)}
                            style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }}
                        />
                    </div>
                </div>

                <div className="element">
                    <h2>Skeleton (Vidéo)</h2>
                    <div className="media-loader" data-loading={String(videoLoading)}>
                        <Skeleton type="video" />
                        <video
                            controls
                            preload="metadata"
                            poster="/image-placeholder.png"
                            onLoadedMetadata={() => setVideoLoading(false)}
                            style={{ width: '100%', aspectRatio: '16/9' }}
                        >
                            <source
                                src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                                type="video/mp4"
                            />
                            Votre navigateur ne supporte pas la vidéo.
                        </video>
                    </div>
                </div>

                <div className="element">
                    <h2>Skeleton (Iframe)</h2>
                    <div className="media-loader" data-loading={String(iframeLoading)}>
                        <Skeleton type="iframe" />
                        <iframe
                            width="100%"
                            onLoad={() => setIframeLoading(false)}
                            style={{ aspectRatio: '16/9', border: 'none' }}
                            src="https://www.youtube.com/embed/jNQXAC9IVRw"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>

            </div>
            <AlertDialog
                isOpen={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
                variant="danger"
                title="Delete Item"
                description="Are you sure you want to delete this item? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
            />

            <div className="accordion-container">
                <h2>Accordion</h2>
                <Accordion items={[
                    { title: 'Item 1', content: 'Contenu du premier item.' },
                    { title: 'Item 2', content: 'Contenu du deuxième item.' },
                    { title: 'Item 3', content: 'Contenu du troisième item.' },
                ]} />
            </div>]
            <div className="avatar-container">
                <h2>Avatar</h2>
                <Avatar src="/user.jpg" alt="John Doe" size="lg" status="online" />

                <Avatar name="John Doe" size="md" shape="square" />

                <AvatarGroup max={3}>
                    <Avatar src="/a.jpg" name="Alice" />
                    <Avatar src="/b.jpg" name="Bob" />
                    <Avatar name="Charlie" />
                    <Avatar name="Diana" />
                </AvatarGroup>
            </div>
        </>
    )
}

export default Home