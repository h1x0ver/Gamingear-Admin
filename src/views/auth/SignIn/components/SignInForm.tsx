import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { FormItem, Form } from '@/components/ui/Form';
import PasswordInput from '@/components/shared/PasswordInput';
import { useSessionUser } from '@/store/authStore';

interface SignInFormProps {
    disableSubmit?: boolean;
    passwordHint?: string;
    setMessage?: (message: string) => void;
}

type SignInFormSchema = {
    email: string;
    password: string;
}

const validationSchema = z.object({
    email: z
        .string({ required_error: 'Please enter your email' })
        .min(1, { message: 'Please enter your email' })
        .email({ message: 'Invalid email format' }),
    password: z
        .string({ required_error: 'Please enter your password' })
        .min(6, { message: 'Password must be at least 6 characters' }),
});

const SignInForm = ({ disableSubmit = false, setMessage, passwordHint }: SignInFormProps) => {
    const [isSubmitting, setSubmitting] = useState<boolean>(false);
    const navigate = useNavigate();
    const { setSessionSignedIn, setUser, setToken } = useSessionUser(); // Получаем методы из контекста

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<SignInFormSchema>({
        defaultValues: {
            email: '',
            password: '',
        },
        resolver: zodResolver(validationSchema),
    });

    // Функция для входа в систему
    const onSignIn = async (values: SignInFormSchema) => {
        const { email, password } = values;

        if (!disableSubmit) {
            setSubmitting(true);

            try {
                const response = await fetch('https://gamingear.premiumasp.net/api/Auth/Login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                const result = await response.json();

                if (response.ok && result.accessToken?.token) {
                    // Сохраняем токен и время истечения
                    localStorage.setItem('accessToken', result.accessToken.token);
                    localStorage.setItem('expirationDate', result.accessToken.expirationDate);

                    // Обновляем состояние
                    setToken(result.accessToken.token); // Обновляем токен
                    setSessionSignedIn(true);
                    setUser(result.user); // Сохраняем пользователя

                    // Перенаправляем на Dashboard
                    navigate('/dashboard', { replace: true });
                } else {
                    setMessage?.(result.message || 'Login failed');
                }
            } catch (error) {
                console.error('Error:', error);
                setMessage?.('Network error');
            }

            setSubmitting(false);
        }
    };

    return (
        <Form onSubmit={handleSubmit(onSignIn)}>
            <FormItem label="Email" invalid={Boolean(errors.email)} errorMessage={errors.email?.message}>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => <Input type="email" placeholder="Email" autoComplete="off" {...field} />}
                />
            </FormItem>
            <FormItem label="Password" invalid={Boolean(errors.password)} errorMessage={errors.password?.message}>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <PasswordInput type="password" placeholder="Password" autoComplete="off" {...field} />
                    )}
                />
            </FormItem>
            {passwordHint}
            <Button block loading={isSubmitting} variant="solid" type="submit">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
        </Form>
    );
};

export default SignInForm;
