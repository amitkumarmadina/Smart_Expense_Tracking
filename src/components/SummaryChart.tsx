import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { PieChart, TrendingUp } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Expense {
  id: string;
  category: string;
  amount: number;
  note: string;
  timestamp: any;
  createdAt: string;
}

interface SummaryChartProps {
  expenses: Expense[];
}

const SummaryChart: React.FC<SummaryChartProps> = ({ expenses }) => {
  if (expenses.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-4">
          <PieChart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No data to display</h3>
        <p className="text-gray-500">Add some expenses to see your spending breakdown.</p>
      </div>
    );
  }

  // Calculate category totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort categories by amount (descending)
  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8); // Limit to top 8 categories for better visualization

  const colors = [
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F59E0B', // Amber
    '#EF4444', // Red
    '#8B5CF6', // Violet
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#84CC16', // Lime
  ];

  const data = {
    labels: sortedCategories.map(([category]) => category),
    datasets: [
      {
        data: sortedCategories.map(([, amount]) => amount),
        backgroundColor: colors,
        borderColor: colors.map(color => color + '20'),
        borderWidth: 2,
        hoverBorderWidth: 3,
        hoverOffset: 8,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: '500',
          },
          color: '#374151',
          generateLabels: (chart) => {
            const data = chart.data;
            if (data.labels?.length && data.datasets.length) {
              const total = data.datasets[0].data.reduce((sum: number, value) => sum + (value as number), 0);
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i] as number;
                const percentage = ((value / total) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor?.[i] as string,
                  strokeStyle: data.datasets[0].borderColor?.[i] as string,
                  lineWidth: data.datasets[0].borderWidth as number,
                  hidden: false,
                  index: i,
                };
              });
            }
            return [];
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1F2937',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        cornerRadius: 12,
        padding: 12,
        displayColors: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((sum: number, val) => sum + (val as number), 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          }
        }
      },
    },
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1000,
    },
  };

  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const topCategory = sortedCategories[0];
  const topCategoryPercentage = ((topCategory[1] / totalAmount) * 100).toFixed(1);

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl mr-4 shadow-lg">
          <PieChart className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Spending Summary</h2>
          <p className="text-sm text-gray-600">Category breakdown</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80">
          <Pie data={data} options={options} />
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 border border-blue-100">
            <div className="flex items-center mb-2">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Top Category</h3>
            </div>
            <p className="text-2xl font-bold text-blue-600">{topCategory[0]}</p>
            <p className="text-sm text-gray-600">
              ${topCategory[1].toFixed(2)} ({topCategoryPercentage}% of total)
            </p>
          </div>
          
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-800">Category Breakdown</h4>
            {sortedCategories.map(([category, amount], index) => {
              const percentage = ((amount / totalAmount) * 100).toFixed(1);
              return (
                <div key={category} className="flex items-center justify-between py-2">
                  <div className="flex items-center">
                    <div 
                      className="w-4 h-4 rounded-full mr-3 shadow-sm"
                      style={{ backgroundColor: colors[index] }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-800">
                      ${amount.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">{percentage}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryChart;