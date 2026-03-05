import React, { useState, useRef, useId } from 'react'

const Tabs = ({
    tabs = [],
    defaultTab,
    activeTab: controlledTab,
    onChange,
    variant = 'line',
    className = '',
    ...props
}) => {
    const uid = useId()
    const isControlled = controlledTab !== undefined
    const [internalTab, setInternalTab] = useState(defaultTab ?? tabs[0]?.value)

    const active = isControlled ? controlledTab : internalTab
    const tabRefs = useRef({})

    const select = (value) => {
        if (value === active) return
        if (!isControlled) setInternalTab(value)
        onChange?.(value)
    }

    const handleKeyDown = (e, index) => {
        const enabled = tabs.filter((t) => !t.disabled)
        const currentIndex = enabled.findIndex((t) => t.value === tabs[index].value)

        let next = null
        if (e.key === 'ArrowRight') next = enabled[(currentIndex + 1) % enabled.length]
        if (e.key === 'ArrowLeft') next = enabled[(currentIndex - 1 + enabled.length) % enabled.length]
        if (e.key === 'Home') next = enabled[0]
        if (e.key === 'End') next = enabled[enabled.length - 1]

        if (next) {
            e.preventDefault()
            tabRefs.current[next.value]?.focus()
            select(next.value)
        }
    }

    const activePanel = tabs.find((t) => t.value === active)

    return (
        <div className={['tabs', `tabs--${variant}`, className].filter(Boolean).join(' ')} {...props}>
            <div className="tabs__list" role="tablist">
                {tabs.map((tab, i) => {
                    const isActive = tab.value === active
                    return (
                        <button
                            key={tab.value}
                            ref={(el) => (tabRefs.current[tab.value] = el)}
                            id={`${uid}-tab-${tab.value}`}
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`${uid}-panel-${tab.value}`}
                            aria-disabled={tab.disabled}
                            tabIndex={isActive ? 0 : -1}
                            disabled={tab.disabled}
                            className={['tabs__tab', isActive && 'tabs__tab--active'].filter(Boolean).join(' ')}
                            onClick={() => select(tab.value)}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                        >
                            {tab.icon && <span className="tabs__tab-icon">{tab.icon}</span>}
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            {activePanel && (
                <div
                    id={`${uid}-panel-${activePanel.value}`}
                    role="tabpanel"
                    aria-labelledby={`${uid}-tab-${activePanel.value}`}
                    className="tabs__panel"
                >
                    {activePanel.content}
                </div>
            )}
        </div>
    )
}

export default Tabs
