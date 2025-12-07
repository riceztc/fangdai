import React, { useState } from 'react';
import { CalculationResult, RepaymentMethod } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../utils/calculator';
import { getAiAdvice } from '../services/geminiService';
import { AdBanner } from './AdBanner';

interface ResultCardProps {
  commercial?: CalculationResult;
  provident?: CalculationResult;
  totalAmount: number; // Yuan
  years: number;
  method: RepaymentMethod;
  onReset: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  commercial,
  provident,
  totalAmount,
  years,
  method,
  onReset
}) => {
  const [advice, setAdvice] = useState<string | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);

  const totalMonthly = (commercial?.monthlyPayment || 0) + (provident?.monthlyPayment || 0);
  const totalInterest = (commercial?.totalInterest || 0) + (provident?.totalInterest || 0);
  const totalRepayment = (commercial?.totalRepayment || 0) + (provident?.totalRepayment || 0);
  const monthlyDecrease = (commercial?.monthlyPaymentDecrease || 0) + (provident?.monthlyPaymentDecrease || 0);

  const data = [
    { name: '贷款本金', value: totalAmount },
    { name: '支付利息', value: totalInterest },
  ];
  const COLORS = ['#10b981', '#f59e0b']; // Emerald-500, Amber-500

  const handleAskAI = async () => {
    setLoadingAdvice(true);
    const result = await getAiAdvice({ commercial, provident }, totalAmount, years, method);
    setAdvice(result);
    setLoadingAdvice(false);
  };

  return (
    <div className="bg-white rounded-t-3xl shadow-2xl p-6 pb-24 animate-slide-up relative">
      <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6" />
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">计算结果</h2>
        <button onClick={onReset} className="text-sm text-emerald-600 font-medium">
          重新计算
        </button>
      </div>

      {/* Main Number */}
      <div className="text-center mb-8">
        <p className="text-gray-500 text-sm mb-1">
          {method === RepaymentMethod.EQUAL_INTEREST ? '每月应还' : '首月应还'}
        </p>
        <div className="text-4xl font-extrabold text-gray-900">
          {formatCurrency(totalMonthly)}
        </div>
        {method === RepaymentMethod.EQUAL_PRINCIPAL && (
          <p className="text-xs text-gray-400 mt-1">
            每月递减 {formatCurrency(monthlyDecrease)}
          </p>
        )}
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500">利息总额</p>
          <p className="text-lg font-bold text-gray-800">{(totalInterest / 10000).toFixed(2)}万</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500">累计还款</p>
          <p className="text-lg font-bold text-gray-800">{(totalRepayment / 10000).toFixed(2)}万</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500">贷款总额</p>
          <p className="text-lg font-bold text-gray-800">{(totalAmount / 10000).toFixed(2)}万</p>
        </div>
        <div className="bg-gray-50 p-3 rounded-xl">
          <p className="text-xs text-gray-500">贷款年限</p>
          <p className="text-lg font-bold text-gray-800">{years}年</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-48 w-full mb-6 relative">
         <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(val: number) => formatCurrency(val)} />
            </PieChart>
         </ResponsiveContainer>
         <div className="absolute top-0 right-0 flex flex-col gap-1 text-xs">
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>本金</div>
            <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>利息</div>
         </div>
      </div>

      {/* Ad Space inside Results */}
      <AdBanner className="mb-6" />

      {/* AI Advice Section */}
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 mb-8">
        <div className="flex items-center justify-between mb-2">
           <h3 className="font-bold text-emerald-800 flex items-center gap-2">
             ✨ AI 购房建议
           </h3>
           {!advice && !loadingAdvice && (
             <button 
                onClick={handleAskAI}
                className="text-xs bg-emerald-600 text-white px-3 py-1 rounded-full active:scale-95 transition-transform"
             >
               点击分析
             </button>
           )}
        </div>
        
        {loadingAdvice && (
          <div className="text-sm text-emerald-600 flex items-center gap-2">
            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            AI 正在思考中...
          </div>
        )}

        {advice && (
          <p className="text-sm text-emerald-900 leading-relaxed text-justify">
            {advice}
          </p>
        )}
         
         {!advice && !loadingAdvice && (
           <p className="text-xs text-emerald-600/70">
             基于您的贷款数据，获取专业的财务和还款建议。
           </p>
         )}
      </div>

    </div>
  );
};