import React, { memo } from 'react'

const TableComponent = (props) => {
    const {
        columns,
        data,
        caption,
        striped = false,
        hover = true,
        dense = false,
        getRowKey,
        emptyText = 'No data',
        className = '',
        tableClassName = '',
        ...rest
    } = props

    const hasModel = Array.isArray(columns) && Array.isArray(data)

    const wrapperClassName = [
        'table',
        striped && 'table--striped',
        hover && 'table--hover',
        dense && 'table--dense',
        className,
    ]
        .filter(Boolean)
        .join(' ')

    if (!hasModel) {
        return (
            <div className={wrapperClassName} {...rest}>
                <table className={['table__table', tableClassName].filter(Boolean).join(' ')}>
                    {caption && <caption className="table__caption">{caption}</caption>}
                    {props.children}
                </table>
            </div>
        )
    }

    const safeGetRowKey = getRowKey ?? ((row, index) => row?.id ?? index)

    return (
        <div className={wrapperClassName} {...rest}>
            <table className={['table__table', tableClassName].filter(Boolean).join(' ')}>
                {caption && <caption className="table__caption">{caption}</caption>}
                <thead className="table__head">
                    <tr className="table__row table__row--head">
                        {columns.map((col) => {
                            const key = col.key ?? col.accessor
                            const header = col.header ?? key
                            const align = col.align ? `table__cell--${col.align}` : ''

                            return (
                                <th
                                    key={String(key)}
                                    scope="col"
                                    className={['table__cell', 'table__cell--head', align, col.headerClassName].filter(Boolean).join(' ')}
                                    style={col.width ? { width: col.width } : undefined}
                                >
                                    {header}
                                </th>
                            )
                        })}
                    </tr>
                </thead>

                <tbody className="table__body">
                    {data.length === 0 ? (
                        <tr className="table__row">
                            <td className="table__cell table__cell--empty" colSpan={columns.length}>
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr key={String(safeGetRowKey(row, rowIndex))} className="table__row">
                                {columns.map((col) => {
                                    const key = col.key ?? col.accessor
                                    const align = col.align ? `table__cell--${col.align}` : ''
                                    const value = col.render ? col.render(row, rowIndex) : row?.[key]

                                    return (
                                        <td
                                            key={String(key)}
                                            className={['table__cell', align, col.cellClassName].filter(Boolean).join(' ')}
                                        >
                                            {value}
                                        </td>
                                    )
                                })}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

TableComponent.displayName = 'Table'

const Table = memo(TableComponent)

export default Table
