import { NuxtAuthHandler } from '#auth'
import GoogleProvider from 'next-auth/providers/google'
import User from '~/server/models/User'
import connectDB from '~/server/utils/database'

// Ambil config dari Nuxt
const config = useRuntimeConfig()

export default NuxtAuthHandler({
  // Kunci rahsia untuk menandatangani token. Diambil dari .env
  secret: config.authSecret,

  // Konfigurasi pembekal (provider) pengesahan
  providers: [
    // Rujuk dokumentasi untuk isu 'default' ini.
    // @ts-expect-error
    GoogleProvider.default({
      clientId: config.googleClientId,
      clientSecret: config.googleClientSecret,
    }),
  ],
  
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      if (account.provider === 'google') {
        try {
          await connectDB()
          
          const existingUser = await User.findOne({ googleId: user.id })

          if (existingUser) {
            // Kemas kini tarikh log masuk terakhir jika pengguna sudah wujud
            existingUser.lastLogin = new Date()
            await existingUser.save()
          } else {
            // Cipta pengguna baru jika tidak wujud
            await User.create({
              googleId: user.id,
              email: user.email,
              name: user.name,
              picture: user.image,
            })
          }
          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          // Mengembalikan false akan menghalang proses log masuk
          return false
        }
      }
      return true // Benarkan untuk provider lain (jika ada)
    },

    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        // Apabila pengguna log masuk kali pertama, cari ID MongoDB mereka
        const dbUser = await User.findOne({ googleId: user.id })
        if (dbUser) {
          // Simpan ID MongoDB ke dalam token
          token.id = dbUser._id
        }
      }
      return token
    },
    
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        // Tambah ID MongoDB ke objek session di client-side
        session.user.id = token.id
      }
      return session
    }
  }
}) 