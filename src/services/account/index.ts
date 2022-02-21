import Moralis from 'moralis';
import * as BBService from '@/third-party/byblock/service'


async function loginMoralis(){
    try {
        let user = Moralis.User.current();
        if (!user) {
            /* @ts-ignore */
          user = await Moralis.authenticate({ signingMessage: "Log in using Moralis" })
        }
        return user
    } catch (error) {
        console.log("services / account | loginMoralis | error: " ,error)
    }
}

function getCurrentUser() {
    try {
        const user = Moralis.User.current();
        return user
    } catch (error) {
        console.error("service / account | getCurrentUser > error:", error)
        throw "cannot get user, check logs"
    }
}


async function getApiAccessData(walletAddress: string) {
    try {
        return await BBService.getApiAccessData(walletAddress)
    } catch (error) {
        return undefined
    }
}

export { getCurrentUser, getApiAccessData, loginMoralis }