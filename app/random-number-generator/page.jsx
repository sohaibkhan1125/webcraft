'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function RandomNumberGenerator() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const generateRandomNumber = () => {
    const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
    setResult(randomNum);
    setHistory(prev => [randomNum, ...prev].slice(0, 5));
  };

  return (
    <section>
    <Navbar/>
    
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Random Number Generator</CardTitle>
            <CardDescription>
              Generate random numbers within your specified range
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label htmlFor="min">Minimum Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={min}
                  onChange={(e) => setMin(Number(e.target.value))}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="max">Maximum Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={max}
                  onChange={(e) => setMax(Number(e.target.value))}
                  className="mt-2"
                />
              </div>
            </div>
            <Button onClick={generateRandomNumber} className="w-full">
              Generate Random Number
            </Button>
          </CardContent>
        </Card>

        {result !== null && (
          <Card>
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-center mb-6">{result}</div>
              {history.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Recent Numbers</h3>
                  <div className="flex gap-2">
                    {history.map((num, index) => (
                      <div
                        key={index}
                        className="bg-gray-100 px-4 py-2 rounded-lg"
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    <Footer/>
    </section>
  );
}
