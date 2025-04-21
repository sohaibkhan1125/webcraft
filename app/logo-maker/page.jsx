"use client";

import React, { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function LogoMaker() {
  const [logoText, setLogoText] = useState("Your Logo");
  const [fontSize, setFontSize] = useState(48);
  const [textColor, setTextColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [icon, setIcon] = useState("none");
  const [iconColor, setIconColor] = useState("#000000");
  const [iconSize, setIconSize] = useState(40);
  const [logoStyle, setLogoStyle] = useState("horizontal");
  const canvasRef = useRef(null);

  const icons = [
    { value: "none", label: "No Icon" },
    { value: "star", label: "Star" },
    { value: "heart", label: "Heart" },
    { value: "circle", label: "Circle" },
    { value: "square", label: "Square" },
    { value: "triangle", label: "Triangle" },
  ];

  const styles = [
    { value: "horizontal", label: "Horizontal" },
    { value: "vertical", label: "Vertical" },
    { value: "stacked", label: "Stacked" },
  ];

  const drawLogo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw icon if selected
    if (icon !== "none") {
      ctx.fillStyle = iconColor;
      const iconX = logoStyle === "horizontal" ? 50 : canvas.width / 2;
      const iconY = logoStyle === "horizontal" ? canvas.height / 2 : 50;

      switch (icon) {
        case "star":
          drawStar(ctx, iconX, iconY, iconSize);
          break;
        case "heart":
          drawHeart(ctx, iconX, iconY, iconSize);
          break;
        case "circle":
          ctx.beginPath();
          ctx.arc(iconX, iconY, iconSize / 2, 0, Math.PI * 2);
          ctx.fill();
          break;
        case "square":
          ctx.fillRect(iconX - iconSize / 2, iconY - iconSize / 2, iconSize, iconSize);
          break;
        case "triangle":
          drawTriangle(ctx, iconX, iconY, iconSize);
          break;
      }
    }

    // Draw text
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const textX = logoStyle === "horizontal" ? canvas.width / 2 + (icon !== "none" ? 50 : 0) : canvas.width / 2;
    const textY = logoStyle === "horizontal" ? canvas.height / 2 : canvas.height - 50;

    ctx.fillText(logoText, textX, textY);
  };

  const drawStar = (ctx, x, y, size) => {
    const spikes = 5;
    const outerRadius = size / 2;
    const innerRadius = size / 4;
    let rot = (Math.PI / 2) * 3;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(x, y - outerRadius);

    for (let i = 0; i < spikes; i++) {
      x = x + Math.cos(rot) * outerRadius;
      y = y + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = x + Math.cos(rot) * innerRadius;
      y = y + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }

    ctx.lineTo(x, y - outerRadius);
    ctx.closePath();
    ctx.fill();
  };

  const drawHeart = (ctx, x, y, size) => {
    const width = size;
    const height = size;
    ctx.beginPath();
    ctx.moveTo(x, y + height / 4);
    ctx.bezierCurveTo(
      x, y,
      x - width / 2, y,
      x - width / 2, y + height / 4
    );
    ctx.bezierCurveTo(
      x - width / 2, y + height / 2,
      x, y + height / 2,
      x, y + height
    );
    ctx.bezierCurveTo(
      x, y + height / 2,
      x + width / 2, y + height / 2,
      x + width / 2, y + height / 4
    );
    ctx.bezierCurveTo(
      x + width / 2, y,
      x, y,
      x, y + height / 4
    );
    ctx.fill();
  };

  const drawTriangle = (ctx, x, y, size) => {
    ctx.beginPath();
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.closePath();
    ctx.fill();
  };

  const downloadLogo = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "logo.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  React.useEffect(() => {
    drawLogo();
  }, [logoText, fontSize, textColor, backgroundColor, icon, iconColor, iconSize, logoStyle]);

  return (
    <section>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Logo Maker</CardTitle>
              <CardDescription>
                Create your custom logo with text, icons, and colors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="logoText">Logo Text</Label>
                    <Input
                      id="logoText"
                      value={logoText}
                      onChange={(e) => setLogoText(e.target.value)}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fontSize">Font Size</Label>
                    <Slider
                      id="fontSize"
                      min={24}
                      max={72}
                      step={1}
                      value={[fontSize]}
                      onValueChange={([value]) => setFontSize(value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <Input
                      id="textColor"
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backgroundColor">Background Color</Label>
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon">Icon</Label>
                    <Select value={icon} onValueChange={setIcon}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {icons.map((icon) => (
                          <SelectItem key={icon.value} value={icon.value}>
                            {icon.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {icon !== "none" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="iconColor">Icon Color</Label>
                        <Input
                          id="iconColor"
                          type="color"
                          value={iconColor}
                          onChange={(e) => setIconColor(e.target.value)}
                          className="w-full h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="iconSize">Icon Size</Label>
                        <Slider
                          id="iconSize"
                          min={20}
                          max={100}
                          step={1}
                          value={[iconSize]}
                          onValueChange={([value]) => setIconSize(value)}
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="logoStyle">Logo Style</Label>
                    <Select value={logoStyle} onValueChange={setLogoStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a style" />
                      </SelectTrigger>
                      <SelectContent>
                        {styles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="border border-gray-200 rounded-lg"
                  />
                  <Button onClick={downloadLogo} className="mt-4">
                    Download Logo
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-gray-500">
                Create and download your custom logo. The logo will be downloaded as a PNG file.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </section>
  );
}
