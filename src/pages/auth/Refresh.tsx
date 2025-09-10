import { useAuthMutation } from "../../common/api";
import { AxiosError } from "axios";
import Cookies from 'js-cookie';


export const useRefreshToken = () => {
    const mutate = useAuthMutation("/refresh");

    const handleRefresh = async () => {
        try {
            await mutate.mutateAsync({ username: "", password: "" }, {
                onSuccess: (data: any) => {
                    setCookies(data.data);
                }
            })
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error);
            }
        }
    }

    return handleRefresh;
};

const setCookies = (data: any) => {
    Cookies.set("bb_token", data.token);
    Cookies.set("bb_refresh_token", data.refresh_token);
}