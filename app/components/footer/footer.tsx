'use client'
import { TranslateRounded, VideoCallRounded } from '@mui/icons-material'
import { BottomNavigation, BottomNavigationAction, Box, Divider } from '@mui/material'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import styles from './footer.module.scss'
import { useRouter } from 'next/navigation'

export interface FooterProps {}

export default function Footer(props: FooterProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [value, setValue] = useState(pathname !== '/video-call' ? 0 : 1)

  return (
    <Box className={styles.footer}>
      <Divider />
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue)
          if (newValue === 0) {
            router.push('/')
          } else if (newValue === 1) {
            router.push('/video-call')
          }
        }}
      >
        <BottomNavigationAction label='Translate' icon={<TranslateRounded />} />
        <BottomNavigationAction label='Video Call' icon={<VideoCallRounded />} />
      </BottomNavigation>
    </Box>
  )
}
