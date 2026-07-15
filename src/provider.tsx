'use client'

import { SessionProvider } from 'next-auth/react'
import React, { useEffect } from 'react'

const Provider = ({children}:{children:React.ReactNode}) => {
  useEffect(() => {
    // If the browser restores this page from bfcache (back/forward navigation),
    // the restored JS heap may hold a stale session. Force a fresh load so
    // proxy and layout auth checks run again.
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', onPageShow)
    return () => window.removeEventListener('pageshow', onPageShow)
  }, [])

  return (
    <SessionProvider>
        {children}
    </SessionProvider>
  )
}

export default Provider