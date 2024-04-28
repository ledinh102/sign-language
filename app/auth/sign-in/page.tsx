'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { GitHub, Google } from '@mui/icons-material'
import { Box, Button, Divider, Paper, Stack, TextField, Typography } from '@mui/material'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import styles from '../auth.module.scss'
import { toast } from 'react-toastify'

const formSchema = z.object({
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
      email: '',
      password: ''
    },
    resolver: zodResolver(formSchema)
  })

  const onSubmit: SubmitHandler<FormFields> = async data => {
    const signInData = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    })
    if (signInData?.error) {
      console.log(signInData.error)
    } else {
      // toast.success('Sign in successfully!')
      router.push('/')
      router.refresh()
    }
  }
  return (
    <Box height='70vh'>
      <Stack sx={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
        <Paper sx={{ mt: 4, width: '360px', p: 3, borderRadius: '10px' }} elevation={24}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography component='h2' variant='h6' textAlign='center'>
              Sign in
            </Typography>
            <Stack mt={2} spacing={2}>
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
                {isSubmitting ? 'Submitting...' : 'Sign in'}
              </Button>
              <Divider sx={{ py: 1 }}>or</Divider>
              <Button startIcon={<Google />} variant='outlined' onClick={() => signIn('google')}>
                Sign in with Google
              </Button>
            </Stack>
          </form>

          <Typography textAlign='center' mt={2}>
            Don&apos;t have an account{' '}
            <Link href='/auth/sign-up' className={styles.redirectLink}>
              Sign up
            </Link>
          </Typography>
        </Paper>
      </Stack>
    </Box>
  )
}
