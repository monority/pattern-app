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
import Modal from '../components/overlay/Modal'
import Checkbox from '../components/utils/Checkbox'
import Radio from '../components/utils/Radio'
import DatePicker from '../components/utils/DatePicker'
import FormField from '../components/utils/FormField'
import FormRow from '../components/utils/FormRow'
import RadioGroup from '../components/utils/RadioGroup'
import Select from '../components/utils/Select'
import Textarea from '../components/utils/Textarea'
import Toggle from '../components/utils/Toggle'
import { useToast } from '../components/ui/Toast'

const DisplayModeToggle = ({ mode, label, activeMode, onSelect }) => {
    return (
        <button
            type="button"
            className={`mode-toggle ${activeMode === mode ? 'active' : ''}`}
            onClick={() => onSelect(mode)}
        >
            {label}
        </button>
    )
}

const Home = () => {
    const { toast, dismissAll } = useToast()
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [imageLoading, setImageLoading] = useState(true)
    const [videoLoading, setVideoLoading] = useState(true)
    const [iframeLoading, setIframeLoading] = useState(true)
    const [activeMode, setActiveMode] = useState('light')
    const [page, setPage] = useState(1)
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [modalOpen, setModalOpen] = useState(false)
    const [checkedA, setCheckedA] = useState(false)
    const [checkedB, setCheckedB] = useState(false)
    const [indeterminateB, setIndeterminateB] = useState(true)
    const [selectedRadio, setSelectedRadio] = useState('option-1')
    const [selectedDate, setSelectedDate] = useState(() => {
        const now = new Date()
        const pad2 = (v) => String(v).padStart(2, '0')
        const year = now.getFullYear()
        const month = pad2(now.getMonth() + 1)
        const day = pad2(now.getDate())
        return `${year}-${month}-${day}`
    })
    const [helperEmail, setHelperEmail] = useState('')
    const [helperPlan, setHelperPlan] = useState('starter')
    const [country, setCountry] = useState('')
    const [notificationsEnabled, setNotificationsEnabled] = useState(false)
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
                <DisplayModeToggle mode="light" label="Light Mode" activeMode={activeMode} onSelect={setActiveMode} />
                <DisplayModeToggle mode="dark" label="Dark Mode" activeMode={activeMode} onSelect={setActiveMode} />
                <DisplayModeToggle mode="high-contrast" label="High Contrast Mode" activeMode={activeMode} onSelect={setActiveMode} />
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
                    <h2>Select</h2>
                    <Select
                        label="Country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="Select a country"
                        options={[
                            { label: 'France', value: 'fr' },
                            { label: 'Belgium', value: 'be' },
                            { label: 'Canada', value: 'ca' },
                            { label: 'United States', value: 'us' },
                        ]}
                        hint={country ? `Selected: ${country}` : 'Pick one option'}
                        fullWidth
                    />

                    <Select
                        label="Outlined"
                        variant="outlined"
                        defaultValue="be"
                        options={['be', 'fr', 'ca']}
                    />

                    <Select
                        label="Disabled"
                        disabled
                        defaultValue="fr"
                        options={['fr', 'be']}
                    />
                </div>

                <div className="element">
                    <h2>Textarea</h2>
                    <Textarea
                        label="Message"
                        placeholder="Write something..."
                        hint="This textarea follows Input styles"
                        rows={4}
                    />

                    <Textarea
                        label="Outlined"
                        variant="outlined"
                        placeholder="Outlined textarea"
                        rows={3}
                    />

                    <Textarea
                        label="With Error"
                        placeholder="Try submitting empty"
                        error="This field is required"
                        rows={3}
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
                    <h2>Checkbox</h2>
                    <Checkbox
                        checked={checkedA}
                        onChange={(e) => {
                            setCheckedA(e.target.checked)
                        }}
                        label={checkedA ? 'Checked' : 'Unchecked'}
                        hint="Controlled checkbox"
                    />

                    <Checkbox
                        checked={checkedB}
                        indeterminate={indeterminateB}
                        onChange={(e) => {
                            setCheckedB(e.target.checked)
                            setIndeterminateB(false)
                        }}
                        label="Indeterminate (click to resolve)"
                    />

                    <Checkbox disabled defaultChecked label="Disabled" />
                </div>

                <div className="element">
                    <h2>Radio</h2>
                    <Radio
                        name="example-radio"
                        value="option-1"
                        checked={selectedRadio === 'option-1'}
                        onChange={() => setSelectedRadio('option-1')}
                        label={selectedRadio === 'option-1' ? 'Selected: Option 1' : 'Option 1'}
                        hint="Controlled radio group"
                    />
                    <Radio
                        name="example-radio"
                        value="option-2"
                        checked={selectedRadio === 'option-2'}
                        onChange={() => setSelectedRadio('option-2')}
                        label="Option 2"
                    />
                    <Radio name="example-radio" value="option-3" defaultChecked={false} disabled label="Disabled" />
                </div>

                <div className="element">
                    <h2>Date Picker</h2>
                    <DatePicker
                        label="Pick a date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        hint={selectedDate ? `Selected: ${selectedDate}` : 'Uses native date input UI'}
                        fullWidth
                    />

                    <DatePicker label="Disabled" defaultToNow disabled />
                </div>

                <div className="element">
                    <h2>Form Helpers</h2>

                    <FormRow>
                        <FormField
                            label="Email"
                            required
                            hint="Example usage: pass the control without its own label/hint/error"
                            fullWidth
                        >
                            {({ id, describedBy }) => (
                                <Input
                                    id={id}
                                    value={helperEmail}
                                    onChange={(e) => setHelperEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    aria-describedby={describedBy}
                                    fullWidth
                                />
                            )}
                        </FormField>

                        <FormField label="Date" fullWidth>
                            {({ id, describedBy }) => (
                                <DatePicker
                                    id={id}
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    aria-describedby={describedBy}
                                    fullWidth
                                />
                            )}
                        </FormField>
                    </FormRow>

                    <RadioGroup
                        legend="Plan"
                        name="plan"
                        value={helperPlan}
                        onChange={(e) => setHelperPlan(e.target.value)}
                        options={[
                            { label: 'Starter', value: 'starter' },
                            { label: 'Pro', value: 'pro' },
                            { label: 'Enterprise', value: 'enterprise', disabled: true },
                        ]}
                        hint="RadioGroup uses a fieldset/legend for accessibility"
                    />
                </div>

                <div className="element">
                    <h2>Toggle</h2>
                    <Toggle
                        checked={notificationsEnabled}
                        onChange={(e) => setNotificationsEnabled(e.target.checked)}
                        label={notificationsEnabled ? 'Notifications: On' : 'Notifications: Off'}
                        hint="Controlled toggle"
                    />

                    <Toggle defaultChecked size="sm" icon="search" label="Small" />
                    <Toggle size="lg" label="Large" />
                    <Toggle disabled defaultChecked label="Disabled" />
                    <Toggle defaultChecked error="Example error state" label="With Error" />
                </div>

                <div className="element">
                    <h2>Toast</h2>
                    <div className="btn-row">
                        <Button
                            variant="primary"
                            onClick={() => toast({
                                title: 'Info',
                                description: 'This is an informational toast.',
                                variant: 'info',
                            })}
                        >
                            Show info
                        </Button>
                        <Button
                            variant="success"
                            onClick={() => toast({
                                title: 'Saved',
                                description: 'Your changes have been saved.',
                                variant: 'success',
                            })}
                        >
                            Show success
                        </Button>
                        <Button
                            variant="warning"
                            onClick={() => toast({
                                title: 'Warning',
                                description: 'Please double-check your input.',
                                variant: 'warning',
                            })}
                        >
                            Show warning
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => toast({
                                title: 'Error',
                                description: 'Something went wrong.',
                                variant: 'danger',
                                actionLabel: 'Retry',
                                onAction: () => console.log('retry'),
                                duration: 6000,
                            })}
                        >
                            Show danger
                        </Button>
                        <Button variant="secondary" onClick={dismissAll}>
                            Dismiss all
                        </Button>
                    </div>
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

                <div className="element">
                    <h2>Modal</h2>
                    <Button variant="primary" onClick={() => setModalOpen(true)}>
                        Open Modal
                    </Button>
                </div>
            </div>

            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Modal Title"
                description="This is a reusable modal component with keyboard and overlay close behavior."
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setModalOpen(false)}>Cancel</Button>
                        <Button variant="primary" onClick={() => setModalOpen(false)}>Confirm</Button>
                    </>
                }
            >
                <p>You can place any content here, including forms, details, or custom actions.</p>
            </Modal>

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