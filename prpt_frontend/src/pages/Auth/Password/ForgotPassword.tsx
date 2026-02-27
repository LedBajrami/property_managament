import { GalleryVerticalEnd } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { FormEvent, useState } from "react";
import { useForgotPassword } from "@/hooks/Auth/useForgotPassword.ts";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const { mutate, isPending, isSuccess, isError, error } = useForgotPassword();

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutate({ email });
    };

    if (isSuccess) {
        return (
            <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <Card className="w-full max-w-sm">
                    <CardHeader>
                        <CardTitle>Check your email</CardTitle>
                        <CardDescription>
                            If that email exists, a password reset link has been sent.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" variant="outline" onClick={() => navigate('/login')}>
                            Back to Login
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
                <Card>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email and we'll send you a link to set a new password.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        required
                                        disabled={isPending}
                                    />
                                </div>
                                {isError && (
                                    <p className="text-sm text-red-500">
                                        {(error as any)?.response?.data?.message || 'Something went wrong, please try again.'}
                                    </p>
                                )}
                                <div className="flex flex-col gap-3">
                                    <Button type="submit" className="w-full" disabled={isPending}>
                                        {isPending ? 'Sending...' : 'Send Reset Link'}
                                    </Button>
                                    <Button type="button" variant="outline" className="w-full" onClick={() => navigate('/login')}>
                                        Back to Login
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}