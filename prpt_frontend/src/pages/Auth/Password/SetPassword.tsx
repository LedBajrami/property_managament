import {GalleryVerticalEnd} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Button} from "@/components/ui/button.tsx";
import {FormEvent, useState} from "react";
import {useSetPassword} from "@/hooks/Auth/useSetPassword.ts";
import {useParams} from "react-router";
import {PasswordInput} from "@/components/ui/password-input.tsx";
import {useNavigate} from "react-router-dom";
import {useResendSetPasswordLink} from "@/hooks/Auth/useResendSetPasswordLink.ts";

interface SetPasswordData {
    url: string;
    data: {
        password: string;
        password_confirm: string;
    }
}

export default function SetPassword() {
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const navigate = useNavigate();

    const {id} = useParams();
    const urlParams = new URLSearchParams(window.location.search);
    const expires = urlParams.get('expires');
    const hash = urlParams.get('hash');
    const signature = urlParams.get('signature');
    const backendUrl = `${import.meta.env.VITE_API_URL}/reset-password-email/${id}?expires=${expires}&hash=${hash}&signature=${signature}`;


    const { mutate, isPending, isSuccess, isError, error} = useSetPassword();

    const { mutate: resendLink, isPending: isResending } = useResendSetPasswordLink();

    const handleResend = () => {
        resendLink(id);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const setPasswordData: SetPasswordData = {
            url: backendUrl,
            data: {
                password: formData.get("password") as string,
                password_confirm: formData.get("password_confirm") as string,
            }
        };

        mutate(setPasswordData);
    };

    if (isSuccess) {
        return (
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Password Set Successfully</CardTitle>
                        <CardDescription>You can now log in with your new password.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={() => navigate('/login')}>
                            Go to Login
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Something went wrong</CardTitle>
                        <CardDescription>{(error as any)?.response?.data?.message || 'This link is invalid or has already been used.'}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" onClick={handleResend} disabled={isResending}>
                            {isResending ? 'Sending...' : 'Resend Link'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }


    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Acme Inc.
                </a>
                <div className={cn("flex flex-col gap-6")}>
                    <Card>
                        <CardHeader>
                            <CardTitle>Set Password</CardTitle>
                            <CardDescription>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-col gap-6">
                                    <div className="grid gap-3">
                                        <Label htmlFor="password">Password</Label>
                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="********"
                                            required
                                            disabled={isPending}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="password_confirm">Confirm Password</Label>
                                        <PasswordInput
                                            id="password_confirm"
                                            name="password_confirm"
                                            value={passwordConfirm}
                                            onChange={(e) => setPasswordConfirm(e.target.value)}
                                            placeholder="********"
                                            required
                                            disabled={isPending}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            className="w-full"
                                            disabled={isPending}
                                        >
                                            Submit
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}