import { useEffect, useState } from 'react'
import NfcManager, { NfcEvents } from 'react-native-nfc-manager'

interface UseNfcHandshakeResult {
  supported: boolean | null
  enabled: boolean
  handshaking: boolean
  lastTagId: string | null
  resetHandshake: () => void
}

export function useNfcHandshake(): UseNfcHandshakeResult {
  const [supported, setSupported] = useState<boolean | null>(null)
  const [enabled, setEnabled] = useState(false)
  const [handshaking, setHandshaking] = useState(false)
  const [lastTagId, setLastTagId] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    async function init() {
      try {
        const isSupported = await NfcManager.isSupported()
        if (!mounted) return

        setSupported(isSupported)

        if (!isSupported) {
          return
        }

        await NfcManager.start()
        if (!mounted) return

        const isEnabled = await NfcManager.isEnabled()
        if (!mounted) return

        setEnabled(isEnabled)

        if (!isEnabled) {
          return
        }

        // Listen for any NFC tag / peer detection.
        NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
          setHandshaking(true)
          // Use a simple identifier from the tag so we can show something in the UI.
          const id =
            (tag as any)?.id ??
            (tag as any)?.serialNumber ??
            (tag as any)?.tagId ??
            null

          setLastTagId(id)

          // Immediately stop listening so the modal only triggers once per tap.
          NfcManager.unregisterTagEvent().catch(() => {})
        })

        // Start a foreground tag scan session.
        await NfcManager.registerTagEvent()
      } catch (e) {
        console.warn('NFC handshake init failed:', e)
      }
    }

    init()

    return () => {
      mounted = false
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null as any)
      NfcManager.unregisterTagEvent().catch(() => {})
    }
  }, [])

  const resetHandshake = () => {
    setHandshaking(false)
    setLastTagId(null)
    // Re-register scan session so the user can handshake again.
    NfcManager.registerTagEvent().catch(() => {})
  }

  return {
    supported,
    enabled,
    handshaking,
    lastTagId,
    resetHandshake,
  }
}

