import * as BBService from '@/third-party/byblock/service'

async function checkAPIHealth() {
    try {
        return await BBService.checkServerHealth()
    } catch (error) {
        return undefined
    }
}
export { checkAPIHealth }
