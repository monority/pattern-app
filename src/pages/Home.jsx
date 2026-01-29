import React from 'react'
import Input from '../components/utils/Input'
import Button from '../components/utils/Button'
import Image from '../components/utils/Image'

const Home = () => {
    return (
        <>
            <>
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
                    <Image
                        src="/images.png"
                        alt="Description"
                        aspectRatio="4/3"
                        loading="lazy"
                        fallbackSrc="/placeholder.jpg"
                    />
                </div>
            </>
        </>
    )
}

export default Home