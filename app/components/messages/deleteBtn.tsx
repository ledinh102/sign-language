import { IconButton } from '@mui/material'
import styles from './messages.module.scss'
import { DeleteRounded } from '@mui/icons-material'

export interface DeleteBtnProps {
  messageId: string
  ws: WebSocket
}

export default function DeleteBtn({ messageId, ws }: DeleteBtnProps) {
  const deleteMessage = async (messageId: string) => {
    const response = await fetch(`http://192.168.1.44:8000/messages/${messageId}`, {
      method: 'DELETE'
    })
    const deletedMessage = await response.json()
    if (ws) ws.send(JSON.stringify(deletedMessage))
  }

  return (
    <IconButton className={styles.deleteIcon} sx={{ display: 'none' }} onClick={() => deleteMessage(messageId)}>
      <DeleteRounded />
    </IconButton>
  )
}
