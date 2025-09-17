import { GalleryVerticalEnd } from "lucide-react";
import {useRegisterCompany} from "@/hooks/useRegisterCompany.ts";
import {RegisterCompanyForm} from "@/components/register-company-form.tsx";

interface RegisterData {
    name: string;
    email: string;
    address: string;
    phone: string;
    adminName: string;
    adminLastName: string;
    adminEmail: string;
}

export default function RegisterCompany() {
    const { mutate: registerCompany, isPending, isSuccess} = useRegisterCompany();

    const handleRegister = (data: RegisterData) => {
        registerCompany(data);
    };

    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-lg flex-col gap-6 ">
                <a href="/" className="flex items-center gap-2 self-center font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                        <GalleryVerticalEnd className="size-4" />
                    </div>
                    Acme Inc.
                </a>
                <RegisterCompanyForm
                    onSubmit={handleRegister}
                    isLoading={isPending}
                    isSuccess={isSuccess}
                />
            </div>
        </div>
    )
}