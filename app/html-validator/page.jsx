'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function HtmlValidator() {
  const [htmlCode, setHtmlCode] = useState('');
  const [validationResult, setValidationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateHtml = async () => {
    setIsLoading(true);
    try {
      // Create a temporary iframe to validate HTML
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);

      // Write the HTML to the iframe
      iframe.contentWindow.document.open();
      iframe.contentWindow.document.write(htmlCode);
      iframe.contentWindow.document.close();

      // Check for common HTML errors
      const errors = [];
      const warnings = [];

      // Check for missing doctype
      if (!htmlCode.toLowerCase().includes('<!doctype html>')) {
        warnings.push('Missing DOCTYPE declaration');
      }

      // Check for missing title
      if (!htmlCode.toLowerCase().includes('<title>')) {
        warnings.push('Missing <title> tag');
      }

      // Check for missing meta charset
      if (!htmlCode.toLowerCase().includes('charset=')) {
        warnings.push('Missing charset meta tag');
      }

      // Check for unclosed tags
      const openTags = htmlCode.match(/<[^/][^>]*>/g) || [];
      const closeTags = htmlCode.match(/<\/[^>]*>/g) || [];
      
      if (openTags.length !== closeTags.length) {
        errors.push('Mismatched number of opening and closing tags');
      }

      // Check for common accessibility issues
      if (!htmlCode.toLowerCase().includes('alt=')) {
        warnings.push('Images missing alt attributes');
      }

      // Check for deprecated tags
      const deprecatedTags = ['<center>', '<font>', '<strike>', '<u>', '<big>', '<small>'];
      deprecatedTags.forEach(tag => {
        if (htmlCode.toLowerCase().includes(tag)) {
          warnings.push(`Deprecated tag found: ${tag}`);
        }
      });

      setValidationResult({
        errors,
        warnings,
        isValid: errors.length === 0
      });

      // Clean up
      document.body.removeChild(iframe);
    } catch (error) {
      setValidationResult({
        errors: ['Error validating HTML: ' + error.message],
        warnings: [],
        isValid: false
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>HTML Validator</CardTitle>
              <CardDescription>
                Validate your HTML code for errors and best practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="html-code">HTML Code</Label>
                  <Textarea
                    id="html-code"
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="Paste your HTML code here..."
                    className="mt-2 h-64 font-mono"
                  />
                </div>

                <Button 
                  onClick={validateHtml} 
                  className="w-full"
                  disabled={isLoading || !htmlCode.trim()}
                >
                  {isLoading ? 'Validating...' : 'Validate HTML'}
                </Button>

                {validationResult && (
                  <div className="mt-6">
                    <Label>Validation Results</Label>
                    <div className="mt-2 space-y-4">
                      {validationResult.errors.length > 0 && (
                        <div className="bg-red-50 p-4 rounded-lg">
                          <h3 className="text-red-800 font-semibold mb-2">Errors</h3>
                          <ul className="list-disc pl-5 text-red-600">
                            {validationResult.errors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validationResult.warnings.length > 0 && (
                        <div className="bg-yellow-50 p-4 rounded-lg">
                          <h3 className="text-yellow-800 font-semibold mb-2">Warnings</h3>
                          <ul className="list-disc pl-5 text-yellow-600">
                            {validationResult.warnings.map((warning, index) => (
                              <li key={index}>{warning}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {validationResult.errors.length === 0 && validationResult.warnings.length === 0 && (
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-green-800 font-semibold">
                            Your HTML code is valid!
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 text-sm text-gray-500">
                  <p>Tips:</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Always include a DOCTYPE declaration</li>
                    <li>Use semantic HTML elements</li>
                    <li>Include alt attributes for images</li>
                    <li>Ensure proper tag nesting and closing</li>
                    <li>Use lowercase for HTML tags and attributes</li>
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
