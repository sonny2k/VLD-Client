
// utils
import axios from '../utils/axios';

export default async function Ex() {
    const URL = '/api/user/consultation/viewlistconsult'
    try {
        const res = await axios.get(URL)
        console.log(res.data)
        const hehe = res.data
        return hehe
    } catch (error) {
        console.log(error)
    }
} 


    

