import axios from "axios";

export const login = async (email: string, password: string) => {
    try {
        const res = await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/v1/user/signin", {
            email,
            password
        })

        if (res.status === 200) {
            return res.data;
        } else {
            return null
        }
    } catch (err) {
        console.log(err)
        return null
    }
};