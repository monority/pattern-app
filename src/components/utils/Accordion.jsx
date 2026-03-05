import React, { useState } from 'react'

const AccordionItem = ({ title, children, isOpen, onToggle }) => (
    <div className={`accordion__item${isOpen ? ' accordion__item--open' : ''}`}>
        <button type="button" className="accordion__trigger" onClick={onToggle} aria-expanded={isOpen}>
            <span>{title}</span>
            <svg className="accordion__icon" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        </button>
        <div className="accordion__body">
            <div className="accordion__content">{children}</div>
        </div>
    </div>
)

const Accordion = ({ items = [], multiple = false, defaultOpen = [] }) => {
    const [open, setOpen] = useState(new Set(defaultOpen))

    const toggle = (i) => setOpen(prev => {
        const next = new Set(multiple ? prev : [])
        prev.has(i) ? next.delete(i) : next.add(i)
        return next
    })

    return (
        <div className="accordion">
            {items.map((item, i) => (
                <AccordionItem
                    key={i}
                    title={item.title}
                    isOpen={open.has(i)}
                    onToggle={() => toggle(i)}
                >
                    {item.content}
                </AccordionItem>
            ))}
        </div>
    )
}

export default Accordion
