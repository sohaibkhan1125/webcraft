'use client'

import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Button } from "@/components/ui/button";
import { Copy, Code } from 'lucide-react';

const FlexboxPlayground = () => {
  // Container properties
  const [flexDirection, setFlexDirection] = useState('row');
  const [justifyContent, setJustifyContent] = useState('flex-start');
  const [alignItems, setAlignItems] = useState('stretch');
  const [flexWrap, setFlexWrap] = useState('nowrap');
  const [gap, setGap] = useState(10);
  
  // Items properties
  const [itemCount, setItemCount] = useState(5);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [items, setItems] = useState([]);
  
  // Code display
  const [copiedCode, setCopiedCode] = useState(false);
  
  // Initialize items
  useEffect(() => {
    const newItems = Array.from({ length: itemCount }, (_, i) => ({
      flexGrow: 0,
      flexShrink: 1,
      flexBasis: 'auto',
      alignSelf: 'auto',
      order: 0,
      id: i + 1
    }));
    setItems(newItems);
  }, [itemCount]);
  
  // Update an item property
  const updateItemProperty = (index, property, value) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [property]: value };
    setItems(newItems);
  };
  
  // Generate CSS code for container
  const generateContainerCSS = () => {
    return `.container {\n  display: flex;\n  flex-direction: ${flexDirection};\n  justify-content: ${justifyContent};\n  align-items: ${alignItems};\n  flex-wrap: ${flexWrap};\n  gap: ${gap}px;\n}`;
  };
  
  // Generate CSS code for items
  const generateItemsCSS = () => {
    return items.map((item, index) => {
      return `.item-${item.id} {\n  flex-grow: ${item.flexGrow};\n  flex-shrink: ${item.flexShrink};\n  flex-basis: ${item.flexBasis};\n  align-self: ${item.alignSelf};\n  order: ${item.order};\n}`;
    }).join('\n\n');
  };
  
  // Copy CSS to clipboard
  const copyToClipboard = () => {
    const css = `${generateContainerCSS()}\n\n${generateItemsCSS()}`;
    navigator.clipboard.writeText(css);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };
  
  // Color generator for items
  const getColor = (index) => {
    const colors = [
      '#4F46E5', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
      '#EC4899', '#F43F5E', '#EF4444', '#F97316', '#F59E0B',
      '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6',
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            CSS Flexbox Playground
          </h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Controls Panel */}
            <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Flexbox Controls</h2>
              
              <div className="space-y-6">
                {/* Container Properties */}
                <div>
                  <h3 className="font-medium mb-2 text-gray-700 border-b pb-1">Container Properties</h3>
                  
                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        flex-direction
                      </label>
                      <select
                        value={flexDirection}
                        onChange={(e) => setFlexDirection(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="row">row</option>
                        <option value="row-reverse">row-reverse</option>
                        <option value="column">column</option>
                        <option value="column-reverse">column-reverse</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        justify-content
                      </label>
                      <select
                        value={justifyContent}
                        onChange={(e) => setJustifyContent(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="flex-start">flex-start</option>
                        <option value="flex-end">flex-end</option>
                        <option value="center">center</option>
                        <option value="space-between">space-between</option>
                        <option value="space-around">space-around</option>
                        <option value="space-evenly">space-evenly</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        align-items
                      </label>
                      <select
                        value={alignItems}
                        onChange={(e) => setAlignItems(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="stretch">stretch</option>
                        <option value="flex-start">flex-start</option>
                        <option value="flex-end">flex-end</option>
                        <option value="center">center</option>
                        <option value="baseline">baseline</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        flex-wrap
                      </label>
                      <select
                        value={flexWrap}
                        onChange={(e) => setFlexWrap(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="nowrap">nowrap</option>
                        <option value="wrap">wrap</option>
                        <option value="wrap-reverse">wrap-reverse</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        gap: {gap}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={gap}
                        onChange={(e) => setGap(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Items Controls */}
                <div>
                  <h3 className="font-medium mb-2 text-gray-700 border-b pb-1">Items</h3>
                  
                  <div className="space-y-3 mt-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Number of Items: {itemCount}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={itemCount}
                        onChange={(e) => setItemCount(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    {selectedItemIndex !== null && (
                      <div className="bg-gray-100 p-3 rounded-md">
                        <h4 className="font-medium text-sm mb-2">
                          Item {items[selectedItemIndex].id} Properties
                        </h4>
                        
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              flex-grow: {items[selectedItemIndex].flexGrow}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="1"
                              value={items[selectedItemIndex].flexGrow}
                              onChange={(e) => updateItemProperty(selectedItemIndex, 'flexGrow', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              flex-shrink: {items[selectedItemIndex].flexShrink}
                            </label>
                            <input
                              type="range"
                              min="0"
                              max="5"
                              step="1"
                              value={items[selectedItemIndex].flexShrink}
                              onChange={(e) => updateItemProperty(selectedItemIndex, 'flexShrink', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              flex-basis
                            </label>
                            <select
                              value={items[selectedItemIndex].flexBasis}
                              onChange={(e) => updateItemProperty(selectedItemIndex, 'flexBasis', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                            >
                              <option value="auto">auto</option>
                              <option value="0">0</option>
                              <option value="50px">50px</option>
                              <option value="100px">100px</option>
                              <option value="150px">150px</option>
                              <option value="30%">30%</option>
                              <option value="50%">50%</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              align-self
                            </label>
                            <select
                              value={items[selectedItemIndex].alignSelf}
                              onChange={(e) => updateItemProperty(selectedItemIndex, 'alignSelf', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs"
                            >
                              <option value="auto">auto</option>
                              <option value="flex-start">flex-start</option>
                              <option value="flex-end">flex-end</option>
                              <option value="center">center</option>
                              <option value="stretch">stretch</option>
                              <option value="baseline">baseline</option>
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                              order: {items[selectedItemIndex].order}
                            </label>
                            <input
                              type="range"
                              min="-5"
                              max="5"
                              value={items[selectedItemIndex].order}
                              onChange={(e) => updateItemProperty(selectedItemIndex, 'order', parseInt(e.target.value))}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Preview and Code */}
            <div className="lg:col-span-8 space-y-6">
              {/* Flexbox Preview */}
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Flexbox Preview</h2>
                <p className="text-sm text-gray-600 mb-4">Click on an item to edit its properties</p>
                
                <div 
                  className="border-2 border-dashed border-gray-300 p-4 rounded-lg h-96 overflow-auto"
                  style={{
                    display: 'flex',
                    flexDirection,
                    justifyContent,
                    alignItems,
                    flexWrap,
                    gap: `${gap}px`,
                  }}
                >
                  {items.map((item, index) => (
                    <div
                      key={item.id}
                      className={`flex items-center justify-center text-white font-medium p-4 rounded-md transition-all cursor-pointer ${selectedItemIndex === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                      style={{
                        backgroundColor: getColor(index),
                        flexGrow: item.flexGrow,
                        flexShrink: item.flexShrink,
                        flexBasis: item.flexBasis,
                        alignSelf: item.alignSelf,
                        order: item.order,
                        minWidth: '50px',
                        minHeight: '50px',
                      }}
                      onClick={() => setSelectedItemIndex(index)}
                    >
                      {item.id}
                    </div>
                  ))}
                </div>
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
                    {`${generateContainerCSS()}\n\n${generateItemsCSS()}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
          
          {/* Learning Resources */}
          <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
            <h2 className="text-xl font-semibold mb-4">Understanding Flexbox</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-lg mb-2">Container Properties</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li><strong>display: flex</strong> - Defines a flex container</li>
                  <li><strong>flex-direction</strong> - Direction of flex items (row, column)</li>
                  <li><strong>justify-content</strong> - Alignment along the main axis</li>
                  <li><strong>align-items</strong> - Alignment along the cross axis</li>
                  <li><strong>flex-wrap</strong> - Whether items should wrap or not</li>
                  <li><strong>gap</strong> - Space between flex items</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-medium text-lg mb-2">Item Properties</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                  <li><strong>flex-grow</strong> - How much an item can grow</li>
                  <li><strong>flex-shrink</strong> - How much an item can shrink</li>
                  <li><strong>flex-basis</strong> - Default size before remaining space is distributed</li>
                  <li><strong>align-self</strong> - Override container's align-items</li>
                  <li><strong>order</strong> - Controls the order of items</li>
                </ul>
              </div>
            </div>
            
            <h3 className="font-medium text-lg mt-4 mb-2">Tips for Using Flexbox</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
              <li>Use <strong>flex-direction: row</strong> for horizontal layouts and <strong>column</strong> for vertical layouts</li>
              <li>The <strong>justify-content</strong> property aligns items along the direction specified by flex-direction</li>
              <li>The <strong>align-items</strong> property aligns items perpendicular to the direction specified by flex-direction</li>
              <li>Use <strong>flex-grow</strong> to make items expand to fill available space</li>
              <li>The <strong>order</strong> property can change the visual order without changing the HTML structure</li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FlexboxPlayground; 