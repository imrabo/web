import { useCurrentUserQuery } from "./useAuthQuery";

export const useAuth = () => {
    const {
        data: user,
        isLoading,
        isError,
    } = useCurrentUserQuery();

    return {
        user: user ?? null,
        isAuthenticated: Boolean(user),
        isLoading,
        isError,
    };
};