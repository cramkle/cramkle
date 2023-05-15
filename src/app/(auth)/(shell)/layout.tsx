import type { ReactNode } from 'react'

import Shell from '@src/components/Shell'

export default function ShellLayout({ children }: { children: ReactNode }) {
  return <Shell>{children}</Shell>
}
