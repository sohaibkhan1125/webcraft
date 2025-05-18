'use client'
import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Download, RefreshCw, Upload, Trash, Check, AlertCircle } from 'lucide-react';

const BannerAdMaker = () => {
  const [bannerText, setBannerText] = useState('Your Banner Text');
  const [bannerColor, setBannerColor] = useState('#3B82F6');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(32);
  const [bannerWidth, setBannerWidth] = useState(728);
  const [bannerHeight, setBannerHeight] = useState(90);
  const [isLoading, setIsLoading] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [previewScale, setPreviewScale] = useState(0.8);
  const bannerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [bgImageObj, setBgImageObj] = useState(null);

  const bannerSizes = [
    { width: 728, height: 90, name: 'Leaderboard' },
    { width: 300, height: 250, name: 'Medium Rectangle' },
    { width: 160, height: 600, name: 'Wide Skyscraper' },
    { width: 320, height: 50, name: 'Mobile Banner' },
  ];

  // Calculate appropriate preview scale based on banner size and container
  useEffect(() => {
    const calculateScale = () => {
      const container = document.querySelector('.preview-container');
      if (!container) return;
      
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;
      
      // Determine scale factor based on container and banner dimensions
      const widthScale = (containerWidth - 40) / bannerWidth;
      const heightScale = (containerHeight - 40) / bannerHeight;
      
      // Use the smaller scale to ensure the banner fits in the container
      const scale = Math.min(widthScale, heightScale, 1);
      setPreviewScale(Math.max(0.3, scale));
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, [bannerWidth, bannerHeight]);

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setError('');
    const reader = new FileReader();
    
    reader.onload = (event) => {
      // Create an image object to cache for later use in download
      const img = new Image();
      img.onload = () => {
        setBgImageObj(img);
      };
      img.src = event.target.result;
      
      setBackgroundImage(event.target.result);
    };
    
    reader.onerror = () => {
      setError('Failed to load image. Please try a different file.');
    };
    
    reader.readAsDataURL(file);
  };

  // Clear the background image
  const clearBackgroundImage = () => {
    setBackgroundImage(null);
    setBgImageObj(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Convert any CSS color to a safe format
  const convertToSafeColor = (color) => {
    // Force colors to be in safe formats (not oklch)
    try {
      // If it's already a hex color, return it
      if (/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
        return color;
      }
      
      // Create a canvas to convert the color
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      
      // Draw a pixel with the color
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 1, 1);
      
      // Get the pixel data which will be in RGBA format
      const data = ctx.getImageData(0, 0, 1, 1).data;
      
      // Convert RGB to hex
      const hex = `#${data[0].toString(16).padStart(2, '0')}${data[1].toString(16).padStart(2, '0')}${data[2].toString(16).padStart(2, '0')}`;
      
      return hex;
    } catch (e) {
      console.error('Error converting color:', e);
      // Fallback to a safe default color
      return color.includes('oklch') ? '#3B82F6' : color;
    }
  };

  const handleDownload = async () => {
    if (!bannerRef.current) return;
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Get safe colors
      const safeBackgroundColor = convertToSafeColor(bannerColor);
      const safeTextColor = convertToSafeColor(textColor);
      
      // Set up canvas with pixel ratio for high quality
      const pixelRatio = window.devicePixelRatio || 2;
      const canvas = document.createElement('canvas');
      
      // Set actual size in memory (scaled for high resolution)
      canvas.width = bannerWidth * pixelRatio;
      canvas.height = bannerHeight * pixelRatio;
      
      // Set display size
      canvas.style.width = `${bannerWidth}px`;
      canvas.style.height = `${bannerHeight}px`;
      
      const ctx = canvas.getContext('2d');
      
      // Scale all drawing operations by the pixel ratio
      ctx.scale(pixelRatio, pixelRatio);
      
      // Apply anti-aliasing for smoother text
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Draw background with rounded corners
      ctx.fillStyle = safeBackgroundColor;
      
      // Draw rectangle with rounded corners (4px radius)
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(bannerWidth - radius, 0);
      ctx.quadraticCurveTo(bannerWidth, 0, bannerWidth, radius);
      ctx.lineTo(bannerWidth, bannerHeight - radius);
      ctx.quadraticCurveTo(bannerWidth, bannerHeight, bannerWidth - radius, bannerHeight);
      ctx.lineTo(radius, bannerHeight);
      ctx.quadraticCurveTo(0, bannerHeight, 0, bannerHeight - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.fill();
      
      // If there's a background image, draw it with proper clipping for rounded corners
      if (backgroundImage && bgImageObj) {
        try {
          // Save the current state for clipping
          ctx.save();
          
          // Create clipping path for rounded corners
          ctx.beginPath();
          ctx.moveTo(radius, 0);
          ctx.lineTo(bannerWidth - radius, 0);
          ctx.quadraticCurveTo(bannerWidth, 0, bannerWidth, radius);
          ctx.lineTo(bannerWidth, bannerHeight - radius);
          ctx.quadraticCurveTo(bannerWidth, bannerHeight, bannerWidth - radius, bannerHeight);
          ctx.lineTo(radius, bannerHeight);
          ctx.quadraticCurveTo(0, bannerHeight, 0, bannerHeight - radius);
          ctx.lineTo(0, radius);
          ctx.quadraticCurveTo(0, 0, radius, 0);
          ctx.closePath();
          ctx.clip();
          
          // Draw the background image
          ctx.drawImage(bgImageObj, 0, 0, bannerWidth, bannerHeight);
          
          // Restore the context after clipping
          ctx.restore();
        } catch (imgError) {
          console.error('Error drawing background image:', imgError);
          // Fallback to solid color if image fails
          ctx.fillStyle = safeBackgroundColor;
          ctx.fillRect(0, 0, bannerWidth, bannerHeight);
        }
      }
      
      // Draw text
      ctx.fillStyle = safeTextColor;
      
      // Use a more reliable font stack
      ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Add text shadow if there's a background image for better readability
      if (backgroundImage) {
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
      }
      
      // Handle multi-line text
      const words = bannerText.split(' ');
      let line = '';
      const lines = [];
      const maxWidth = bannerWidth - 40; // 20px padding on each side
      
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        
        if (testWidth > maxWidth && n > 0) {
          lines.push(line.trim());
          line = words[n] + ' ';
        } else {
          line = testLine;
        }
      }
      lines.push(line.trim());
      
      // Calculate line height and position text
      const lineHeight = fontSize * 1.2;
      const totalTextHeight = lines.length * lineHeight;
      let textY = (bannerHeight - totalTextHeight) / 2 + lineHeight / 2;
      
      // Draw each line
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], bannerWidth / 2, textY);
        textY += lineHeight;
      }
      
      // Generate a high-quality PNG with proper encoding
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      
      // Convert data URL to blob for better file handling
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      
      // Create and trigger download
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `banner-${bannerWidth}x${bannerHeight}.png`;
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
      }, 100);
      
      setSuccess('Banner downloaded successfully!');
    } catch (error) {
      console.error('Error generating banner:', error);
      setError(`Failed to download banner: ${error.message || 'Unknown error'}. Please try again or use a different browser.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSizeChange = (width, height) => {
    setBannerWidth(width);
    setBannerHeight(height);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Professional Banner Ad Maker
          </h1>

          {/* Alert Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-md flex items-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-100 border border-green-200 text-green-700 rounded-md flex items-center gap-2">
              <Check size={18} />
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Banner Preview */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Preview</h2>
              <div className="preview-container flex justify-center items-center bg-gray-100 p-4 rounded-md h-80">
                <div
                  ref={bannerRef}
                  data-banner="true"
                  style={{
                    width: `${bannerWidth}px`,
                    height: `${bannerHeight}px`,
                    backgroundColor: backgroundImage ? 'transparent' : bannerColor,
                    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    transform: `scale(${previewScale})`,
                    transformOrigin: 'center',
                    transition: 'all 0.3s ease',
                    borderRadius: '4px',
                  }}
                  className="rounded-md shadow-md relative"
                >
                  <p
                    data-banner-text="true"
                    style={{
                      color: textColor,
                      fontSize: `${fontSize}px`,
                      textAlign: 'center',
                      padding: '20px',
                      wordBreak: 'break-word',
                      width: '100%',
                      margin: 0,
                      textShadow: backgroundImage ? '1px 1px 3px rgba(0,0,0,0.5)' : 'none',
                      fontWeight: 'bold',
                    }}
                    className="font-semibold"
                  >
                    {bannerText}
                  </p>
                </div>
              </div>
              <div className="mt-3 text-center text-sm text-gray-600">
                {bannerWidth} x {bannerHeight}px
              </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Customize Banner</h2>
              
              <div className="space-y-4">
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Banner Text
                  </label>
                  <input
                    type="text"
                    value={bannerText}
                    onChange={(e) => setBannerText(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your banner text"
                  />
                </div>

                {/* Background Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Background Image (Optional)
                  </label>
                  <div className="flex space-x-2">
                    <label className="flex-1">
                      <div className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50">
                        <Upload className="w-4 h-4 mr-2" />
                        <span>{backgroundImage ? 'Change Image' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                    </label>
                    {backgroundImage && (
                      <button
                        onClick={clearBackgroundImage}
                        className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                        title="Remove Image"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Colors */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={bannerColor}
                      onChange={(e) => setBannerColor(e.target.value)}
                      className="w-full h-10 rounded-md cursor-pointer"
                      disabled={!!backgroundImage}
                    />
                    {backgroundImage && (
                      <p className="text-xs text-gray-500 mt-1">
                        Remove background image to change color
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Color
                    </label>
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-full h-10 rounded-md cursor-pointer"
                    />
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Font Size: {fontSize}px
                  </label>
                  <input
                    type="range"
                    min="16"
                    max="72"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Banner Sizes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banner Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {bannerSizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => handleSizeChange(size.width, size.height)}
                        className={`px-3 py-2 text-sm rounded-md transition-colors duration-200 ${
                          bannerWidth === size.width && bannerHeight === size.height
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        {size.name}
                        <span className="block text-xs opacity-75">
                          {size.width}x{size.height}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  disabled={isLoading}
                  className="w-full mt-4 px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5" />
                      Download Banner
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">How to Use</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              <li>Enter your desired text in the banner text field</li>
              <li>Optionally upload a background image for your banner</li>
              <li>Choose background and text colors using the color pickers</li>
              <li>Adjust the font size using the slider</li>
              <li>Select a standard banner size from the available options</li>
              <li>Click the Download button to save your banner as a PNG image</li>
            </ol>
          </div>

          {/* New SEO Optimized Article Section */}
          <article className="mt-8 max-w-4xl mx-auto px-4">
            <h2 className="text-2xl font-bold">Creating Effective Banner Ads</h2>
            <p>
              Banner ads are a powerful tool for online marketing, allowing businesses to promote their products 
              and services effectively. However, creating an effective banner ad requires careful consideration 
              of design, messaging, and placement. In this article, we will explore the key elements of successful 
              banner ads and how to create them using our Banner Ad Maker.
            </p>
            <h3 className="text-xl font-semibold">The Importance of Banner Ads</h3>
            <p>
              Banner ads are one of the oldest forms of online advertising, yet they remain highly effective. 
              They can help increase brand awareness, drive traffic to your website, and generate leads. 
              With the right design and strategy, banner ads can yield a high return on investment (ROI).
            </p>
            <h3 className="text-xl font-semibold">Key Elements of a Successful Banner Ad</h3>
            <p>
              To create a successful banner ad, consider the following elements:
            </p>
            <ul className="list-disc list-inside">
              <li><strong>Clear Messaging:</strong> Your message should be concise and easy to understand. Use strong action verbs and a clear call to action (CTA).</li>
              <li><strong>Visual Appeal:</strong> Use eye-catching colors and images that align with your brand. Ensure that the design is clean and not cluttered.</li>
              <li><strong>Branding:</strong> Include your logo and brand colors to ensure that your ad is recognizable and consistent with your overall branding.</li>
              <li><strong>Target Audience:</strong> Tailor your ad to resonate with your target audience. Consider their preferences and interests when designing your banner.</li>
            </ul>
            <h3 className="text-xl font-semibold">How to Use Our Banner Ad Maker</h3>
            <p>
              Our Banner Ad Maker simplifies the process of creating professional banner ads. Here's how to use it:
            </p>
            <ol className="list-decimal list-inside">
              <li>Enter your desired banner text in the input field.</li>
              <li>Upload a background image or select a background color.</li>
              <li>Choose your preferred text color using the color picker.</li>
              <li>Adjust the font size to ensure readability.</li>
              <li>Choose a standard banner size from the available options.</li>
              <li>Click the Download button to save your banner as a PNG image.</li>
            </ol>
            <h3 className="text-xl font-semibold">Best Practices for Banner Ads</h3>
            <p>
              To maximize the effectiveness of your banner ads, follow these best practices:
            </p>
            <ul className="list-disc list-inside">
              <li>Test different designs and messages to see what resonates best with your audience.</li>
              <li>Use A/B testing to compare the performance of different ads.</li>
              <li>Monitor your ad performance and make adjustments as needed to improve results.</li>
              <li>Keep your ads updated to reflect current promotions or changes in your offerings.</li>
            </ul>
            <h3 className="text-xl font-semibold">Conclusion</h3>
            <p>
              Creating effective banner ads is essential for any online marketing strategy. By utilizing our 
              Banner Ad Maker, you can easily design professional ads that capture attention and drive results. 
              Remember to focus on clear messaging, visual appeal, and your target audience to create ads that 
              truly resonate. Start creating your banner ads today and take your marketing efforts to the next level!
            </p>
          </article>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default BannerAdMaker;
