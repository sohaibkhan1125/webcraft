'use client'
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function StopwatchAndTimer() {
  // Stopwatch state
  const [stopwatchTime, setStopwatchTime] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);
  const stopwatchRef = useRef(null);

  // Timer state
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timerTime, setTimerTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef(null);

  // Stopwatch functions
  const startStopwatch = () => {
    if (!isStopwatchRunning) {
      setIsStopwatchRunning(true);
      stopwatchRef.current = setInterval(() => {
        setStopwatchTime((prevTime) => prevTime + 10);
      }, 10);
    }
  };

  const stopStopwatch = () => {
    if (isStopwatchRunning) {
      clearInterval(stopwatchRef.current);
      setIsStopwatchRunning(false);
    }
  };

  const resetStopwatch = () => {
    clearInterval(stopwatchRef.current);
    setIsStopwatchRunning(false);
    setStopwatchTime(0);
  };

  // Timer functions
  const startTimer = () => {
    if (!isTimerRunning) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds > 0) {
        setTimerTime(totalSeconds);
        setIsTimerRunning(true);
        timerRef.current = setInterval(() => {
          setTimerTime((prevTime) => {
            if (prevTime <= 0) {
              clearInterval(timerRef.current);
              setIsTimerRunning(false);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    }
  };

  const stopTimer = () => {
    if (isTimerRunning) {
      clearInterval(timerRef.current);
      setIsTimerRunning(false);
    }
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsTimerRunning(false);
    setTimerTime(0);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  // Format time functions
  const formatTime = (time) => {
    const ms = time % 1000;
    const s = Math.floor(time / 1000) % 60;
    const m = Math.floor(time / 60000) % 60;
    const h = Math.floor(time / 3600000);

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  };

  const formatTimerTime = (time) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = time % 60;

    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearInterval(stopwatchRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <section>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Stopwatch & Timer</CardTitle>
              <CardDescription>
                Track time with stopwatch or set a countdown timer
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="stopwatch" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="stopwatch">Stopwatch</TabsTrigger>
                  <TabsTrigger value="timer">Timer</TabsTrigger>
                </TabsList>
                <TabsContent value="stopwatch">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-4xl font-mono">{formatTime(stopwatchTime)}</h2>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={startStopwatch}
                        disabled={isStopwatchRunning}
                        className="flex-1"
                      >
                        Start
                      </Button>
                      <Button
                        onClick={stopStopwatch}
                        disabled={!isStopwatchRunning}
                        variant="outline"
                        className="flex-1"
                      >
                        Stop
                      </Button>
                      <Button
                        onClick={resetStopwatch}
                        variant="outline"
                        className="flex-1"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="timer">
                  <div className="space-y-6">
                    <div className="text-center">
                      <h2 className="text-4xl font-mono">
                        {timerTime > 0 ? formatTimerTime(timerTime) : '00:00:00'}
                      </h2>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="hours">Hours</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="0"
                          max="23"
                          value={hours}
                          onChange={(e) => setHours(parseInt(e.target.value) || 0)}
                          disabled={isTimerRunning}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="minutes">Minutes</Label>
                        <Input
                          id="minutes"
                          type="number"
                          min="0"
                          max="59"
                          value={minutes}
                          onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
                          disabled={isTimerRunning}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="seconds">Seconds</Label>
                        <Input
                          id="seconds"
                          type="number"
                          min="0"
                          max="59"
                          value={seconds}
                          onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
                          disabled={isTimerRunning}
                          className="mt-2"
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={startTimer}
                        disabled={isTimerRunning || (hours === 0 && minutes === 0 && seconds === 0)}
                        className="flex-1"
                      >
                        Start
                      </Button>
                      <Button
                        onClick={stopTimer}
                        disabled={!isTimerRunning}
                        variant="outline"
                        className="flex-1"
                      >
                        Stop
                      </Button>
                      <Button
                        onClick={resetTimer}
                        variant="outline"
                        className="flex-1"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer/>
    </section>
  );
}
