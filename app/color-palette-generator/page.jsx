'use client'
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Copy, Download, RefreshCw, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";

const ColorPaletteGenerator = () => {
  const [mainColor, setMainColor] = useState('#3f83f8');
  const [palette, setPalette] = useState([]);
  const [schemeType, setSchemeType] = useState('analogous');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [numberOfColors, setNumberOfColors] = useState(5);

  const schemeTypes = [
    { id: 'analogous', name: 'Analogous' },
    { id: 'monochromatic', name: 'Monochromatic' },
    { id: 'triadic', name: 'Triadic' },
    { id: 'complementary', name: 'Complementary' },
    { id: 'split-complementary', name: 'Split Complementary' },
    { id: 'tetradic', name: 'Tetradic' },
  ];

  // Helper function to convert hex to HSL
  const hexToHSL = (hex) => {
    // Remove the hash if it exists
    hex = hex.replace('#', '');
    
    // Convert hex to RGB
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;
    
    // Find min and max values of RGB
    let max = Math.max(r, g, b);
    let min = Math.min(r, g, b);
    
    // Calculate HSL values
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      
      h /= 6;
    }
    
    // Return HSL values (h: 0-360, s: 0-100, l: 0-100)
    return { 
      h: Math.round(h * 360), 
      s: Math.round(s * 100), 
      l: Math.round(l * 100) 
    };
  };
  
  // Helper function to convert HSL to hex
  const hslToHex = (h, s, l) => {
    // Ensure h, s, l are in the right range
    h = h % 360;
    s = Math.max(0, Math.min(100, s)) / 100;
    l = Math.max(0, Math.min(100, l)) / 100;
    
    function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
    
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, (h / 360) + 1/3);
      g = hue2rgb(p, q, h / 360);
      b = hue2rgb(p, q, (h / 360) - 1/3);
    }
    
    // Convert to hex
    const toHex = (x) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Generate the color palette based on the main color and scheme type
  const generatePalette = () => {
    const hsl = hexToHSL(mainColor);
    let colors = [];
    
    switch(schemeType) {
      case 'analogous':
        // Generate colors around the color wheel
        for (let i = 0; i < numberOfColors; i++) {
          const rotation = Math.floor(30 * (i - Math.floor(numberOfColors / 2)));
          const h = (hsl.h + rotation + 360) % 360;
          colors.push(hslToHex(h, hsl.s, hsl.l));
        }
        break;
        
      case 'monochromatic':
        // Generate different shades of the same color
        for (let i = 0; i < numberOfColors; i++) {
          const lightness = 90 - (i * (80 / (numberOfColors - 1)));
          colors.push(hslToHex(hsl.h, hsl.s, lightness));
        }
        break;
        
      case 'triadic':
        // Generate three colors evenly spaced around the color wheel
        const triadicSpacing = 120;
        if (numberOfColors <= 3) {
          for (let i = 0; i < numberOfColors; i++) {
            colors.push(hslToHex((hsl.h + i * triadicSpacing) % 360, hsl.s, hsl.l));
          }
        } else {
          colors.push(hslToHex(hsl.h, hsl.s, hsl.l));
          colors.push(hslToHex((hsl.h + triadicSpacing) % 360, hsl.s, hsl.l));
          colors.push(hslToHex((hsl.h + 2 * triadicSpacing) % 360, hsl.s, hsl.l));
          
          // Add additional colors by varying lightness
          for (let i = 3; i < numberOfColors; i++) {
            const baseIndex = i % 3;
            const lightness = Math.max(20, hsl.l - 15 * Math.floor(i / 3));
            colors.push(hslToHex((hsl.h + baseIndex * triadicSpacing) % 360, hsl.s, lightness));
          }
        }
        break;
        
      case 'complementary':
        // Main color and its complement (180 degrees apart)
        const complement = (hsl.h + 180) % 360;
        
        if (numberOfColors <= 2) {
          colors = [mainColor, hslToHex(complement, hsl.s, hsl.l)];
        } else {
          // Generate variations
          const middleIndex = Math.floor(numberOfColors / 2);
          
          for (let i = 0; i < numberOfColors; i++) {
            if (i < middleIndex) {
              // Variations of main color
              const lightness = hsl.l + (i - middleIndex) * 10;
              colors.push(hslToHex(hsl.h, hsl.s, lightness));
            } else {
              // Variations of complementary color
              const lightness = hsl.l + (i - middleIndex) * 10;
              colors.push(hslToHex(complement, hsl.s, lightness));
            }
          }
        }
        break;
        
      case 'split-complementary':
        // Main color and two colors adjacent to its complement
        const splitComplement1 = (hsl.h + 150) % 360;
        const splitComplement2 = (hsl.h + 210) % 360;
        
        if (numberOfColors <= 3) {
          colors = [
            mainColor,
            hslToHex(splitComplement1, hsl.s, hsl.l),
            hslToHex(splitComplement2, hsl.s, hsl.l)
          ].slice(0, numberOfColors);
        } else {
          colors = [mainColor, hslToHex(splitComplement1, hsl.s, hsl.l), hslToHex(splitComplement2, hsl.s, hsl.l)];
          
          // Generate variations
          for (let i = 3; i < numberOfColors; i++) {
            const baseIndex = i % 3;
            const baseHue = baseIndex === 0 ? hsl.h : 
                           baseIndex === 1 ? splitComplement1 : splitComplement2;
            const lightness = Math.max(30, hsl.l - 15 * Math.floor(i / 3));
            colors.push(hslToHex(baseHue, hsl.s, lightness));
          }
        }
        break;
        
      case 'tetradic':
        // Four colors evenly spaced around the color wheel
        const tetradicSpacing = 90;
        
        if (numberOfColors <= 4) {
          for (let i = 0; i < numberOfColors; i++) {
            colors.push(hslToHex((hsl.h + i * tetradicSpacing) % 360, hsl.s, hsl.l));
          }
        } else {
          for (let i = 0; i < 4; i++) {
            colors.push(hslToHex((hsl.h + i * tetradicSpacing) % 360, hsl.s, hsl.l));
          }
          
          // Generate variations
          for (let i = 4; i < numberOfColors; i++) {
            const baseIndex = i % 4;
            const lightness = Math.max(20, hsl.l - 15 * Math.floor(i / 4));
            colors.push(hslToHex((hsl.h + baseIndex * tetradicSpacing) % 360, hsl.s, lightness));
          }
        }
        break;
        
      default:
        colors = [mainColor];
    }
    
    setPalette(colors);
  };

  // Generate palette when main color, scheme type, or number of colors changes
  useEffect(() => {
    generatePalette();
  }, [mainColor, schemeType, numberOfColors]);

  // Copy color hex code to clipboard
  const copyToClipboard = (color, index) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  // Export palette as CSS variables
  const exportCSS = () => {
    let css = `:root {\n`;
    palette.forEach((color, index) => {
      css += `  --color-${index + 1}: ${color};\n`;
    });
    css += `}\n`;
    
    // Create a blob and download it
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'palette.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate appropriate text color (black or white) based on background color
  const getTextColor = (hexColor) => {
    // Remove the hash if it exists
    hexColor = hexColor.replace('#', '');
    
    // Convert hex to RGB
    const r = parseInt(hexColor.substring(0, 2), 16);
    const g = parseInt(hexColor.substring(2, 4), 16);
    const b = parseInt(hexColor.substring(4, 6), 16);
    
    // Calculate the luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // Return black for light colors, white for dark colors
    return luminance > 0.5 ? '#000000' : '#ffffff';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Color Palette Generator
          </h1>
          
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Customize Your Palette</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main Color Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Choose Main Color
                </label>
                <div className="flex items-center">
                  <input
                    type="color"
                    value={mainColor}
                    onChange={(e) => setMainColor(e.target.value)}
                    className="w-12 h-12 rounded-md cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={mainColor}
                    onChange={(e) => setMainColor(e.target.value)}
                    className="ml-2 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              {/* Scheme Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color Scheme
                </label>
                <select
                  value={schemeType}
                  onChange={(e) => setSchemeType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {schemeTypes.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Number of Colors */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Colors: {numberOfColors}
                </label>
                <input
                  type="range"
                  min="2"
                  max="8"
                  value={numberOfColors}
                  onChange={(e) => setNumberOfColors(parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          
          {/* Color Palette */}
          <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Generated Palette</h2>
              <div className="flex space-x-2">
                <Button onClick={generatePalette} size="sm" className="flex items-center gap-1">
                  <RefreshCw size={16} />
                  <span>Regenerate</span>
                </Button>
                <Button onClick={exportCSS} size="sm" variant="outline" className="flex items-center gap-1">
                  <Download size={16} />
                  <span>Export CSS</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {palette.map((color, index) => (
                <div 
                  key={index} 
                  className="overflow-hidden rounded-lg shadow transition-transform hover:scale-105"
                >
                  <div 
                    className="h-32 flex items-end p-3"
                    style={{ backgroundColor: color }}
                  >
                    <span 
                      className="font-mono text-sm"
                      style={{ color: getTextColor(color) }}
                    >
                      {color.toUpperCase()}
                    </span>
                  </div>
                  <div className="bg-white p-3 flex justify-between items-center">
                    <div className="text-sm text-gray-500">Color {index + 1}</div>
                    <button
                      onClick={() => copyToClipboard(color, index)}
                      className="text-gray-500 hover:text-blue-500 p-1 rounded"
                      title="Copy color code"
                    >
                      {copiedIndex === index ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions and Info */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Select a main color using the color picker</li>
              <li>Choose a color scheme type from the dropdown</li>
              <li>Adjust the number of colors in your palette</li>
              <li>Click on Regenerate to create a new variation</li>
              <li>Click the copy button to copy a specific color's hex code</li>
              <li>Use Export CSS to download the palette as CSS variables</li>
            </ol>
            
            <h3 className="text-lg font-semibold mt-6 mb-2">About Color Schemes</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li><strong>Analogous:</strong> Colors that are adjacent to each other on the color wheel</li>
              <li><strong>Monochromatic:</strong> Different shades and tints of a single color</li>
              <li><strong>Triadic:</strong> Three colors evenly spaced around the color wheel</li>
              <li><strong>Complementary:</strong> Colors opposite each other on the color wheel</li>
              <li><strong>Split Complementary:</strong> A color and the two colors adjacent to its complement</li>
              <li><strong>Tetradic:</strong> Four colors arranged in two complementary pairs</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ColorPaletteGenerator; 