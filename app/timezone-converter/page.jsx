'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TimezoneConverter() {
  const [fromTime, setFromTime] = useState('');
  const [fromTimezone, setFromTimezone] = useState('UTC');
  const [toTimezone, setToTimezone] = useState('UTC');
  const [convertedTime, setConvertedTime] = useState('');
  const [timezones, setTimezones] = useState([]);

  useEffect(() => {
    // Get all available timezones
    const availableTimezones = Intl.supportedValuesOf('timeZone');
    setTimezones(availableTimezones);
  }, []);

  const convertTime = () => {
    if (!fromTime) return;

    try {
      // Create a date object from the input time
      const [hours, minutes] = fromTime.split(':').map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);

      // Format the time in both timezones
      const fromOptions = {
        timeZone: fromTimezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };

      const toOptions = {
        timeZone: toTimezone,
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      };

      const fromFormatted = new Intl.DateTimeFormat('en-US', fromOptions).format(date);
      const toFormatted = new Intl.DateTimeFormat('en-US', toOptions).format(date);

      setConvertedTime(`${fromFormatted} ${fromTimezone} → ${toFormatted} ${toTimezone}`);
    } catch (error) {
      console.error('Error converting time:', error);
      setConvertedTime('Error converting time. Please check your input.');
    }
  };

  return (
    <section>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Timezone Converter</CardTitle>
              <CardDescription>
                Convert time between different timezones
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fromTime">Time</Label>
                    <Input
                      id="fromTime"
                      type="time"
                      value={fromTime}
                      onChange={(e) => setFromTime(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fromTimezone">From Timezone</Label>
                    <Select
                      value={fromTimezone}
                      onValueChange={setFromTimezone}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="toTimezone">To Timezone</Label>
                    <Select
                      value={toTimezone}
                      onValueChange={setToTimezone}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button
                  onClick={convertTime}
                  disabled={!fromTime}
                  className="w-full"
                >
                  Convert Time
                </Button>

                {convertedTime && (
                  <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                    <p className="text-lg font-medium text-center">{convertedTime}</p>
                  </div>
                )}

                <div className="mt-6 text-sm text-gray-500">
                  <p>Tips:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Enter the time you want to convert</li>
                    <li>Select the source and target timezones</li>
                    <li>Click Convert Time to see the result</li>
                    <li>All times are displayed in 24-hour format</li>
                    <li>Supports all major timezones worldwide</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer/>
    </section>
  );
}
