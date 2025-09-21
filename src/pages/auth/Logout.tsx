import { useAuthMutation } from "../../common/api";
import { AxiosError } from "axios"
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


export const useLogout = () => {
    const mutate = useAuthMutation("/logout");
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await mutate.mutateAsync({ username: "", password: "" }, {
                onSuccess: (/* data: any */) => {
                    clearCookies()
                }
            })
            navigate(`/login`);
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error);
            }
        }
    }

    return handleLogout;
};

const clearCookies = () => {
    Cookies.remove("bb_token")
}