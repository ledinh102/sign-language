'use client'
import { Avatar, Box, Button, Divider, Grid, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
import { MouseEvent, useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { PersonRounded, SearchRounded } from '@mui/icons-material'
import UserCard from '../components/card/userCard'
import { Conversation, Message, User } from '@prisma/client'
import { redirect, useRouter, useSearchParams } from 'next/navigation'
import { ConversationCustom } from '../model'
import SearchUsers from '../components/search/searchUser'
import MessageList from '../components/messages/messages'

export interface ChatPageProps {}

export default function ChatPage(props: ChatPageProps) {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [conversationList, setConversationList] = useState<ConversationCustom[]>([])
  const [conversation, setConversation] = useState<ConversationCustom>()
  const router = useRouter()
  const searchParams = useSearchParams()

  const getConversationList = async (userId: string) => {
    const response = await fetch(`http://127.0.0.1:8000/${userId}/conversations`)
    const conversationList: ConversationCustom[] = await response.json()
    if (conversationList.length > 0 && searchParams.get('currentChat') === null) {
      router.push('/chat/?currentChat=' + conversationList[0].id)
    }
    setConversationList(conversationList)
  }

  const getMessages = async (conversationId: string) => {
    const response = await fetch(`http://127.0.0.1:8000/${conversationId}/messages`)
    const messages: Message[] = await response.json()
    console.log('messages:', messages)
    setMessages(messages)
  }

  useEffect(() => {
    if (session?.user.id) getConversationList(session?.user.id)
  }, [session?.user.id, searchParams.get('currentChat')])

  useEffect(() => {
    if (searchParams.get('currentChat') !== null) {
      const currentChat = conversationList.find(c => c.id === searchParams.get('currentChat'))
      setConversation(currentChat)
      if (currentChat?.id) getMessages(currentChat.id)
    }
  }, [conversationList.length, searchParams.get('currentChat')])

  if (status === 'loading') {
    return <div>Loading...</div>
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
          {conversationList &&
            conversationList.map(conversation => (
              <UserCard
                key={conversation.id}
                conversationId={conversation.id}
                name={session?.user?.id === conversation.user1Id ? conversation.user2.name! : conversation.user1.name!}
                content=''
                avatar={
                  session?.user?.id === conversation.user1Id ? conversation?.user2?.image! : conversation?.user1?.image!
                }
              />
            ))}
        </Grid>
        <Grid item xs={8} sx={{ p: 0, borderRight: '1px solid #ccc' }}>
          <Box width='100%' position='relative'>
            <Stack p={2} spacing={2} direction='row' alignItems='center '>
              {session?.user?.id === conversation?.user1Id ? (
                <Avatar src={conversation?.user2?.image!} />
              ) : (
                <Avatar src={conversation?.user1?.image!} />
              )}
              <Typography variant='h5' component='h1' fontWeight='bold' mb={1}>
                {session?.user?.id === conversation?.user1Id ? conversation?.user2.name : conversation?.user1.name}
              </Typography>
            </Stack>
            <Divider />
            <MessageList
              userId={session?.user?.id!}
              conversation={conversation!}
              getMessages={getMessages}
              messages={messages!}
              setMessages={setMessages}
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
