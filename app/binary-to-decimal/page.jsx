'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function BinaryToDecimal() {
  const [binary, setBinary] = useState('');
  const [decimal, setDecimal] = useState('');
  const [error, setError] = useState('');

  const convertBinaryToDecimal = () => {
    setError('');
    // Validate binary input
    if (!binary) {
      setError('Please enter a binary number');
      setDecimal('');
      return;
    }

    // Check if input contains only 0s and 1s
    if (!/^[01]+$/.test(binary)) {
      setError('Binary numbers can only contain 0s and 1s');
      setDecimal('');
      return;
    }

    try {
      // Convert binary to decimal
      const decimalValue = parseInt(binary, 2);
      setDecimal(decimalValue.toString());
    } catch (err) {
      setError('Invalid binary number');
      setDecimal('');
    }
  };

  const handleBinaryChange = (e) => {
    const value = e.target.value;
    setBinary(value);
    setError('');
    setDecimal('');
  };

  return (
    <section>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Binary to Decimal Converter</CardTitle>
              <CardDescription>
                Convert binary numbers to their decimal equivalent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="binary">Binary Number</Label>
                  <Input
                    id="binary"
                    value={binary}
                    onChange={handleBinaryChange}
                    placeholder="Enter binary number (e.g., 1010)"
                    className="mt-2"
                  />
                  {error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                  )}
                </div>

                <Button onClick={convertBinaryToDecimal} className="w-full">
                  Convert to Decimal
                </Button>

                {decimal && (
                  <div className="mt-6">
                    <Label>Decimal Result</Label>
                    <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                      <p className="text-2xl font-mono">{decimal}</p>
                    </div>
                  </div>
                )}

                <div className="mt-6 text-sm text-gray-500">
                  <p>Tips:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Binary numbers can only contain 0s and 1s</li>
                    <li>Example: 1010 (binary) = 10 (decimal)</li>
                    <li>Maximum length: 32 bits</li>
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
