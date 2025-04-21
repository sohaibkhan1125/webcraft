"use client";

import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const schemaTypes = [
  { id: "article", label: "Article" },
  { id: "product", label: "Product" },
  { id: "organization", label: "Organization" },
  { id: "localBusiness", label: "Local Business" },
  { id: "person", label: "Person" },
  { id: "recipe", label: "Recipe" },
  { id: "event", label: "Event" },
  { id: "review", label: "Review" }
];

const commonFields = [
  { id: "name", label: "Name", type: "text" },
  { id: "description", label: "Description", type: "textarea" },
  { id: "image", label: "Image URL", type: "url" },
  { id: "url", label: "Website URL", type: "url" }
];

const schemaSpecificFields = {
  article: [
    { id: "headline", label: "Headline", type: "text" },
    { id: "author", label: "Author Name", type: "text" },
    { id: "datePublished", label: "Publication Date", type: "date" },
    { id: "dateModified", label: "Last Modified Date", type: "date" }
  ],
  product: [
    { id: "price", label: "Price", type: "number" },
    { id: "currency", label: "Currency", type: "text" },
    { id: "availability", label: "Availability", type: "select", options: ["InStock", "OutOfStock", "PreOrder"] },
    { id: "brand", label: "Brand", type: "text" }
  ],
  organization: [
    { id: "address", label: "Address", type: "text" },
    { id: "telephone", label: "Phone Number", type: "tel" },
    { id: "email", label: "Email", type: "email" },
    { id: "foundingDate", label: "Founding Date", type: "date" }
  ],
  localBusiness: [
    { id: "address", label: "Address", type: "text" },
    { id: "telephone", label: "Phone Number", type: "tel" },
    { id: "priceRange", label: "Price Range", type: "text" },
    { id: "openingHours", label: "Opening Hours", type: "text" }
  ],
  person: [
    { id: "jobTitle", label: "Job Title", type: "text" },
    { id: "worksFor", label: "Works For", type: "text" },
    { id: "email", label: "Email", type: "email" },
    { id: "telephone", label: "Phone Number", type: "tel" }
  ],
  recipe: [
    { id: "prepTime", label: "Prep Time", type: "text" },
    { id: "cookTime", label: "Cook Time", type: "text" },
    { id: "recipeYield", label: "Servings", type: "text" },
    { id: "recipeCategory", label: "Category", type: "text" }
  ],
  event: [
    { id: "startDate", label: "Start Date", type: "datetime-local" },
    { id: "endDate", label: "End Date", type: "datetime-local" },
    { id: "location", label: "Location", type: "text" },
    { id: "offers", label: "Ticket Price", type: "number" }
  ],
  review: [
    { id: "itemReviewed", label: "Item Reviewed", type: "text" },
    { id: "reviewRating", label: "Rating (1-5)", type: "number" },
    { id: "author", label: "Author", type: "text" },
    { id: "datePublished", label: "Review Date", type: "date" }
  ]
};

export default function SchemaGenerator() {
  const [activeSchema, setActiveSchema] = useState("article");
  const [formData, setFormData] = useState({});
  const [generatedSchema, setGeneratedSchema] = useState("");
  const [copied, setCopied] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": activeSchema.charAt(0).toUpperCase() + activeSchema.slice(1),
      ...formData
    };

    // Format the schema with proper indentation
    const formattedSchema = JSON.stringify(schema, null, 2);
    setGeneratedSchema(formattedSchema);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>SEO Schema Markup Generator</CardTitle>
              <CardDescription>
                Generate structured data markup for better SEO
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="article" onValueChange={setActiveSchema}>
                <TabsList className="grid w-full grid-cols-4 gap-2 mb-4">
                  {schemaTypes.map((type) => (
                    <TabsTrigger key={type.id} value={type.id}>
                      {type.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <div className="space-y-4">
                  {commonFields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      <Input
                        id={field.id}
                        name={field.id}
                        type={field.type}
                        value={formData[field.id] || ""}
                        onChange={handleInputChange}
                      />
                    </div>
                  ))}
                  {schemaSpecificFields[activeSchema]?.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id}>{field.label}</Label>
                      {field.type === "select" ? (
                        <select
                          id={field.id}
                          name={field.id}
                          value={formData[field.id] || ""}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="">Select {field.label}</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Input
                          id={field.id}
                          name={field.id}
                          type={field.type}
                          value={formData[field.id] || ""}
                          onChange={handleInputChange}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </Tabs>
              <Button onClick={generateSchema} className="w-full">
                Generate Schema
              </Button>

              {generatedSchema && (
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <Label>Generated Schema</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                    >
                      {copied ? 'Copied!' : 'Copy to Clipboard'}
                    </Button>
                  </div>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <pre className="text-sm overflow-x-auto">
                      {generatedSchema}
                    </pre>
                  </div>
                </div>
              )}

              <div className="mt-6 text-sm text-gray-500">
                <p>Tips:</p>
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Use descriptive names and descriptions</li>
                  <li>Include high-quality images</li>
                  <li>Ensure all URLs are absolute</li>
                  <li>Use proper date formats (YYYY-MM-DD)</li>
                  <li>Test your schema with Google's Rich Results Test</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer/>
    </section>
  );
}
