import React from 'react'
import Input from '../components/utils/Input'
import Button from '../components/utils/Button'

const Home = () => {
    return (
        <>
            <>
                <Input placeholder="Email" />

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
            </>
        </>
    )
}

export default Home