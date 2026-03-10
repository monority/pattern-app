import React, { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const AccordionItem = ({ title, children, isOpen, onToggle }) => (
    <div className="accordion__item">
        <button type="button" className="accordion__trigger" onClick={onToggle} aria-expanded={isOpen}>
            <span>{title}</span>
            <motion.svg
                className="accordion__icon"
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.22, ease: 'easeInOut' }}
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
        </button>
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    className="accordion__body"
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    style={{ overflow: 'hidden' }}
                >
                    <div className="accordion__content">{children}</div>
                </motion.div>
            )}
        </AnimatePresence>
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
