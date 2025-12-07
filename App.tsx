import React, { useState } from 'react';
import { LoanType, RepaymentMethod, LoanInputState, CalculationResult } from './types';
import { DEFAULT_COMMERCIAL_RATE, DEFAULT_PROVIDENT_RATE, LOAN_YEAR_OPTIONS } from './constants';
import { calculateMortgage } from './utils/calculator';
import { ResultCard } from './components/ResultCard';
import { AdBanner } from './components/AdBanner';

function App() {
  const [inputs, setInputs] = useState<LoanInputState>({
    loanType: LoanType.COMMERCIAL,
    repaymentMethod: RepaymentMethod.EQUAL_INTEREST,
    amountCommercial: 100, // 100 Wan
    rateCommercial: DEFAULT_COMMERCIAL_RATE,
    amountProvident: 50,
    rateProvident: DEFAULT_PROVIDENT_RATE,
    years: 30,
  });

  const [results, setResults] = useState<{
    commercial?: CalculationResult;
    provident?: CalculationResult;
    show: boolean;
  }>({ show: false });

  const handleCalculate = () => {
    const commercialResult = 
      (inputs.loanType === LoanType.COMMERCIAL || inputs.loanType === LoanType.COMBINED) 
      ? calculateMortgage(inputs.amountCommercial * 10000, inputs.rateCommercial, inputs.years, inputs.repaymentMethod) 
      : undefined;

    const providentResult = 
      (inputs.loanType === LoanType.PROVIDENT || inputs.loanType === LoanType.COMBINED)
      ? calculateMortgage(inputs.amountProvident * 10000, inputs.rateProvident, inputs.years, inputs.repaymentMethod)
      : undefined;

    setResults({
      commercial: commercialResult,
      provident: providentResult,
      show: true
    });
  };

  const handleReset = () => {
    setResults({ show: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateInput = (key: keyof LoanInputState, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans max-w-md mx-auto shadow-2xl overflow-hidden relative">
      {/* Header */}
      <header className="bg-emerald-600 text-white pt-12 pb-6 px-6 rounded-b-3xl shadow-lg relative z-10">
        <h1 className="text-2xl font-bold mb-1">房贷计算器</h1>
        <p className="text-emerald-100 text-sm opacity-90">轻松计算，买房无忧</p>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-4 -mt-4 relative z-20 pb-20">
        {/* Card Container */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4">
          
          {/* Loan Type Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            {Object.values(LoanType).map((type) => (
              <button
                key={type}
                onClick={() => updateInput('loanType', type)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  inputs.loanType === type
                    ? 'bg-white text-emerald-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {type.replace('贷款', '')}
              </button>
            ))}
          </div>

          {/* Form Inputs */}
          <div className="space-y-5">
            
            {/* Commercial Amount */}
            {(inputs.loanType === LoanType.COMMERCIAL || inputs.loanType === LoanType.COMBINED) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">商业贷款金额 (万元)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.amountCommercial}
                    onChange={(e) => updateInput('amountCommercial', Number(e.target.value))}
                    className="w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 text-lg font-bold text-gray-800 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-medium">万</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                   <span className="text-xs text-gray-500 whitespace-nowrap">商贷利率 (%)</span>
                   <input 
                      type="number"
                      step="0.01"
                      value={inputs.rateCommercial}
                      onChange={(e) => updateInput('rateCommercial', Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-gray-100 rounded text-center text-sm font-bold text-emerald-700 focus:outline-emerald-500"
                   />
                </div>
              </div>
            )}

            {/* Provident Amount */}
            {(inputs.loanType === LoanType.PROVIDENT || inputs.loanType === LoanType.COMBINED) && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公积金贷款金额 (万元)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={inputs.amountProvident}
                    onChange={(e) => updateInput('amountProvident', Number(e.target.value))}
                    className="w-full pl-3 pr-10 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 text-lg font-bold text-gray-800 outline-none transition-all"
                  />
                  <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-medium">万</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                   <span className="text-xs text-gray-500 whitespace-nowrap">公积金利率 (%)</span>
                   <input 
                      type="number"
                      step="0.01"
                      value={inputs.rateProvident}
                      onChange={(e) => updateInput('rateProvident', Number(e.target.value))}
                      className="w-20 px-2 py-1 bg-gray-100 rounded text-center text-sm font-bold text-emerald-700 focus:outline-emerald-500"
                   />
                </div>
              </div>
            )}

            {/* Years Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">贷款年限</label>
              <div className="grid grid-cols-3 gap-2">
                {LOAN_YEAR_OPTIONS.map((y) => (
                  <button
                    key={y}
                    onClick={() => updateInput('years', y)}
                    className={`py-2 text-sm rounded-lg border transition-all ${
                      inputs.years === y
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {y}年
                  </button>
                ))}
              </div>
            </div>

            {/* Repayment Method */}
            <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">还款方式</label>
               <div className="grid grid-cols-2 gap-3">
                  {Object.values(RepaymentMethod).map((method) => (
                    <button
                      key={method}
                      onClick={() => updateInput('repaymentMethod', method)}
                      className={`py-3 px-2 rounded-xl border text-sm flex flex-col items-center justify-center transition-all ${
                         inputs.repaymentMethod === method
                         ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                         : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-bold text-base mb-0.5">{method}</span>
                      <span className={`text-xs ${inputs.repaymentMethod === method ? 'text-emerald-100' : 'text-gray-400'}`}>
                        {method === RepaymentMethod.EQUAL_INTEREST ? '每月还款额固定' : '总利息较少'}
                      </span>
                    </button>
                  ))}
               </div>
            </div>

          </div>
        </div>

        {/* Inline Ad */}
        <AdBanner className="mb-4" />

        {/* Calculate Button (Floating-ish if scrolled, but usually bottom of form) */}
        <button
          onClick={handleCalculate}
          className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl text-lg font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span>开始计算</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        </button>
      </main>

      {/* Results Overlay (Modal/BottomSheet style) */}
      {results.show && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
          {/* Backdrop */}
          <div 
             className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto transition-opacity"
             onClick={() => setResults({...results, show: false})}
          ></div>
          
          {/* Card */}
          <div className="w-full max-w-md pointer-events-auto max-h-[90vh] overflow-y-auto no-scrollbar rounded-t-3xl">
            <ResultCard 
              commercial={results.commercial}
              provident={results.provident}
              totalAmount={
                 (results.commercial?.principal || 0) + (results.provident?.principal || 0)
              }
              years={inputs.years}
              method={inputs.repaymentMethod}
              onReset={handleReset}
            />
          </div>
        </div>
      )}

      {/* Footer Ad Placeholder */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white border-t border-gray-100">
         <AdBanner size="small" />
      </div>

    </div>
  );
}

export default App;