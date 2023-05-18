import HomePage from '@src/components/HomePage'

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <HomePage>{children}</HomePage>
}
