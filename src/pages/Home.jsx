import React, { useEffect, useRef, useState } from 'react'
import Input from '../components/utils/Input'
import Button from '../components/utils/Button'
import Image from '../components/utils/Image'
import { AlertDialog } from '../components/utils/AlertDialog'
import Skeleton from '../components/utils/Skeleton'
import Accordion from '../components/utils/Accordion'
import Avatar, { AvatarGroup } from '../components/content/Avatar'
import Card from '../components/content/Card'
import Divider from '../components/content/Divider'
import Tooltip from '../components/content/Tooltip'
import Breadcrumb from '../components/navigation/Breadcrumb'
import Pagination from '../components/navigation/Pagination'
import Tabs from '../components/navigation/Tabs'
import Drawer from '../components/overlay/Drawer'
const Home = () => {
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [videoLoading, setVideoLoading] = useState(true)
    const [iframeLoading, setIframeLoading] = useState(true)
    const [activeMode, setActiveMode] = useState('light')
    const [page, setPage] = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [drawerPlacement, setDrawerPlacement] = useState('right')
    const drawerRef = useRef(null)
    const pendingPlacement = useRef(null)

    useEffect(() => {
        if (!drawerOpen && pendingPlacement.current) {
            const next = pendingPlacement.current
            pendingPlacement.current = null
            setDrawerPlacement(next)
            setDrawerOpen(true)
        }
    }, [drawerOpen])

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
                            className="media-preview"
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
                            className="video-preview"
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
                            className="iframe-preview"
                            src="https://www.youtube.com/embed/jNQXAC9IVRw"
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>


                <div className="element">
                    <h2>Accordion</h2>
                    <Accordion items={[
                        { title: 'Item 1', content: 'Contenu du premier item.' },
                        { title: 'Item 2', content: 'Contenu du deuxième item.' },
                        { title: 'Item 3', content: 'Contenu du troisième item.' },
                    ]} />
                </div>
                <div className="element">
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
                <div className="element">
                    <h2>Card</h2>
                    <Card variant="elevated" hover>
                        <Card.Media src="/photo.jpg" alt="Cover" aspectRatio="16/9" />
                        <Card.Header
                            title="Card Title"
                            subtitle="Subtitle text"
                            action={<Button size="sm">···</Button>}
                            avatar={<Avatar name="John" size="sm" />}
                        />
                        <Card.Body>
                            Some description content here.
                        </Card.Body>
                        <Card.Footer>
                            <Button variant="primary" size="sm">Action</Button>
                            <Button variant="ghost" size="sm">Cancel</Button>
                        </Card.Footer>
                    </Card>
                </div>
                <div className="element">
                    <h2>Divider</h2>
                    <Divider />

                    <Divider label="ou" />

                    <Divider label="Section" align="start" />
                    <Divider label="fin" align="end" />

                    <div className="divider-row">
                        <span>Gauche</span>
                        <Divider orientation="vertical" />
                        <span>Droite</span>
                    </div>
                </div>
                <div className="element">
                    <h2>Tooltip</h2>
                    <Tooltip content="Supprimer l'élément" placement="top">
                        <Button variant="danger">Delete</Button>
                    </Tooltip>

                    <Tooltip content="Copié !" placement="right" delay={0}>
                        <span>Copier</span>
                    </Tooltip>
                </div>
                <div className="element">
                    <h2>Breadcrumb</h2>
                    <Breadcrumb
                        items={[
                            { label: 'Accueil', href: '/' },
                            { label: 'Catégorie', href: '/categorie' },
                            { label: 'Page courante' },
                        ]}
                        separator="›"
                    />
                </div>
                <div className="element">
                    <h2>Tabs</h2>
                    <Tabs
                        variant="line"
                        tabs={[
                            { value: 'overview', label: 'Overview', content: <p>...</p> },
                            { value: 'settings', label: 'Settings', content: <p>...</p> },
                            { value: 'logs', label: 'Logs', content: <p>...</p>, disabled: true },
                        ]}
                    />
                </div>
                <div className="element">
                    <h2>Pagination</h2>
                    <Pagination
                        page={page}
                        total={10}
                        onChange={setPage}
                    />
                </div>
                <div className="element">
                    <h2>Drawer</h2>
                    <div className="btn-row">
                        {['right', 'left', 'top', 'bottom'].map((p) => (
                            <Button
                                key={p}
                                variant="outline"
                                onClick={() => {
                                    if (drawerOpen && drawerPlacement !== p) {
                                        pendingPlacement.current = p
                                        drawerRef.current?.close()
                                    } else {
                                        setDrawerPlacement(p)
                                        setDrawerOpen(true)
                                    }
                                }}
                            >
                                Open {p}
                            </Button>
                        ))}
                    </div>
                    <Drawer
                        ref={drawerRef}
                        open={drawerOpen}
                        onClose={() => setDrawerOpen(false)}
                        placement={drawerPlacement}
                        title="Drawer title"
                        footer={
                            <>
                                <Button variant="secondary" onClick={() => drawerRef.current?.close()}>Cancel</Button>
                                <Button variant="primary" onClick={() => drawerRef.current?.close()}>Confirm</Button>
                            </>
                        }
                    >
                        <p>Drawer content goes here. You can put any content inside the drawer.</p>
                    </Drawer>
                </div>
            </div>
            <AlertDialog
                isOpen={deleteDialog}
                onClose={() => setDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Supprimer l'élément"
                description="Cette action est irréversible. Voulez-vous vraiment supprimer cet élément ?"
                confirmText="Supprimer"
                cancelText="Annuler"
                variant="danger"
            />
        </>
    )
}

export default Home