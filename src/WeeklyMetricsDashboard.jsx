import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ComposedChart, Area } from 'recharts';
import { weeklyData, lastUpdated, currentWeek } from './data';

const WeeklyMetricsDashboard = () => {
  const [activeTab, setActiveTab] = useState('sales');
  
  // Calculate totals and changes
  const latestWeek = weeklyData[weeklyData.length - 1];
  const previousWeek = weeklyData.length > 1 ? weeklyData[weeklyData.length - 2] : latestWeek;
  
  const calcChange = (current, previous) => {
    if (!previous || previous === 0) return '—';
    const change = ((current - previous) / previous * 100).toFixed(1);
    return change > 0 ? `+${change}%` : `${change}%`;
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return '—';
    return new Intl.NumberFormat('en-US').format(value);
  };

  // KPI Card Component
  const KPICard = ({ title, value, change, changeLabel, icon, color }) => {
    const isPositive = change && change.startsWith && change.startsWith('+');
    const isNegative = change && change.startsWith && change.startsWith('-');
    
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <span className="text-gray-500 text-sm font-medium">{title}</span>
          <span className={`text-2xl ${color}`}>{icon}</span>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
        {change && (
          <div className={`text-sm font-medium ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'}`}>
            {change} {changeLabel}
          </div>
        )}
      </div>
    );
  };

  // Tab Button Component
  const TabButton = ({ id, label, active }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
        active 
          ? 'bg-indigo-600 text-white' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CAKE Weekly Metrics</h1>
              <p className="text-gray-500 mt-1">Performance Dashboard • Week {currentWeek} ending {latestWeek.dateRange.split('-')[1]}, 2026</p>
            </div>
            <div className="text-right text-sm text-gray-400">
              Last updated: {lastUpdated}
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <KPICard 
            title="CA Sales" 
            value={formatCurrency(latestWeek.caSalesDollars)}
            change={calcChange(latestWeek.caSalesDollars, previousWeek.caSalesDollars)}
            changeLabel="vs last week"
            icon="💰"
            color="text-green-500"
          />
          <KPICard 
            title="CA Units" 
            value={formatNumber(latestWeek.caSalesUnits)}
            change={calcChange(latestWeek.caSalesUnits, previousWeek.caSalesUnits)}
            changeLabel="vs last week"
            icon="📦"
            color="text-blue-500"
          />
          <KPICard 
            title="Orders" 
            value={latestWeek.caOrdersDelivered}
            change={calcChange(latestWeek.caOrdersDelivered, previousWeek.caOrdersDelivered)}
            changeLabel="vs last week"
            icon="🚚"
            color="text-purple-500"
          />
          <KPICard 
            title="COGs %" 
            value={`${latestWeek.cogsPercent}%`}
            change={`${(latestWeek.cogsPercent - previousWeek.cogsPercent).toFixed(1)} pts`}
            changeLabel="vs last week"
            icon="📊"
            color="text-orange-500"
          />
          <KPICard 
            title="Manufactured" 
            value={formatNumber(latestWeek.caUnitsManufactured)}
            change={calcChange(latestWeek.caUnitsManufactured, previousWeek.caUnitsManufactured)}
            changeLabel="vs last week"
            icon="🏭"
            color="text-teal-500"
          />
          <KPICard 
            title="Pulse Check" 
            value={`${latestWeek.pulseCheck}/5`}
            change={latestWeek.pulseCheck === previousWeek.pulseCheck ? '—' : calcChange(latestWeek.pulseCheck, previousWeek.pulseCheck)}
            changeLabel="vs last week"
            icon="⭐"
            color="text-yellow-500"
          />
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 flex-wrap">
          <TabButton id="sales" label="Sales Performance" active={activeTab === 'sales'} />
          <TabButton id="operations" label="Operations" active={activeTab === 'operations'} />
          <TabButton id="regional" label="Regional" active={activeTab === 'regional'} />
          <TabButton id="collections" label="AR Collections" active={activeTab === 'collections'} />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeTab === 'sales' && (
            <>
              {/* CA Sales Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">CA Sales Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip 
                      formatter={(value) => formatCurrency(value)}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Area type="monotone" dataKey="caSalesDollars" fill="#818cf8" fillOpacity={0.3} stroke="#6366f1" strokeWidth={2} name="Revenue" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* CA Units Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">CA Units Sold vs Manufactured</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatNumber(value)} />
                    <Legend />
                    <Bar dataKey="caSalesUnits" fill="#10b981" name="Units Sold" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="caUnitsManufactured" fill="#6366f1" name="Units Manufactured" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Orders & Promo */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders Delivered & Promo Units</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="caOrdersDelivered" fill="#f59e0b" name="Orders" radius={[4, 4, 0, 0]} />
                    <Line yAxisId="right" type="monotone" dataKey="caPromoUnits" stroke="#ef4444" strokeWidth={2} name="Promo Units" />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              {/* Avg Order Value */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Order Value</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData.map(w => ({
                    ...w,
                    avgOrderValue: w.caSalesDollars / w.caOrdersDelivered,
                    avgUnitsPerOrder: w.caSalesUnits / w.caOrdersDelivered
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${value.toFixed(0)}`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => typeof value === 'number' ? `$${value.toFixed(0)}` : value} />
                    <Legend />
                    <Line type="monotone" dataKey="avgOrderValue" stroke="#8b5cf6" strokeWidth={3} name="Avg Order Value" dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'operations' && (
            <>
              {/* COGs Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost of Goods Sold %</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis domain={[38, 48]} tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Line type="monotone" dataKey="cogsPercent" stroke="#ef4444" strokeWidth={3} name="COGs %" dot={{ r: 6, fill: '#ef4444' }} />
                  </LineChart>
                </ResponsiveContainer>
                {latestWeek.cogsPercent > previousWeek.cogsPercent && (
                  <div className="mt-4 p-3 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">⚠️ COGs trending up {(latestWeek.cogsPercent - previousWeek.cogsPercent).toFixed(1)} pts from last week. Consider reviewing product mix.</p>
                  </div>
                )}
              </div>

              {/* Pulse Check */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Pulse Check Rating</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="pulseCheck" fill="#fbbf24" name="Pulse Rating" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="mt-4 flex justify-between text-sm">
                  <span className="text-gray-500">Target: 4.0+</span>
                  <span className={latestWeek.pulseCheck >= 4.0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                    {latestWeek.pulseCheck >= 4.0 ? '✓ Above target' : '⚠ Below target'}
                  </span>
                </div>
              </div>

              {/* Manufacturing Efficiency */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Manufacturing vs Sales Efficiency</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={weeklyData.map(w => ({
                    ...w,
                    ratio: ((w.caUnitsManufactured / w.caSalesUnits) * 100).toFixed(0)
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="left" tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}%`} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="caSalesUnits" fill="#10b981" name="Units Sold" opacity={0.8} />
                    <Bar yAxisId="left" dataKey="caUnitsManufactured" fill="#6366f1" name="Units Manufactured" opacity={0.8} />
                    <Line yAxisId="right" type="monotone" dataKey="ratio" stroke="#f59e0b" strokeWidth={3} name="Mfg/Sales Ratio %" dot={{ r: 5 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </>
          )}

          {activeTab === 'regional' && (
            <>
              {/* Regional Sales Comparison */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Sales ($)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="caSalesDollars" fill="#6366f1" name="California" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="azSalesDollars" fill="#f59e0b" name="Arizona" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nvSalesDollars" fill="#10b981" name="Nevada" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Regional Units */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Units Sold</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatNumber(value)} />
                    <Legend />
                    <Bar dataKey="caSalesUnits" fill="#6366f1" name="California" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="azSalesUnits" fill="#f59e0b" name="Arizona" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nvSalesUnits" fill="#10b981" name="Nevada" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Regional Mix */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Regional Revenue Mix (Week {currentWeek})</h3>
                <div className="flex items-center justify-center gap-8 flex-wrap">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-indigo-600">{((latestWeek.caSalesDollars / (latestWeek.caSalesDollars + latestWeek.azSalesDollars + latestWeek.nvSalesDollars)) * 100).toFixed(0)}%</div>
                    <div className="text-gray-500 mt-1">California</div>
                    <div className="text-sm text-gray-400">{formatCurrency(latestWeek.caSalesDollars)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-amber-500">{((latestWeek.azSalesDollars / (latestWeek.caSalesDollars + latestWeek.azSalesDollars + latestWeek.nvSalesDollars)) * 100).toFixed(0)}%</div>
                    <div className="text-gray-500 mt-1">Arizona</div>
                    <div className="text-sm text-gray-400">{formatCurrency(latestWeek.azSalesDollars)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-emerald-500">{((latestWeek.nvSalesDollars / (latestWeek.caSalesDollars + latestWeek.azSalesDollars + latestWeek.nvSalesDollars)) * 100).toFixed(0)}%</div>
                    <div className="text-gray-500 mt-1">Nevada</div>
                    <div className="text-sm text-gray-400">{formatCurrency(latestWeek.nvSalesDollars)}</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'collections' && (
            <>
              {/* AR Collections by State */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">AR Collected by State</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyData.filter(w => w.caArCollected !== null)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="caArCollected" fill="#6366f1" name="California" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="azArCollected" fill="#f59e0b" name="Arizona" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="nvArCollected" fill="#10b981" name="Nevada" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Total Collections Trend */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Total AR Collected</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData.filter(w => w.caArCollected !== null).map(w => ({
                    ...w,
                    totalAr: (w.caArCollected || 0) + (w.azArCollected || 0) + (w.nvArCollected || 0)
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="week" tick={{ fontSize: 12 }} />
                    <YAxis tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Line type="monotone" dataKey="totalAr" stroke="#8b5cf6" strokeWidth={3} name="Total Collected" dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Collection Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Week {currentWeek} Collection Summary</h3>
                <div className="grid grid-cols-4 gap-4">
                  <div className="p-4 bg-indigo-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-indigo-600">{formatCurrency(latestWeek.caArCollected)}</div>
                    <div className="text-sm text-indigo-500 mt-1">California AR</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-amber-600">{formatCurrency(latestWeek.azArCollected)}</div>
                    <div className="text-sm text-amber-500 mt-1">Arizona AR</div>
                  </div>
                  <div className="p-4 bg-emerald-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-emerald-600">{formatCurrency(latestWeek.nvArCollected)}</div>
                    <div className="text-sm text-emerald-500 mt-1">Nevada AR</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg text-center">
                    <div className="text-2xl font-bold text-purple-600">{formatCurrency((latestWeek.caArCollected || 0) + (latestWeek.azArCollected || 0) + (latestWeek.nvArCollected || 0))}</div>
                    <div className="text-sm text-purple-500 mt-1">Total Collected</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Week Summary Table */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Summary</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-600">Metric</th>
                  {weeklyData.map(w => (
                    <th key={w.week} className="text-right py-3 px-4 font-semibold text-gray-600">{w.week}<br/><span className="font-normal text-gray-400">{w.dateRange}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">CA Sales ($)</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{formatCurrency(w.caSalesDollars)}</td>)}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">CA Sales (Units)</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{formatNumber(w.caSalesUnits)}</td>)}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">CA Orders</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{w.caOrdersDelivered}</td>)}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">CA Promo Units</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{formatNumber(w.caPromoUnits)}</td>)}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">CA Manufactured</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{formatNumber(w.caUnitsManufactured)}</td>)}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">COGs %</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{w.cogsPercent}%</td>)}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">AZ Sales ($)</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{formatCurrency(w.azSalesDollars)}</td>)}
                </tr>
                <tr className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">NV Sales ($)</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{formatCurrency(w.nvSalesDollars)}</td>)}
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium">Pulse Check</td>
                  {weeklyData.map(w => <td key={w.week} className="text-right py-3 px-4">{w.pulseCheck}/5</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-400">
          Data sourced from BigQuery and Monday.com • Updated weekly on Fridays
        </div>
      </div>
    </div>
  );
};

export default WeeklyMetricsDashboard;
