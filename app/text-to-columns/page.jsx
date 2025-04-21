"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TextToColumns() {
  const [inputText, setInputText] = useState("");
  const [delimiter, setDelimiter] = useState(",");
  const [outputText, setOutputText] = useState("");

  const convertToColumns = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to convert");
      return;
    }

    try {
      const lines = inputText.split("\n");
      const convertedLines = lines.map(line => {
        const columns = line.split(delimiter);
        return columns.join("\t"); // Convert to tab-separated
      });
      setOutputText(convertedLines.join("\n"));
      toast.success("Text converted successfully!");
    } catch (error) {
      toast.error("Error converting text. Please check your input.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(outputText);
    toast.success("Copied to clipboard!");
  };

  return (
    <section>
    <Navbar/>
    
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Text to Columns Converter</CardTitle>
          <CardDescription>
            Convert your text into columns using a custom delimiter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="delimiter">Delimiter</Label>
            <Input
              id="delimiter"
              value={delimiter}
              onChange={(e) => setDelimiter(e.target.value)}
              placeholder="Enter delimiter (e.g., , or ; or |)"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="input">Input Text</Label>
            <Textarea
              id="input"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter your text here..."
              className="min-h-[200px]"
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={convertToColumns}>Convert</Button>
            <Button variant="outline" onClick={copyToClipboard} disabled={!outputText}>
              Copy Result
            </Button>
          </div>

          {outputText && (
            <div className="space-y-2">
              <Label>Output</Label>
              <div className="p-4 bg-muted rounded-md">
                <pre className="whitespace-pre-wrap">{outputText}</pre>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
    <Footer/>
    </section>
  );
}
