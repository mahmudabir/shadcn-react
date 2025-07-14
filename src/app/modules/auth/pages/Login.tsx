import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { useNavigate } from "react-router-dom"
import React, { useState } from "react";
import { getLoginFormData, setLoginData, USERNAME_KEY } from "@/lib/authUtils.ts";
import axios from "axios";
import { cn } from "@/lib/utils.ts";
import { Loader2Icon } from "lucide-react";
import { BASE_PATHS } from "@/app/modules/dashboard/routes/dashboard-paths.ts";
import { toastError } from "@/lib/toasterUtils.tsx";

const API_LOGIN = "http://localhost:5000/api/auth/token";

export default function Login({ className , ...props }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = getLoginFormData(username, password);

            const res = await axios.post(API_LOGIN, formData);
            const { access_token, refresh_token } = res.data;
            localStorage.setItem(USERNAME_KEY, username);
            setLoginData(access_token, refresh_token);
            setIsLoading(false);
            navigate(BASE_PATHS.index());
        } catch (err) {
            setIsLoading(false);
            toastError(err.response?.data?.message || "Login failed");
            setError(err.response?.data?.message || "Login failed");
        }
    };
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
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
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            type="text"
                                            placeholder="Username or email address"
                                            required
                                            value={username} onChange={e => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center">
                                            <Label htmlFor="password">Password</Label>
                                            <a
                                                href="#"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Forgot your password?
                                            </a>
                                        </div>
                                        <Input id="password" type="password" required value={password}
                                               onChange={e => setPassword(e.target.value)}/>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <Button disabled={isLoading} type="submit" className="w-full">
                                            {isLoading && <Loader2Icon className="animate-spin"/>}
                                            Login
                                        </Button>
                                        {/*<Button variant="outline" className="w-full">*/}
                                        {/*    Login with Google*/}
                                        {/*</Button>*/}
                                    </div>
                                    <small className="flex justify-center items-center text-destructive">{error}</small>
                                </div>
                                {/*<div className="mt-4 text-center text-sm">*/}
                                {/*    Don&apos;t have an account?{" "}*/}
                                {/*    <a href="#" className="underline underline-offset-4">*/}
                                {/*        Sign up*/}
                                {/*    </a>*/}
                                {/*</div>*/}
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
