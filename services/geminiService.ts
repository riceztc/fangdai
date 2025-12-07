import { GoogleGenAI } from "@google/genai";
import { CalculationResult, RepaymentMethod } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getAiAdvice = async (
  results: {
    commercial?: CalculationResult;
    provident?: CalculationResult;
  },
  totalAmount: number,
  years: number,
  method: RepaymentMethod
): Promise<string> => {
  const totalMonthly = (results.commercial?.monthlyPayment || 0) + (results.provident?.monthlyPayment || 0);
  const totalInterest = (results.commercial?.totalInterest || 0) + (results.provident?.totalInterest || 0);
  
  const prompt = `
    我是一名购房者，正在使用房贷计算器。请根据以下数据为我提供一段简短、专业的财务建议（150字以内）。
    
    数据：
    - 贷款总额：${(totalAmount / 10000).toFixed(2)}万
    - 贷款年限：${years}年
    - 还款方式：${method}
    - 首月还款：${totalMonthly.toFixed(2)}元
    - 总利息支出：${(totalInterest / 10000).toFixed(2)}万
    
    请分析还款压力，并给出一条关于理财或提前还款的建议。语气要亲切、客观。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } 
      }
    });
    return response.text || "暂时无法获取建议，请稍后再试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 建议服务暂时不可用，请检查网络连接。";
  }
};