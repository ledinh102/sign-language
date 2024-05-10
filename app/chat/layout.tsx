'use client'
import { Box, Divider, Grid, LinearProgress, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { redirect, useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import UserCard from '../components/card/userCard'
import SearchUsers from '../components/search/searchUser'
import { ConversationCustom } from '../model'

export default function LayoutChat({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [conversationList, setConversationList] = useState<ConversationCustom[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const getConversationList = async (userId: string) => {
    setLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8000/${userId}/conversations`)
      const conversationList: ConversationCustom[] = await response.json()
      if (conversationList.length > 0) {
        router.push('/chat/' + conversationList[0].id)
      }
      setConversationList(conversationList)
    } catch (error) {
      console.error('Error fetching conversation list: ', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') getConversationList(session?.user.id)
  }, [status])

  if (status === 'loading') {
    return <LinearProgress />
  }

  if (status === 'unauthenticated') {
    return redirect('/auth/sign-in')
  }

  return (
    <Box>
      <Grid container height='calc(100vh - 71px - 56px)'>
        <Grid item xs={4} sx={{ borderRight: '1px solid #ccc', borderLeft: '1px solid #ccc' }}>
          <Box pt={2} px={2}>
            <Typography variant='h5' component='h1' fontWeight='bold' mb={1}>
              Chats
            </Typography>
            <SearchUsers userId={session?.user?.id!} getConversationList={getConversationList} />
          </Box>
          <Divider />
          <Box>
            {loading && <LinearProgress />}
            {conversationList &&
              conversationList.map(conversation => (
                <UserCard
                  key={conversation.id}
                  conversationId={conversation.id}
                  name={
                    session?.user?.id === conversation.user1Id ? conversation.user2.name! : conversation.user1.name!
                  }
                  content=''
                  avatar={
                    session?.user?.id === conversation.user1Id
                      ? conversation?.user2?.image!
                      : conversation?.user1?.image!
                  }
                />
              ))}
          </Box>
        </Grid>
        <Grid item xs={8} sx={{ p: 0, borderRight: '1px solid #ccc' }}>
          {children}
        </Grid>
      </Grid>
    </Box>
  )
}
