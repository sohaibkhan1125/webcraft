'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TextRepeater() {
  const [text, setText] = useState('');
  const [count, setCount] = useState(1);
  const [result, setResult] = useState('');
  const [separator, setSeparator] = useState('\n');

  const repeatText = () => {
    if (!text) return;
    const repeatedText = Array(count).fill(text).join(separator);
    setResult(repeatedText);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  return (
    <section>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Text Repeater</CardTitle>
              <CardDescription>
                Repeat your text multiple times with custom separators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="text">Text to Repeat</Label>
                  <Textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-2"
                    placeholder="Enter the text you want to repeat"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="count">Number of Times</Label>
                    <Input
                      id="count"
                      type="number"
                      min="1"
                      value={count}
                      onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="separator">Separator</Label>
                    <Input
                      id="separator"
                      value={separator}
                      onChange={(e) => setSeparator(e.target.value)}
                      className="mt-2"
                      placeholder="Enter separator (e.g., space, comma, newline)"
                    />
                  </div>
                </div>

                <Button onClick={repeatText} className="w-full">
                  Generate Repeated Text
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Result</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="relative">
                    <Textarea
                      value={result}
                      readOnly
                      className="min-h-[200px]"
                    />
                    <Button
                      onClick={copyToClipboard}
                      className="absolute top-2 right-2"
                      variant="outline"
                    >
                      Copy
                    </Button>
                  </div>
                  <div className="text-sm text-gray-500">
                    Character count: {result.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer/>
    </section>
  );
}
