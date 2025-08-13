import { Card } from "@/components/ui/card";

export const Flight = ({ flight, index }) => {
    return (
        <Card
            className="group p-3 mb-1 transition-all duration-300 hover:scale-[1.02] animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div
                        className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                        {flight?.Supplier?.substring(0, 2) || 'FL'}
                    </div>
                    <div>
                        <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {flight?.Supplier}
                        </div>
                        <div className="text-sm text-muted-foreground">
                            Flight {flight?.FlightNumber}
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-2xl font-bold text-foreground">
                        ${flight?.GrossPrice}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Net: ${flight?.NetPrice}
                    </div>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center text-sm text-muted-foreground">
                    <svg className="w-4 h-4 mr-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Departs: {new Date(flight?.DepartureTime).toLocaleString()}
                </div>
            </div>
        </Card>
    );
};