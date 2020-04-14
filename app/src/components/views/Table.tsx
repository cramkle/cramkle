import classnames from 'classnames'
import React, { useContext, useMemo } from 'react'

type TableProps = React.TableHTMLAttributes<HTMLTableElement>

export const Table: React.FC<TableProps> = ({
  className = '',
  children,
  ...props
}) => {
  return (
    <div className={classnames(className, 'ba br2 b--outline dib')}>
      <table {...props} className="collapse w-100">
        {children}
      </table>
    </div>
  )
}

type TableHeadProps = React.HTMLAttributes<HTMLElement>

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
      className={classnames(className, { 'bt b--outline': !isHead })}
    >
      {children}
    </tr>
  )
}

type TableCellProps = React.HTMLAttributes<HTMLTableCellElement> & {
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
      className={classnames(className, 'h3 ph3', {
        'lh-copy fw5': isHead,
        tl: align === 'left',
        tr: align === 'right',
      })}
    >
      {children}
    </Tag>
  )
}
