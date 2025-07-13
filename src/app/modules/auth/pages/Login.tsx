import { Button } from "@/components/ui/button.tsx"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import { useNavigate } from "react-router-dom"
import React, { useState } from "react";
import { getLoginFormData, setLoginData, USERNAME_KEY } from "@/lib/authUtils.ts";
import axios from "axios";
import { cn } from "@/lib/utils.ts";

const API_LOGIN = "http://localhost:5000/api/auth/token";

export default function Login({ className, ...props }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const formData = getLoginFormData(username, password);

            const res = await axios.post(API_LOGIN, formData);
            const { access_token, refresh_token } = res.data;
            localStorage.setItem(USERNAME_KEY, username);
            setLoginData(access_token, refresh_token);
            navigate("/");
        } catch (err) {
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
                                        <Button type="submit" className="w-full">
                                            Login
                                        </Button>
                                        {/*<Button variant="outline" className="w-full">*/}
                                        {/*    Login with Google*/}
                                        {/*</Button>*/}
                                    </div>
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
