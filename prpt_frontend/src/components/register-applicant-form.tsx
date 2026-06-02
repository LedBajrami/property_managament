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
import { Link } from "react-router";
import { RegisterApplicantData } from "@/types/auth.ts";

interface RegisterApplicantFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
    onSubmit: (data: RegisterApplicantData) => void;
    isLoading?: boolean;
}

export function RegisterApplicantForm({ className, onSubmit, isLoading = false, ...props }: RegisterApplicantFormProps) {

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const registrationData: RegisterApplicantData = {
            first_name: formData.get("first_name") as string,
            last_name: formData.get("last_name") as string,
            email: formData.get("email") as string,
            phone: formData.get("phone") as string || undefined,
        };

        onSubmit(registrationData);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Create your account</CardTitle>
                    <CardDescription>
                        Register to browse available properties and apply for leases
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-3">
                                    <Label htmlFor="first_name">First Name</Label>
                                    <Input
                                        id="first_name"
                                        name="first_name"
                                        type="text"
                                        placeholder="John"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="last_name">Last Name</Label>
                                    <Input
                                        id="last_name"
                                        name="last_name"
                                        type="text"
                                        placeholder="Doe"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

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
                                <Label htmlFor="phone">Phone (Optional)</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex flex-col gap-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Creating account..." : "Create Account"}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2 text-center text-sm">
                            <div>
                                <span className="text-muted-foreground">Already have an account? </span>
                                <Link to="/login" className="underline underline-offset-4 hover:text-primary font-medium">
                                    Login here
                                </Link>
                            </div>
                            <div className="pt-2 border-t">
                                <span className="text-muted-foreground">Property manager? </span>
                                <Link to="/register-company" className="underline underline-offset-4 hover:text-primary font-medium">
                                    Register your company
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}