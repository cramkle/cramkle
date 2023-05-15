import HomePage from '@src/components/HomePage'
import LandingPage from '@src/components/LandingPage'
import Shell from '@src/components/Shell'

export default async function IndexLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const hasCurrentUser = true

  if (!hasCurrentUser) {
    return <LandingPage />
  }

  return (
    <Shell>
      <HomePage>{children}</HomePage>
    </Shell>
  )
}
