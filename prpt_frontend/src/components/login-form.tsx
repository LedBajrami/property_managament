import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type FormEvent } from "react"
import {Link} from "react-router";

interface LoginData {
    email: string;
    password: string;
}

interface LoginFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
    onSubmit: (data: LoginData) => void;
    isLoading?: boolean;
}

export function LoginForm( { className, onSubmit, isLoading = false, ...props}: LoginFormProps) {

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const loginData: LoginData = {
            email: formData.get("email") as string,
            password: formData.get("password") as string,
        };

        onSubmit(loginData);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="grid gap-3">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                    <a
                                        href="/forgot-password"
                                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                    >
                                        Forgot your password?
                                    </a>
                                </div>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>
                            </div>
                        </div>
                        <div className="mt-4 text-center text-sm">
                            <Link to="/register-company" className="underline underline-offset-4">
                                Register your company
                            </Link>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}