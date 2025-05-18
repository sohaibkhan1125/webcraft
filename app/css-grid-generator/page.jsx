'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Copy, Trash, Plus, Minus } from 'lucide-react';

const CssGridGenerator = () => {
  // Grid properties
  const [columns, setColumns] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(10);
  const [columnTemplate, setColumnTemplate] = useState(['1fr', '1fr', '1fr']);
  const [rowTemplate, setRowTemplate] = useState(['1fr', '1fr', '1fr']);
  const [areas, setAreas] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);
  const [areaName, setAreaName] = useState('');
  const [uniqueAreaNames, setUniqueAreaNames] = useState([]);
  
  // Code display
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Units
  const availableUnits = ['fr', 'px', '%', 'em', 'rem', 'auto'];
  
  // Initialize grid areas
  useEffect(() => {
    initializeGrid();
  }, [columns, rows]);
  
  // Update unique area names when areas change
  useEffect(() => {
    const names = new Set();
    areas.forEach(row => {
      row.forEach(cell => {
        if (cell && cell !== '.') {
          names.add(cell);
        }
      });
    });
    setUniqueAreaNames(Array.from(names));
  }, [areas]);
  
  // Initialize grid with empty areas
  const initializeGrid = () => {
    const newAreas = [];
    for (let i = 0; i < rows; i++) {
      const row = [];
      for (let j = 0; j < columns; j++) {
        row.push('.');
      }
      newAreas.push(row);
    }
    setAreas(newAreas);
    
    // Update templates if needed
    if (columnTemplate.length !== columns) {
      setColumnTemplate(Array(columns).fill('1fr'));
    }
    if (rowTemplate.length !== rows) {
      setRowTemplate(Array(rows).fill('1fr'));
    }
  };
  
  // Update column template value
  const updateColumnTemplate = (index, value) => {
    const newTemplate = [...columnTemplate];
    newTemplate[index] = value;
    setColumnTemplate(newTemplate);
  };
  
  // Update row template value
  const updateRowTemplate = (index, value) => {
    const newTemplate = [...rowTemplate];
    newTemplate[index] = value;
    setRowTemplate(newTemplate);
  };
  
  // Switch template unit
  const switchUnit = (template, index) => {
    const value = template[index];
    const numericValue = parseFloat(value);
    const currentUnit = value.replace(numericValue.toString(), '');
    
    // Find current unit index
    const unitIndex = availableUnits.indexOf(currentUnit);
    // Get next unit
    const nextUnit = availableUnits[(unitIndex + 1) % availableUnits.length];
    
    return `${numericValue}${nextUnit}`;
  };
  
  // Switch column unit
  const switchColumnUnit = (index) => {
    const newValue = switchUnit(columnTemplate, index);
    updateColumnTemplate(index, newValue);
  };
  
  // Switch row unit
  const switchRowUnit = (index) => {
    const newValue = switchUnit(rowTemplate, index);
    updateRowTemplate(index, newValue);
  };
  
  // Select a cell to assign area
  const selectCell = (rowIndex, colIndex) => {
    setSelectedCell({ row: rowIndex, col: colIndex });
    setAreaName(areas[rowIndex][colIndex] === '.' ? '' : areas[rowIndex][colIndex]);
  };
  
  // Assign area name to cell
  const assignAreaToCell = () => {
    if (!selectedCell) return;
    
    const newAreas = [...areas];
    newAreas[selectedCell.row][selectedCell.col] = areaName || '.';
    setAreas(newAreas);
    setAreaName('');
    setSelectedCell(null);
  };
  
  // Generate CSS code
  const generateCSSCode = () => {
    let code = `.container {\n  display: grid;\n`;
    
    // Add grid-template-columns
    code += `  grid-template-columns: ${columnTemplate.join(' ')};\n`;
    
    // Add grid-template-rows
    code += `  grid-template-rows: ${rowTemplate.join(' ')};\n`;
    
    // Add gap
    code += `  gap: ${gap}px;\n`;
    
    // Add grid-template-areas if there are named areas
    if (uniqueAreaNames.length > 0) {
      code += `  grid-template-areas:\n`;
      areas.forEach(row => {
        code += `    "${row.join(' ')}"\n`;
      });
    }
    
    code += `}\n\n`;
    
    // Add classes for each named area
    uniqueAreaNames.forEach(name => {
      code += `.${name} {\n  grid-area: ${name};\n}\n\n`;
    });
    
    return code;
  };
  
  // Copy CSS to clipboard
  const copyToClipboard = () => {
    const css = generateCSSCode();
    navigator.clipboard.writeText(css);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // Add column
  const addColumn = () => {
    if (columns < 12) {
      setColumns(columns + 1);
    }
  };
  
  // Remove column
  const removeColumn = () => {
    if (columns > 1) {
      setColumns(columns - 1);
    }
  };
  
  // Add row
  const addRow = () => {
    if (rows < 12) {
      setRows(rows + 1);
    }
  };
  
  // Remove row
  const removeRow = () => {
    if (rows > 1) {
      setRows(rows - 1);
    }
  };
  
  // Get color for a named area
  const getAreaColor = (areaName) => {
    if (areaName === '.') return 'bg-gray-100';
    
    const colors = [
      'bg-red-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200',
      'bg-purple-200', 'bg-pink-200', 'bg-indigo-200', 'bg-teal-200',
      'bg-orange-200', 'bg-cyan-200'
    ];
    
    // Consistently assign colors to area names
    const index = uniqueAreaNames.indexOf(areaName) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            CSS Grid Generator
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls Panel */}
            <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Grid Controls</h2>
              
              <div className="space-y-6">
                {/* Grid Dimensions */}
                <div>
                  <h3 className="font-medium mb-2 text-gray-700 border-b pb-1">Grid Dimensions</h3>
                  
                  <div className="space-y-3 mt-3">
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={removeColumn}
                        disabled={columns <= 1}
                        className="mr-2"
                      >
                        <Minus size={16} />
                      </Button>
                      <label className="block text-sm font-medium text-gray-700 mx-2">
                        Columns: {columns}
                      </label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addColumn}
                        disabled={columns >= 12}
                        className="ml-2"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    
                    <div className="flex items-center">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={removeRow}
                        disabled={rows <= 1}
                        className="mr-2"
                      >
                        <Minus size={16} />
                      </Button>
                      <label className="block text-sm font-medium text-gray-700 mx-2">
                        Rows: {rows}
                      </label>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={addRow}
                        disabled={rows >= 12}
                        className="ml-2"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gap: {gap}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="50"
                        value={gap}
                        onChange={(e) => setGap(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Column Templates */}
                <div>
                  <h3 className="font-medium mb-2 text-gray-700 border-b pb-1">Column Templates</h3>
                  
                  <div className="space-y-3 mt-3">
                    {columnTemplate.map((value, index) => (
                      <div key={`col-${index}`} className="flex items-center">
                        <span className="w-20 text-sm font-medium text-gray-700">Column {index + 1}</span>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateColumnTemplate(index, e.target.value)}
                          className="w-24 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => switchColumnUnit(index)}
                          className="ml-2"
                        >
                          Switch Unit
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Row Templates */}
                <div>
                  <h3 className="font-medium mb-2 text-gray-700 border-b pb-1">Row Templates</h3>
                  
                  <div className="space-y-3 mt-3">
                    {rowTemplate.map((value, index) => (
                      <div key={`row-${index}`} className="flex items-center">
                        <span className="w-20 text-sm font-medium text-gray-700">Row {index + 1}</span>
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateRowTemplate(index, e.target.value)}
                          className="w-24 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => switchRowUnit(index)}
                          className="ml-2"
                        >
                          Switch Unit
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Area Assignment */}
                {selectedCell && (
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h3 className="font-medium mb-2 text-gray-700">Assign Area</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      Assigning an area to cell at Row {selectedCell.row + 1}, Column {selectedCell.col + 1}
                    </p>
                    
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={areaName}
                        onChange={(e) => setAreaName(e.target.value.replace(/\s+/g, ''))}
                        placeholder="Area name (no spaces)"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={assignAreaToCell}
                        className="ml-2"
                      >
                        Assign
                      </Button>
                    </div>
                    
                    <div className="mt-2 text-sm text-gray-500">
                      Use dot (.) for no area assignment
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Preview and Code */}
            <div className="lg:col-span-8 space-y-6">
              {/* Grid Preview */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Grid Preview</h2>
                <p className="text-sm text-gray-600 mb-4">Click on a cell to assign a named area</p>
                
                <div 
                  className="border-2 border-dashed border-gray-300 p-4 rounded-lg"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: columnTemplate.join(' '),
                    gridTemplateRows: rowTemplate.join(' '),
                    gap: `${gap}px`,
                    minHeight: '350px',
                  }}
                >
                  {areas.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                      <div
                        key={`${rowIndex}-${colIndex}`}
                        className={`flex items-center justify-center p-4 rounded-md border border-gray-300 cursor-pointer transition-all ${getAreaColor(cell)} ${
                          selectedCell && selectedCell.row === rowIndex && selectedCell.col === colIndex
                            ? 'ring-2 ring-blue-500 ring-offset-2'
                            : ''
                        }`}
                        onClick={() => selectCell(rowIndex, colIndex)}
                      >
                        <span className="text-sm font-medium">
                          {cell === '.' ? `R${rowIndex + 1} C${colIndex + 1}` : cell}
                        </span>
                      </div>
                    ))
                  ))}
                </div>
                
                {uniqueAreaNames.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Named Areas:</h3>
                    <div className="flex flex-wrap gap-2">
                      {uniqueAreaNames.map((name) => (
                        <div 
                          key={name}
                          className={`px-3 py-1 text-xs rounded-full ${getAreaColor(name)} border border-gray-300`}
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Generated CSS */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Generated CSS</h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={copyToClipboard} 
                    className="flex items-center gap-1"
                  >
                    {copiedCode ? 'Copied!' : (
                      <>
                        <Copy size={16} />
                        <span>Copy CSS</span>
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="bg-gray-900 text-gray-100 p-4 rounded-md overflow-auto font-mono text-sm">
                  <pre>
                    {generateCSSCode()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          
          {/* Learning Resources */}
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">Understanding CSS Grid</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Grid Container Properties</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li><strong>display: grid</strong> - Defines a grid container</li>
                  <li><strong>grid-template-columns</strong> - Defines the columns of the grid</li>
                  <li><strong>grid-template-rows</strong> - Defines the rows of the grid</li>
                  <li><strong>gap</strong> - Defines the gap between grid items</li>
                  <li><strong>grid-template-areas</strong> - Defines named grid areas</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Grid Item Properties</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li><strong>grid-area</strong> - Assigns a grid item to a named grid area</li>
                  <li><strong>grid-column</strong> - Specifies which column(s) the item will span</li>
                  <li><strong>grid-row</strong> - Specifies which row(s) the item will span</li>
                  <li><strong>justify-self</strong> - Aligns an item inside its cell along the row axis</li>
                  <li><strong>align-self</strong> - Aligns an item inside its cell along the column axis</li>
                </ul>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mt-4 mb-2">Tips for Using CSS Grid</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Use <strong>fr</strong> units to create flexible grid layouts that respond to the available space</li>
              <li>The <strong>grid-template-areas</strong> property provides a visual way to define your grid layout</li>
              <li>Use named areas to create complex layouts without needing to specify exact grid lines</li>
              <li>You can mix different units like <strong>fr</strong>, <strong>px</strong>, and <strong>%</strong> in your grid definitions</li>
              <li>The <strong>auto</strong> keyword can be used to size rows or columns based on their content</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CssGridGenerator;
