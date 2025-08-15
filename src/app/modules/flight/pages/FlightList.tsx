import { useEffect, useRef, useState } from "react";
import baseFetch from "@/app/core/api/base-fetch.ts";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { ProgressBar } from "@/app/modules/flight/components/ProgressBar.tsx";
import { Flight } from "@/app/modules/flight/components/Flight.tsx";
import { baseURL } from "@/app/core/api/api-request-config.ts";

export const FlightList = () => {
  const MAX_RECONNECT_ATTEMPTS = 3;
  const DEFAULT_URL_POSTFIX = '-stream';

  const urlPostfixInputRef = useRef(null);

  const [searchInProgress, setSearchInProgress] = useState(false);
  const [responsePerSupplier, setResponsePerSupplier] = useState(false);
  const [enableEventStream, setEnableEventStream] = useState(true);
  const [urlPostfix, setUrlPostfix] = useState(DEFAULT_URL_POSTFIX);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [partialResults, setPartialResults] = useState([]);
  const [finalResults, setFinalResults] = useState([]);

  const abortControllerRef = useRef(null);
  const streamRef = useRef<{ close: () => void } | null>(null);
  const reconnectAttemptsRef = useRef(0);

  // Cleanup event source on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.close();
        streamRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    setFinalResults([]);
    setPartialResults([]);
  }, [enableEventStream]);

  // Handle visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && searchInProgress) {
        if (streamRef.current) {
          streamRef.current.close();
          streamRef.current = null;
        }
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          abortControllerRef.current = null;
        }
      } else if (!document.hidden && searchInProgress && !abortControllerRef.current) {
        handleError('Connection lost due to page visibility. Please restart search.');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [searchInProgress]);

  const getStatusText = (stage, metadata) => {
    switch (stage) {
      case "initializing":
        return "🚀 Initializing search...";
      case "fetching":
        return `✈️ Contacting suppliers (${metadata.CompletedSuppliers}/${metadata.TotalSuppliers})...`;
      case "processing":
        return `🔄 Processing flights (${metadata.ProcessedFlights}/${metadata.TotalFlights})...`;
      case "complete":
        return "✅ Search completed!";
      default:
        return "🔍 Searching...";
    }
  };

  const handleError = (message: string) => {
    setStatusText(message);
    setProgress(0);
    finishSearch();
  };

  const finishSearch = () => {
    setSearchInProgress(false);
    if (streamRef.current) {
      streamRef.current.close();
      streamRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  const connectToEventStream = async (url) => {
    // Close any previous stream before opening a new one
    if (streamRef.current) {
      streamRef.current.close();
      streamRef.current = null;
    }

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    setStatusText("🔗 Connecting...");
    reconnectAttemptsRef.current = 0;

    console.log("SSE connection opening");

    // Store the stream reference for cleanup
    streamRef.current = await baseFetch.eventStream(url, {
      signal,
      skipPreloader: true,
      onMessage: (message) => {
        try {
          const eventType = message.event || "message";
          const payload = message.data;

          if (eventType === "message") {
            const newProgress = Math.min(100, Math.max(0, payload.Metadata?.Progress || 0));
            const stage = payload.Metadata?.Stage || "processing";

            setProgress(newProgress);
            setStatusText(getStatusText(stage, payload.Metadata));

            if (payload?.Results?.length > 0) {
              setPartialResults(prev => [...prev, ...(payload?.Results ?? [])]);
            }
          }

          if (eventType === "complete") {
            setProgress(100);
            setStatusText("✅ Search completed!");
            if (payload?.Results?.length > 0) {
              setFinalResults(payload.Results);
            }
            finishSearch();
          }
        } catch (err) {
          console.error("Error processing SSE message:", err);
        }
      },
      onError: (error) => {
        if (error?.name === "AbortError") {
          console.log("BaseFetch stream aborted");
          return;
        }

        console.error("SSE baseFetch connection error:", error);

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS && searchInProgress) {
          // Ensure current stream is closed before attempting reconnect
          if (streamRef.current) {
            streamRef.current.close();
            streamRef.current = null;
          }
          reconnectAttemptsRef.current++;
          setProgress(-1);
          setStatusText(`🔄 Connection lost. Reconnecting... (${reconnectAttemptsRef.current}/${MAX_RECONNECT_ATTEMPTS})`);
          setTimeout(() => connectToEventStream(url), 2000);
        } else {
          handleError("❌ Connection failed. Please try again.");
        }
      }
    });
    console.log("SSE connection opened");
  };

  const startSearch = async () => {
    if (searchInProgress) return;

    setSearchInProgress(true);
    reconnectAttemptsRef.current = 0;
    setPartialResults([]);
    setFinalResults([]);
    setProgress(0);
    setStatusText("🚀 Initializing search...");

    const origin = "DXB";
    const destination = "LHR";
    const departureDate = "2025-08-15";
    const url = `${baseURL}/flights/search${urlPostfix}?origin=${origin}&destination=${destination}&departureDate=${departureDate}&isEventStream=${enableEventStream}&responsePerSupplier=${responsePerSupplier}`;

    if (enableEventStream) {
      if (streamRef.current) {
        streamRef.current.close();
        streamRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      await connectToEventStream(url);
    } else {
      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      baseFetch.get(url, { signal, skipPreloader: false })
        .then((data: any) => {
          setProgress(100);
          setStatusText("✅ Search completed!");
          setFinalResults(data.Results);
          finishSearch();
        })
        .catch(error => {
          if (error?.name !== "AbortError") {
            handleError("❌ Search failed. Please try again.");
          }
        });
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-4">
          <h1
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            ✈️ Flight Search
          </h1>
          <p className="text-sm text-muted-foreground">Real-time flight search with server-sent events</p>
        </div>

        {/* Controls */}
        <Card className="px-6 mb-4">
          <div className="flex flex-wrap justify-between gap-4">
            <Button
              onClick={startSearch}
              disabled={searchInProgress}
              size="lg"
              className="rounded-xl"
            >
              {searchInProgress ? (
                <span className="flex items-center">
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                                    Searching...
                                </span>
              ) : (
                '🔍 Search Flights'
              )}
            </Button>

            <div className="flex items-center space-x-2" hidden={!enableEventStream}>
              <Switch
                id="response-per-supplier"
                checked={responsePerSupplier}
                onCheckedChange={setResponsePerSupplier}
                disabled={searchInProgress}
              />
              <label htmlFor="response-per-supplier" className="text-sm font-medium text-foreground">
                Response Per Supplier
              </label>
            </div>

            <div className="flex items-center space-x-2" hidden={!enableEventStream}>
              <label htmlFor="url-postfix" className="text-sm font-medium text-foreground">URL
                Postfix:</label>
              <Input
                id="url-postfix"
                type="text"
                value={urlPostfix}
                onChange={(e) => setUrlPostfix(e.target.value)}
                disabled={searchInProgress || !enableEventStream}
                ref={urlPostfixInputRef}
                className="w-auto"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enable-event-stream"
                checked={enableEventStream}
                onCheckedChange={(checked) => {
                  setEnableEventStream(checked);
                  if (checked) {
                    setUrlPostfix(DEFAULT_URL_POSTFIX);
                    if (urlPostfixInputRef.current) {
                      urlPostfixInputRef.current.value = DEFAULT_URL_POSTFIX;
                    }
                  } else {
                    setUrlPostfix('');
                    if (urlPostfixInputRef.current) {
                      urlPostfixInputRef.current.value = '';
                    }
                  }
                }}
                disabled={searchInProgress}
              />
              <label htmlFor="enable-event-stream" className="text-sm font-medium text-foreground">
                Enable Event Stream
              </label>
            </div>
          </div>
        </Card>

        {/* Progress Bar */}
        <ProgressBar progress={progress} statusText={statusText}/>

        {/* Results */}
        <div className={`grid grid-cols-1 ${enableEventStream ? 'lg:grid-cols-2' : ''} gap-8`}>
          {enableEventStream && (
            <Card className="px-6">
              <div className="flex items-center mb-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-3"></div>
                <h2 className="text-xl font-semibold text-foreground">Live Results</h2>
                <Badge variant="secondary" className="ml-2">
                  {partialResults.length} flights
                </Badge>
              </div>
              <div className="max-h-96 overflow-y-auto overflow-x-hidden pr-2 space-y-2">
                {partialResults.length > 0 ? (
                  partialResults.map((flight, index) => (
                    <Flight key={`partial-${index}`} flight={flight} index={index}/>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div
                      className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                      {searchInProgress ? (
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                      ) : (
                        <span className="text-2xl">✈️</span>
                      )}
                    </div>
                    <p className="text-muted-foreground">
                      {searchInProgress ? "Waiting for results..." : "No results yet"}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          )}

          <Card className="px-6">
            <div className="flex items-center mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              <h2 className="text-xl font-semibold text-foreground">Final Results</h2>
              <Badge variant="secondary" className="ml-2">
                {finalResults?.length || 0} flights
              </Badge>
            </div>
            <div className="max-h-96 overflow-y-auto overflow-x-hidden pr-2 space-y-2">
              {finalResults?.length > 0 ? (
                finalResults.map((flight, index) => (
                  <Flight key={`final-${index}`} flight={flight} index={index}/>
                ))
              ) : (
                <div className="text-center py-12">
                  <div
                    className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    {progress === 100 ? (
                      <span className="text-2xl">📭</span>
                    ) : searchInProgress ? (
                      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground"/>
                    ) : (
                      <span className="text-2xl">🎯</span>
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {progress === 100
                      ? "No flights found."
                      : searchInProgress
                        ? "Waiting for final results..."
                        : "No results yet"}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};