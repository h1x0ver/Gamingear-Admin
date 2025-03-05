import { useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import AuthContext from './AuthContext'
import appConfig from '@/configs/app.config'
import { useSessionUser, useToken } from '@/store/authStore'
import { apiSignIn, apiSignOut, apiSignUp, apiRefreshToken } from '@/services/AuthService'
import { REDIRECT_URL_KEY } from '@/constants/app.constant'
import { useNavigate } from 'react-router-dom'
import type {
    SignInCredential,
    SignUpCredential,
    AuthResult,
    OauthSignInCallbackPayload,
    User,
    Token,
} from '@/@types/auth'
import type { ReactNode } from 'react'
import type { NavigateFunction } from 'react-router-dom'

type AuthProviderProps = { children: ReactNode }

export type IsolatedNavigatorRef = {
    navigate: NavigateFunction
}

const IsolatedNavigator = forwardRef<IsolatedNavigatorRef>((_, ref) => {
    const navigate = useNavigate()

    useImperativeHandle(ref, () => ({ navigate }), [navigate])

    return null
})

function AuthProvider({ children }: AuthProviderProps) {
    const signedIn = useSessionUser((state) => state.session.signedIn)
    const user = useSessionUser((state) => state.user)
    const setUser = useSessionUser((state) => state.setUser)
    const setSessionSignedIn = useSessionUser((state) => state.setSessionSignedIn)
    const { token, setToken } = useToken()

    const authenticated = Boolean(token && signedIn)
    const navigatorRef = useRef<IsolatedNavigatorRef>(null)

    useEffect(() => {
        if (authenticated) redirect()
    }, [authenticated])

    // Функция обновления токена
    const refreshAuthToken = async () => {
        try {
            const resp = await apiRefreshToken(); // Получаем новый токен через API
            if (resp?.token) {
                setToken(resp.token)
                localStorage.setItem('accessToken', resp.token)
                // Optionally, вы можете обновить дату истечения срока действия
            }
        } catch (error) {
            console.error('Error refreshing token:', error);
            handleSignOut(); // Выйти, если не удалось обновить токен
        }
    }

    // Проверка срока действия токена и обновление, если нужно
    useEffect(() => {
        const interval = setInterval(() => {
            const expirationDate = localStorage.getItem('expirationDate');
            const currentTime = new Date().getTime();
            const tokenExpiration = new Date(expirationDate).getTime();

            if (expirationDate && currentTime >= tokenExpiration - 60000) { // за минуту до истечения
                refreshAuthToken();
            }
        }, 9 * 60 * 1000); // каждые 9 минут

        return () => clearInterval(interval);
    }, []);

    // Функция перенаправления
    const redirect = () => {
        const search = new URLSearchParams(window.location.search)
        const redirectUrl = search.get(REDIRECT_URL_KEY) || appConfig.authenticatedEntryPath
        navigatorRef.current?.navigate(redirectUrl)
    }

    // Обработка успешного входа
    const handleSignIn = (tokens: Token, user?: User) => {
        if (!tokens?.accessToken) return
        setToken(tokens.accessToken)
        setSessionSignedIn(true)
        if (user) setUser(user)
    }

    // Обработка выхода из системы
    const handleSignOut = () => {
        setToken('')
        setUser(null)
        setSessionSignedIn(false)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('expirationDate')
    }

    // Функция для входа в систему
    const signIn = async (values: SignInCredential): Promise<AuthResult> => {
        try {
            const resp = await apiSignIn(values)
            if (resp?.token) {
                handleSignIn({ accessToken: resp.token }, resp.user)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'Unable to sign in' }
        } catch (errors: any) {
            return { status: 'failed', message: errors?.response?.data?.message || errors.toString() }
        }
    }

    // Функция для регистрации
    const signUp = async (values: SignUpCredential): Promise<AuthResult> => {
        try {
            const resp = await apiSignUp(values)
            if (resp?.token) {
                handleSignIn({ accessToken: resp.token }, resp.user)
                redirect()
                return { status: 'success', message: '' }
            }
            return { status: 'failed', message: 'Unable to sign up' }
        } catch (errors: any) {
            return { status: 'failed', message: errors?.response?.data?.message || errors.toString() }
        }
    }

    // Функция для выхода из системы
    const signOut = async () => {
        try {
            await apiSignOut()
        } finally {
            handleSignOut()
            navigatorRef.current?.navigate(appConfig.unAuthenticatedEntryPath)
        }
    }

    // OAuth вход
    const oAuthSignIn = (callback: (payload: OauthSignInCallbackPayload) => void) => {
        callback({ onSignIn: handleSignIn, redirect })
    }

    return (
        <AuthContext.Provider value={{ authenticated, user, signIn, signUp, signOut, oAuthSignIn }}>
            {children}
            <IsolatedNavigator ref={navigatorRef} />
        </AuthContext.Provider>
    )
}

IsolatedNavigator.displayName = 'IsolatedNavigator'

export default AuthProvider
