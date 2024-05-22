import Call from '@/app/components/call/call'
import { Box } from '@mui/material'

export default function Page({ params }: { params: { channelName: string } }) {
  return <Call appId={process.env.PUBLIC_AGORA_APP_ID!} channelName={params.channelName} />
}
