import React from 'react'
import Input from '../components/utils/Input'
import Button from '../components/utils/Button'

const Home = () => {
    return (
        <>
            <Input placeholder="Email" />

            <div className="element">
                <Button>Submit</Button>
                <Button variant="disabled">Submit</Button>

            </div>

        </>
    )
}

export default Home