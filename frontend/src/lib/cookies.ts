import Cookies from "universal-cookie";

const cookies = new Cookies();

export const getToken = (): string => cookies.get("@rsbp/token");

export const setToken = (token: string) => {
    cookies.set("@rsbp/token", token, { path: "/" });
};

export const removeToken = () => cookies.remove("@rsbp/token", { path: "/" });
