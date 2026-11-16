import assert from 'node:assert/strict'
import {
  ADMIN_STATUS,
  getLocalSession,
  getVerifiedSession,
  isEmailAllowed,
  resolveAdminStatus,
} from '../src/lib/authGuard.js'

// --- isEmailAllowed -------------------------------------------------------
// Daftar kosong berarti semua user terautentikasi diizinkan (perilaku lama).
assert.equal(isEmailAllowed('siapa@contoh.com', ''), true)
assert.equal(isEmailAllowed('siapa@contoh.com', '   '), true)
assert.equal(isEmailAllowed('siapa@contoh.com', undefined), true)

// Pencocokan tidak peduli huruf besar/kecil dan spasi di sekitar koma.
const allowList = ' Admin@Banyu.com , pemilik@banyu.com '
assert.equal(isEmailAllowed('admin@banyu.com', allowList), true)
assert.equal(isEmailAllowed('ADMIN@BANYU.COM', allowList), true)
assert.equal(isEmailAllowed('pemilik@banyu.com', allowList), true)
assert.equal(isEmailAllowed('lain@banyu.com', allowList), false)
assert.equal(isEmailAllowed('', allowList), false)
assert.equal(isEmailAllowed(undefined, allowList), false)

// Daftar berisi hanya koma/tanpa entri valid diperlakukan seperti kosong.
assert.equal(isEmailAllowed('lain@banyu.com', ' , , '), true)

// --- resolveAdminStatus ---------------------------------------------------
assert.equal(resolveAdminStatus(null, allowList), ADMIN_STATUS.unauthed)
assert.equal(resolveAdminStatus({}, allowList), ADMIN_STATUS.unauthed)
assert.equal(resolveAdminStatus({ user: null }, allowList), ADMIN_STATUS.unauthed)
assert.equal(resolveAdminStatus({ user: { email: 'admin@banyu.com' } }, allowList), ADMIN_STATUS.authed)
assert.equal(resolveAdminStatus({ user: { email: 'lain@banyu.com' } }, allowList), ADMIN_STATUS.forbidden)
// Tanpa daftar email, sesi apa pun dianggap boleh.
assert.equal(resolveAdminStatus({ user: { email: 'apa@pun.com' } }, ''), ADMIN_STATUS.authed)

// --- getVerifiedSession / getLocalSession ---------------------------------
function makeClient({ user = null, userError = null, session = null, throws = false } = {}) {
  return {
    auth: {
      getUser: async () => {
        if (throws) throw new Error('jaringan mati')
        return { data: { user }, error: userError }
      },
      getSession: async () => {
        if (throws) throw new Error('jaringan mati')
        return { data: { session }, error: null }
      },
    },
  }
}

const user = { id: 'u1', email: 'admin@banyu.com' }
const session = { access_token: 'token', user }

const verified = await getVerifiedSession(makeClient({ user, session }))
assert.equal(verified.verified, true)
assert.deepEqual(verified.session, session)

// Server menolak user: sesi lokal dibuang supaya tidak dipakai lagi.
const rejected = await getVerifiedSession(makeClient({ user: null, userError: { message: 'invalid' }, session }))
assert.equal(rejected.verified, true)
assert.equal(rejected.session, null)

// Gangguan jaringan: jangan buang sesi lokal, cukup tandai belum terverifikasi.
const offline = await getVerifiedSession(makeClient({ throws: true }))
assert.equal(offline.verified, false)
assert.equal(offline.session, null)

// Klien tidak tersedia (env Supabase hilang) tidak boleh melempar error.
assert.deepEqual(await getVerifiedSession(null), { session: null, verified: false })
assert.equal(await getLocalSession(null), null)

assert.deepEqual(await getLocalSession(makeClient({ session })), session)
assert.equal(await getLocalSession(makeClient({ session: null })), null)

console.log('auth guard helpers: ok')
