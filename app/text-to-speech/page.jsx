'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState('');
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Load available voices when component mounts
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      if (availableVoices.length > 0) {
        setSelectedVoice(availableVoices[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = () => {
    if (!text.trim()) return;

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(v => v.name === selectedVoice);
    
    if (voice) {
      utterance.voice = voice;
    }
    
    utterance.rate = rate;
    utterance.volume = volume;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <section>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Text to Speech Converter</CardTitle>
              <CardDescription>
                Convert your text to speech with customizable voice settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="text">Enter Text</Label>
                  <Textarea
                    id="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="mt-2"
                    rows={5}
                    placeholder="Enter the text you want to convert to speech..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="voice">Select Voice</Label>
                    <Select
                      value={selectedVoice}
                      onValueChange={setSelectedVoice}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {voices.map((voice) => (
                          <SelectItem key={voice.name} value={voice.name}>
                            {voice.name} ({voice.lang})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rate">Speech Rate</Label>
                    <Slider
                      id="rate"
                      value={[rate]}
                      onValueChange={([value]) => setRate(value)}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      Current rate: {rate.toFixed(1)}x
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="volume">Volume</Label>
                    <Slider
                      id="volume"
                      value={[volume]}
                      onValueChange={([value]) => setVolume(value)}
                      min={0}
                      max={1}
                      step={0.1}
                      className="mt-2"
                    />
                    <div className="text-sm text-gray-500 mt-1">
                      Current volume: {Math.round(volume * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={speak}
                    disabled={isSpeaking || !text.trim()}
                    className="flex-1"
                  >
                    {isSpeaking ? 'Speaking...' : 'Speak'}
                  </Button>
                  <Button
                    onClick={stopSpeaking}
                    variant="outline"
                    disabled={!isSpeaking}
                    className="flex-1"
                  >
                    Stop
                  </Button>
                </div>

                <div className="mt-6 text-sm text-gray-500">
                  <p>Tips:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Enter the text you want to convert to speech</li>
                    <li>Choose from available voices in different languages</li>
                    <li>Adjust speech rate and volume to your preference</li>
                    <li>Click Speak to start and Stop to cancel</li>
                    <li>Make sure your device has audio output enabled</li>
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
