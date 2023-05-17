import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

export const useSearchParamsState = <DefaultValue extends string | undefined>(
  key: string,
  defaultValue?: DefaultValue
): readonly [
  DefaultValue extends string ? string : string | undefined,
  (newValue: string) => void
] => {
  const router = useRouter()
  const search = useSearchParams()
  const pathname = usePathname()

  const [value, setValue] = useState(() => {
    if (search?.has(key)) {
      return search.get(key)!
    }

    return defaultValue
  })

  useEffect(() => {
    if (search?.has(key)) {
      if (search.get(key) === value) {
        return
      }

      setValue(search.get(key)!)
      return
    }
  }, [search, key, value])

  const updateValue = useCallback(
    (newValue: string) => {
      const searchParams = new URLSearchParams(search ?? undefined)

      searchParams.set(key, newValue)

      router.push(pathname + '?' + searchParams.toString())
    },
    [router, key, pathname, search]
  )

  return [value as any, updateValue]
}
