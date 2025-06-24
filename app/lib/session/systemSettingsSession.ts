'use server'

import { cookies } from 'next/headers'

const SYSTEM_KEY = 'system_settings'

export async function setSystemSettingsInSession(settings: {
  name: string
  description: string
  themeColor: string
  logo: string
}) {
  const cookieValue = JSON.stringify(settings)
  cookies().set(SYSTEM_KEY, cookieValue, {
    path: '/',
    httpOnly: false,
  })
}

export async function getSystemSettingsFromSession(): Promise<{
  name: string
  description: string
  themeColor: string
  logo: string
} | null> {
  const cookie = cookies().get(SYSTEM_KEY)?.value
  return cookie ? JSON.parse(cookie) : null
}
