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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { type FormEvent } from "react"
import {Link} from "react-router";

interface RegisterCompanyData {
    name: string;
    email: string;
    address: string;
    phone: string;
    adminName: string;
    adminLastName: string;
    adminEmail: string;
}

interface RegisterCompanyFormProps extends Omit<React.ComponentProps<"div">, "onSubmit"> {
    onSubmit: (data: RegisterCompanyData) => void;
    isLoading?: boolean;
    isSuccess?: boolean;
}

export function RegisterCompanyForm( { className, onSubmit, isLoading = false, isSuccess = false, ...props}: RegisterCompanyFormProps) {

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const registerData: RegisterCompanyData = {
            name: formData.get("name") as string,
            email: formData.get("email") as string,
            address: formData.get("address") as string,
            phone: formData.get("phone") as string,
            adminEmail: formData.get("adminEmail") as string,
            adminName: formData.get("adminName") as string,
            adminLastName: formData.get("adminLastName") as string,
        };

        onSubmit(registerData);
    };

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            {isSuccess
                ? <Alert variant="success">
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>
                        Company and Admin User have been created successfully. Please go to the admin email, set up the password and login.
                    </AlertDescription>
                </Alert>
                : <Card>
                    <CardHeader>
                        <CardTitle>Register your company</CardTitle>
                        <CardDescription>
                            Enter the details for the company
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">

                                <div className='flex gap-3'>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="name">Name</Label>
                                        </div>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="name"
                                            placeholder="Acme Inc."
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="phone">Phone</Label>
                                        </div>
                                        <Input
                                            id="phone"
                                            name="phone"
                                            type="phone"
                                            placeholder="+123456789"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className='flex gap-3'>
                                    <div className="grid gap-3">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            placeholder="yourcompany@example.com"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            name="address"
                                            type="address"
                                            placeholder="St. Main Street, 122, Tirane"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className='flex gap-3'>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="adminName">Admin's Name</Label>
                                        </div>
                                        <Input
                                            id="adminName"
                                            name="adminName"
                                            type="adminName"
                                            placeholder="Admin"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="adminLastName">Admin's Last Name</Label>
                                        </div>
                                        <Input
                                            id="adminLastName"
                                            name="adminLastName"
                                            type="adminLastName"
                                            placeholder="Example"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <Label htmlFor="adminEmail">Admin's email</Label>
                                    <Input
                                        id="adminEmail"
                                        name="adminEmail"
                                        type="adminEmail"
                                        placeholder="admin@example.com"
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
                                        {isLoading ? "Registering..." : "Register"}
                                    </Button>
                                </div>
                            </div>
                            <div className="mt-4 text-center text-sm">
                                Already have a company registered?{" "}
                                <Link to="/login" className="underline underline-offset-4">
                                    Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            }
        </div>
    )
}