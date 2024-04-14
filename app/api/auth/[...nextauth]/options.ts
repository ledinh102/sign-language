import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { db } from '@/lib/db'
import { compare } from 'bcrypt'

export const options: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.PUBLIC_CLIENT_ID as string,
      clientSecret: process.env.PUBLIC_CLIENT_SECRET as string
    }),
    GitHubProvider({
      clientId: process.env.PUBLIC_GITHUB_ID as string,
      clientSecret: process.env.PUBLIC_GITHUB_SECRET as string
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'example@gmail.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const existUser = await db.user.findUnique({
          where: { email: credentials?.email }
        })

        if (!existUser) return null

        const passwordMatch = await compare(credentials.password, existUser.password)

        if (!passwordMatch) return null

        const { password, ...rest } = existUser
        return rest
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  secret: process.env.PUBLIC_NEXTAUTH_SECRET
}
