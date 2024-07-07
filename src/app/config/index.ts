import dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.join(process.cwd(), '.env') })

export default {
    // node_env: process.env.
    secret_key: process.env.SECRET_KEY
}