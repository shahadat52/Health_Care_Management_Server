import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
    // node_env: process.env.
    secret_key: process.env.SECRET_KEY,
    salt_round: process.env.SALT_ROUND,
    reset_secret_key: process.env.RESET_SECRET_KEY,
    reset_expire_in: process.env.RESET_EXPIRE_IN,
    reset_pass_link: process.env.RESET_PASS_LINK,
    email_sender_pass: process.env.EMAIL_SENDER_PASS
}