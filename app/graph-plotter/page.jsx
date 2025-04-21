'use client'
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function GraphPlotter() {
  const [functionInput, setFunctionInput] = useState('x');
  const [xMin, setXMin] = useState(-10);
  const [xMax, setXMax] = useState(10);
  const [step, setStep] = useState(0.1);
  const [chartData, setChartData] = useState(null);

  const plotFunction = () => {
    try {
      const xValues = [];
      const yValues = [];
      
      for (let x = xMin; x <= xMax; x += step) {
        xValues.push(x);
        // Replace 'x' in the function with the current x value
        const y = eval(functionInput.replace(/x/g, `(${x})`));
        yValues.push(y);
      }

      setChartData({
        labels: xValues,
        datasets: [
          {
            label: `f(x) = ${functionInput}`,
            data: yValues,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
            fill: false
          }
        ]
      });
    } catch (error) {
      console.error('Error plotting function:', error);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Function Plotter'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'x'
        }
      },
      y: {
        title: {
          display: true,
          text: 'f(x)'
        }
      }
    }
  };

  return (
    <section>
      <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Graph Plotter</CardTitle>
              <CardDescription>
                Plot mathematical functions and visualize them on a graph
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="function">Function (use 'x' as variable)</Label>
                  <Input
                    id="function"
                    value={functionInput}
                    onChange={(e) => setFunctionInput(e.target.value)}
                    className="mt-2"
                    placeholder="e.g., x^2, sin(x), 2*x+1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="xMin">X Min</Label>
                    <Input
                      id="xMin"
                      type="number"
                      value={xMin}
                      onChange={(e) => setXMin(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="xMax">X Max</Label>
                    <Input
                      id="xMax"
                      type="number"
                      value={xMax}
                      onChange={(e) => setXMax(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="step">Step Size</Label>
                    <Input
                      id="step"
                      type="number"
                      value={step}
                      onChange={(e) => setStep(Number(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>

                <Button onClick={plotFunction} className="w-full">
                  Plot Function
                </Button>
              </div>
            </CardContent>
          </Card>

          {chartData && (
            <Card>
              <CardContent className="pt-6">
                <div className="h-[400px]">
                  <Line data={chartData} options={chartOptions} />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer/>
    </section>
  );
}
