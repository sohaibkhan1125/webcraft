'use client'

import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, DownloadIcon, UploadIcon, FileIcon, FileTextIcon, DatabaseIcon, FileJsonIcon } from 'lucide-react';
import * as XLSX from 'xlsx';

const CsvConverter = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [filename, setFilename] = useState('');
  const [selectedTab, setSelectedTab] = useState('csv-to-json');
  const [delimiter, setDelimiter] = useState(',');
  const [hasHeader, setHasHeader] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    setFilename(file.name);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target.result;
      setInputText(content);
    };
    
    reader.readAsText(file);
  };
  
  // Handle file download
  const handleDownload = () => {
    if (!outputText) return;
    
    let dataStr, downloadFilename, mimeType;
    
    switch (selectedTab) {
      case 'csv-to-json':
        dataStr = outputText;
        downloadFilename = filename.replace(/\.[^/.]+$/, "") + ".json";
        mimeType = "application/json";
        break;
      case 'json-to-csv':
        dataStr = outputText;
        downloadFilename = filename.replace(/\.[^/.]+$/, "") + ".csv";
        mimeType = "text/csv";
        break;
      case 'csv-to-xml':
        dataStr = outputText;
        downloadFilename = filename.replace(/\.[^/.]+$/, "") + ".xml";
        mimeType = "application/xml";
        break;
      case 'xml-to-csv':
        dataStr = outputText;
        downloadFilename = filename.replace(/\.[^/.]+$/, "") + ".csv";
        mimeType = "text/csv";
        break;
      case 'csv-to-excel':
        // Handle Excel download differently
        const worksheet = XLSX.utils.aoa_to_sheet(
          csvToArray(inputText, delimiter)
        );
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        XLSX.writeFile(workbook, filename.replace(/\.[^/.]+$/, "") + ".xlsx");
        return;
      case 'excel-to-csv':
        dataStr = outputText;
        downloadFilename = filename.replace(/\.[^/.]+$/, "") + ".csv";
        mimeType = "text/csv";
        break;
      default:
        return;
    }
    
    const blob = new Blob([dataStr], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = downloadFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Copy output to clipboard
  const copyToClipboard = () => {
    if (!outputText) return;
    
    navigator.clipboard.writeText(outputText);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // Clear the input and output
  const clearAll = () => {
    setInputText('');
    setOutputText('');
    setFilename('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Convert functions
  const convertData = () => {
    if (!inputText) return;
    setIsLoading(true);
    
    try {
      let result = '';
      
      switch (selectedTab) {
        case 'csv-to-json':
          result = csvToJson(inputText, delimiter, hasHeader);
          break;
        case 'json-to-csv':
          result = jsonToCsv(inputText, delimiter);
          break;
        case 'csv-to-xml':
          result = csvToXml(inputText, delimiter, hasHeader);
          break;
        case 'xml-to-csv':
          result = xmlToCsv(inputText, delimiter);
          break;
        case 'csv-to-excel':
          result = "Excel file will be downloaded directly.";
          break;
        case 'excel-to-csv':
          // This would typically require uploading an Excel file
          // For now, we'll just show a placeholder message
          result = "Please upload an Excel file.";
          break;
        default:
          result = "Conversion type not supported.";
      }
      
      setOutputText(result);
    } catch (error) {
      setOutputText(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // CSV to Array helper function
  const csvToArray = (str, delimiter = ',') => {
    const rows = str.trim().split('\n');
    return rows.map(row => {
      // Handle quoted fields correctly
      const result = [];
      let startPos = 0;
      let inQuotes = false;
      
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '"') {
          inQuotes = !inQuotes;
        } else if (row[i] === delimiter && !inQuotes) {
          result.push(row.substring(startPos, i).replace(/(^"|"$)/g, ''));
          startPos = i + 1;
        }
      }
      
      result.push(row.substring(startPos).replace(/(^"|"$)/g, ''));
      return result;
    });
  };
  
  // CSV to JSON conversion
  const csvToJson = (csv, delimiter = ',', hasHeader = true) => {
    const array = csvToArray(csv, delimiter);
    let result = [];
    
    if (hasHeader && array.length > 0) {
      const headers = array[0];
      result = array.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = row[i];
        });
        return obj;
      });
    } else {
      result = array.map(row => {
        const obj = {};
        row.forEach((value, i) => {
          obj[`field${i + 1}`] = value;
        });
        return obj;
      });
    }
    
    return JSON.stringify(result, null, 2);
  };
  
  // JSON to CSV conversion
  const jsonToCsv = (json, delimiter = ',') => {
    try {
      const arr = typeof json === 'string' ? JSON.parse(json) : json;
      if (!Array.isArray(arr)) {
        throw new Error('Input must be an array of objects');
      }
      
      if (arr.length === 0) return '';
      
      // Extract all possible headers
      const headers = [];
      arr.forEach(obj => {
        Object.keys(obj).forEach(key => {
          if (!headers.includes(key)) {
            headers.push(key);
          }
        });
      });
      
      // Create CSV rows
      const rows = [headers];
      arr.forEach(obj => {
        const row = headers.map(header => {
          const value = obj[header] !== undefined ? obj[header] : '';
          // Escape quotes and wrap in quotes if the value contains the delimiter or newlines
          return typeof value === 'string' && (value.includes(delimiter) || value.includes('\n') || value.includes('"'))
            ? `"${value.replace(/"/g, '""')}"`
            : value;
        });
        rows.push(row);
      });
      
      // Join rows with newlines and cells with delimiter
      return rows.map(row => row.join(delimiter)).join('\n');
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error.message}`);
    }
  };
  
  // CSV to XML conversion
  const csvToXml = (csv, delimiter = ',', hasHeader = true) => {
    const array = csvToArray(csv, delimiter);
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<root>\n';
    
    if (hasHeader && array.length > 0) {
      const headers = array[0];
      array.slice(1).forEach((row, rowIndex) => {
        xml += `  <row id="${rowIndex + 1}">\n`;
        row.forEach((cell, cellIndex) => {
          if (cellIndex < headers.length) {
            const fieldName = headers[cellIndex].replace(/[^a-zA-Z0-9]/g, '_');
            xml += `    <${fieldName}>${escapeXml(cell)}</${fieldName}>\n`;
          }
        });
        xml += '  </row>\n';
      });
    } else {
      array.forEach((row, rowIndex) => {
        xml += `  <row id="${rowIndex + 1}">\n`;
        row.forEach((cell, cellIndex) => {
          xml += `    <field${cellIndex + 1}>${escapeXml(cell)}</field${cellIndex + 1}>\n`;
        });
        xml += '  </row>\n';
      });
    }
    
    xml += '</root>';
    return xml;
  };
  
  // XML to CSV conversion (simplified)
  const xmlToCsv = (xml, delimiter = ',') => {
    try {
      // This is a very simplified XML parser for demonstration
      // A real implementation would use proper XML parsing
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xml, "text/xml");
      const rows = xmlDoc.getElementsByTagName("row");
      
      if (rows.length === 0) {
        throw new Error('No row elements found in XML');
      }
      
      // Collect all possible field names
      const allFields = new Set();
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        for (let j = 0; j < row.children.length; j++) {
          allFields.add(row.children[j].tagName);
        }
      }
      
      const fieldNames = Array.from(allFields);
      let csv = fieldNames.join(delimiter) + '\n';
      
      // Create rows
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowData = [];
        
        for (const field of fieldNames) {
          const element = row.getElementsByTagName(field)[0];
          const value = element ? element.textContent : '';
          
          // Escape value if it contains delimiter, quotes, or newlines
          if (typeof value === 'string' && (value.includes(delimiter) || value.includes('\n') || value.includes('"'))) {
            rowData.push(`"${value.replace(/"/g, '""')}"`);
          } else {
            rowData.push(value);
          }
        }
        
        csv += rowData.join(delimiter) + '\n';
      }
      
      return csv;
    } catch (error) {
      throw new Error(`Failed to parse XML: ${error.message}`);
    }
  };
  
  // Helper to escape XML special characters
  const escapeXml = (unsafe) => {
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  };
  
  // Generate example data for the selected tab
  const generateExample = () => {
    switch (selectedTab) {
      case 'csv-to-json':
        setInputText('name,age,city\nJohn Doe,30,New York\nJane Smith,25,San Francisco\nRobert Johnson,45,Chicago');
        break;
      case 'json-to-csv':
        setInputText('[\n  {\n    "name": "John Doe",\n    "age": 30,\n    "city": "New York"\n  },\n  {\n    "name": "Jane Smith",\n    "age": 25,\n    "city": "San Francisco"\n  },\n  {\n    "name": "Robert Johnson",\n    "age": 45,\n    "city": "Chicago"\n  }\n]');
        break;
      case 'csv-to-xml':
        setInputText('name,age,city\nJohn Doe,30,New York\nJane Smith,25,San Francisco\nRobert Johnson,45,Chicago');
        break;
      case 'xml-to-csv':
        setInputText('<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <row id="1">\n    <name>John Doe</name>\n    <age>30</age>\n    <city>New York</city>\n  </row>\n  <row id="2">\n    <name>Jane Smith</name>\n    <age>25</age>\n    <city>San Francisco</city>\n  </row>\n  <row id="3">\n    <name>Robert Johnson</name>\n    <age>45</age>\n    <city>Chicago</city>\n  </row>\n</root>');
        break;
      case 'csv-to-excel':
        setInputText('name,age,city\nJohn Doe,30,New York\nJane Smith,25,San Francisco\nRobert Johnson,45,Chicago');
        break;
      case 'excel-to-csv':
        setInputText('Please upload an Excel file to convert to CSV.');
        break;
      default:
        setInputText('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            CSV Converter
          </h1>
          
          <p className="text-center text-gray-600 mb-8">
            Convert between CSV, JSON, XML, and Excel formats with this easy-to-use tool.
          </p>
          
          <Tabs 
            defaultValue="csv-to-json" 
            className="w-full"
            onValueChange={(value) => {
              setSelectedTab(value);
              setOutputText('');
            }}
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
              <TabsTrigger value="csv-to-json">CSV to JSON</TabsTrigger>
              <TabsTrigger value="json-to-csv">JSON to CSV</TabsTrigger>
              <TabsTrigger value="csv-to-xml">CSV to XML</TabsTrigger>
              <TabsTrigger value="xml-to-csv">XML to CSV</TabsTrigger>
              <TabsTrigger value="csv-to-excel">CSV to Excel</TabsTrigger>
              <TabsTrigger value="excel-to-csv">Excel to CSV</TabsTrigger>
            </TabsList>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Input Section */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FileTextIcon className="mr-2" size={20} />
                    Input
                  </h2>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => fileInputRef.current.click()}
                      className="flex items-center"
                    >
                      <UploadIcon size={16} className="mr-1" />
                      Upload
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                      accept={
                        selectedTab.startsWith('csv') ? '.csv' :
                        selectedTab.startsWith('json') ? '.json' :
                        selectedTab.startsWith('xml') ? '.xml' :
                        '.xlsx,.xls'
                      }
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={generateExample}
                      className="hidden sm:flex items-center"
                    >
                      Example
                    </Button>
                  </div>
                </div>
                
                {/* Settings for CSV */}
                {(selectedTab.includes('csv') || selectedTab.includes('excel')) && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-md">
                    <h3 className="text-sm font-medium mb-2">Settings</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">Delimiter</label>
                        <select
                          value={delimiter}
                          onChange={(e) => setDelimiter(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        >
                          <option value=",">Comma (,)</option>
                          <option value=";">Semicolon (;)</option>
                          <option value="\t">Tab</option>
                          <option value="|">Pipe (|)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm text-gray-600 mb-1">First Row</label>
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="hasHeader"
                            checked={hasHeader}
                            onChange={(e) => setHasHeader(e.target.checked)}
                            className="mr-2"
                          />
                          <label htmlFor="hasHeader" className="text-sm text-gray-600">
                            Contains column headers
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Enter your ${selectedTab.split('-')[0].toUpperCase()} data here or upload a file...`}
                  className="w-full h-64 p-3 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex justify-between mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={clearAll}
                  >
                    Clear
                  </Button>
                  
                  <Button 
                    onClick={convertData}
                    disabled={!inputText || isLoading}
                    className="flex items-center"
                  >
                    {isLoading ? 'Converting...' : 'Convert'}
                  </Button>
                </div>
              </div>
              
              {/* Output Section */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center">
                    <FileIcon className="mr-2" size={20} />
                    Output
                  </h2>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={copyToClipboard}
                      disabled={!outputText}
                      className="flex items-center"
                    >
                      <Copy size={16} className="mr-1" />
                      {copiedCode ? 'Copied!' : 'Copy'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownload}
                      disabled={!outputText}
                      className="flex items-center"
                    >
                      <DownloadIcon size={16} className="mr-1" />
                      Download
                    </Button>
                  </div>
                </div>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md h-64 overflow-auto font-mono text-sm">
                  <pre className="whitespace-pre-wrap">
                    {outputText}
                  </pre>
                </div>
              </div>
            </div>
          </Tabs>
          
          {/* Information Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">About Data Conversion</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Features</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li>Convert CSV to JSON, XML, and Excel formats</li>
                  <li>Convert JSON, XML, and Excel back to CSV</li>
                  <li>Customize CSV delimiter (comma, semicolon, tab, pipe)</li>
                  <li>Support for files with or without headers</li>
                  <li>Download converted files directly</li>
                  <li>Copy results to clipboard with one click</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Data Format Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li><strong>CSV</strong> - Comma-Separated Values, simple text format for tabular data</li>
                  <li><strong>JSON</strong> - JavaScript Object Notation, a lightweight data interchange format</li>
                  <li><strong>XML</strong> - Extensible Markup Language, a markup language that defines rules for encoding documents</li>
                  <li><strong>Excel</strong> - Microsoft Excel spreadsheet format (.xlsx)</li>
                </ul>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mt-4 mb-2">Usage Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>For CSV files, make sure your data is properly formatted with consistent delimiters</li>
              <li>When converting from JSON, ensure your data is a valid array of objects</li>
              <li>XML conversion works best with simple, consistent data structures</li>
              <li>Large files may take longer to process - be patient!</li>
              <li>All conversion is performed in your browser - your data never leaves your computer</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CsvConverter; 