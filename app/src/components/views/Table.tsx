import classnames from 'classnames'
import React, { useContext, useMemo } from 'react'

type TableProps = React.TableHTMLAttributes<HTMLTableElement>

export const Table: React.FC<TableProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div
      className={classnames(
        className,
        'border rounded border-gray-1 inline-block overflow-auto bg-surface shadow'
      )}
    >
      <table {...props} className="collapse w-full">
        {children}
      </table>
    </div>
  )
}

type TableHeadProps = React.HTMLAttributes<HTMLTableSectionElement>

const TableHeadContext = React.createContext<undefined | {}>(undefined)

export const TableHead: React.FC<TableHeadProps> = ({
  className = '',
  children,
  ...props
}) => {
  const contextValue = useMemo(() => ({}), [])
  return (
    <thead {...props} className={className}>
      <TableHeadContext.Provider value={contextValue}>
        {children}
      </TableHeadContext.Provider>
    </thead>
  )
}

type TableBodyProps = React.HTMLAttributes<HTMLElement>

export const TableBody: React.FC<TableBodyProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <tbody {...props} className={className}>
      {children}
    </tbody>
  )
}

type TableFooterProps = React.HTMLAttributes<HTMLTableSectionElement>

export const TableFooter: React.FC<TableFooterProps> = ({
  className,
  children,
}) => {
  return (
    <tfoot className={classnames(className, 'border-t border-outline')}>
      {children}
    </tfoot>
  )
}

type TableRowProps = React.HTMLAttributes<HTMLTableRowElement>

export const TableRow: React.FC<TableRowProps> = ({
  className = '',
  children,
  ...props
}) => {
  const isHead = useContext(TableHeadContext) !== undefined

  return (
    <tr
      {...props}
      className={classnames(className, { 'border-t border-gray-1': !isHead })}
    >
      {children}
    </tr>
  )
}

type TableCellProps = React.TdHTMLAttributes<HTMLTableCellElement> & {
  align?: 'right' | 'left'
}

export const TableCell: React.FC<TableCellProps> = ({
  className = '',
  align = 'left',
  children,
  ...props
}) => {
  const isHead = useContext(TableHeadContext) !== undefined

  const Tag = isHead ? 'th' : 'td'

  return (
    <Tag
      {...props}
      className={classnames(className, 'px-6', {
        'h-16 whitespace-no-wrap': !isHead,
        'leading-4 text-xs font-medium uppercase tracking-wider py-3 relative': isHead,
        'text-left': align === 'left',
        'text-right': align === 'right',
      })}
    >
      {children}
      {isHead && (
        <div className="absolute top-0 left-0 bottom-0 right-0 bg-violet-2 opacity-12" />
      )}
    </Tag>
  )
}
