"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [age, setAge] = useState(null);
  const [error, setError] = useState("");

  const calculateAge = () => {
    if (!birthDate) {
      setError("Please enter your birth date");
      setAge(null);
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) {
      setError("Birth date cannot be in the future");
      setAge(null);
      return;
    }

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, birth.getDate());
      days = Math.floor((today - lastMonth) / (1000 * 60 * 60 * 24));
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    setError("");
    setAge({ years, months, days });
  };

  return (
    <section>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Age Calculator</CardTitle>
              <CardDescription>
                Calculate your exact age in years, months, and days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="birthDate">Birth Date</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full"
                  />
                </div>
                {error && (
                  <p className="text-red-500 text-sm">{error}</p>
                )}
                <Button onClick={calculateAge} className="w-full">
                  Calculate Age
                </Button>
              </div>

              {age && (
                <div className="mt-6 space-y-2">
                  <h3 className="font-semibold">Your Age:</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{age.years}</p>
                      <p className="text-sm text-gray-600">Years</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{age.months}</p>
                      <p className="text-sm text-gray-600">Months</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold text-blue-600">{age.days}</p>
                      <p className="text-sm text-gray-600">Days</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                This calculator provides your exact age based on the current date.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </section>
  );
}
