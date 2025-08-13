import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx"
import { Link } from "react-router-dom"

export default function Dashboard() {
    return (
        <>
            <div className="flex justify-start items-start">
                <h1 className="text-3xl font-bold">Dashboard</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                <Link to="/countries">
                    <Card className="hover:shadow-2xl">
                        <CardHeader>
                            <CardTitle>Countries</CardTitle>
                            <CardDescription>Go to countries list</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Dashboard content goes here</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/cities">
                    <Card className="hover:shadow-2xl">
                        <CardHeader>
                            <CardTitle>Cities</CardTitle>
                            <CardDescription>Go to cities list</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Dashboard content goes here</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/flights">
                    <Card className="hover:shadow-2xl">
                        <CardHeader>
                            <CardTitle>Flights</CardTitle>
                            <CardDescription>Go to flights list</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Dashboard content goes here</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/countries-tanstack">
                    <Card className="hover:shadow-2xl">
                        <CardHeader>
                            <CardTitle>Countries (Tanstack)</CardTitle>
                            <CardDescription>Go to countries list (Tanstack)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Dashboard content goes here</p>
                        </CardContent>
                    </Card>
                </Link>

                <Link to="/cities-tanstack">
                    <Card className="hover:shadow-2xl">
                        <CardHeader>
                            <CardTitle>Cities (Tanstack)</CardTitle>
                            <CardDescription>Go to cities list (Tanstack)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Dashboard content goes here</p>
                        </CardContent>
                    </Card>
                </Link>

                <Card className="hover:shadow-2xl">
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription>Your account overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Dashboard content goes here</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-2xl">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Your latest actions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Activity feed goes here</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-2xl">
                    <CardHeader>
                        <CardTitle>Notifications</CardTitle>
                        <CardDescription>Recent updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Notifications go here</p>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-2xl">
                    <CardHeader>
                        <CardTitle>Statistics</CardTitle>
                        <CardDescription>Your account overview</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Dashboard content goes here</p>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}
