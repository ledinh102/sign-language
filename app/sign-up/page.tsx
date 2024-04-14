'use client'
import { GitHub, Google } from '@mui/icons-material'
import { Button, Chip, Divider, Paper, Stack, TextField, Typography } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  username: z.string().min(1, 'Username is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(1, 'Password is required').min(8, 'Password must have than 8 characters')
})

type FormFields = z.infer<typeof formSchema>

export default function SignUpPage() {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError
  } = useForm<FormFields>({
    defaultValues: {
      username: '',
      email: '',
      password: ''
    },
    resolver: zodResolver(formSchema)
  })
  const onSubmit: SubmitHandler<FormFields> = async data => {
    try {
      const res = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      if (res.ok) router.push('/sign-in')
      else console.error('Registration failed')

      console.log(data)
    } catch (err) {
      setError('email', {
        message: 'This email is already taken'
      })
    }
  }
  return (
    <Stack sx={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
      <Paper sx={{ mt: 4, width: '360px', p: 3, borderRadius: '10px' }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Typography component='h2' variant='h6' textAlign='center'>
            Sign up
          </Typography>
          <Stack mt={2} spacing={2}>
            <TextField
              {...register('username')}
              label='Username'
              type='text'
              placeholder='john'
              variant='outlined'
              size='small'
              fullWidth
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            <TextField
              {...register('email')}
              label='Email'
              type='email'
              placeholder='john@gmail.com'
              variant='outlined'
              size='small'
              fullWidth
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              {...register('password')}
              label='Password'
              type='password'
              variant='outlined'
              size='small'
              fullWidth
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type='submit' disabled={isSubmitting} variant='contained'>
              {isSubmitting ? 'Submitting...' : 'Sign up'}
            </Button>
            <Divider sx={{ py: 1 }}>or</Divider>
            <Button startIcon={<Google />} variant='outlined'>
              Sign in with Google
            </Button>
            <Button startIcon={<GitHub />} variant='outlined'>
              Sign in with Github
            </Button>
          </Stack>
        </form>
      </Paper>
    </Stack>
  )
}
