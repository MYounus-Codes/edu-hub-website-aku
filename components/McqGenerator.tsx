import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import { GoogleGenAI } from "@google/genai";
import { 
  Brain, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  RefreshCcw, 
  Send,
  BookOpen,
  Award,
  Sparkles,
  Download,
  FileText
} from 'lucide-react';

interface MCQ {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

interface McqGeneratorProps {
  user: User | null;
}

const McqGenerator: React.FC<McqGeneratorProps> = ({ user }) => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);
  const [userAnswers, setUserAnswers] = useState<{[key: number]: string}>({});
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl text-center max-w-lg w-full border border-slate-100">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Brain className="w-10 h-10 text-univet-blue" />
          </div>
          <h2 className="text-3xl font-serif font-black text-slate-800 mb-4">Login Required</h2>
          <p className="text-slate-500 font-medium mb-8">
            Access to AI-generated exams requires a personal account to ensuring academic integrity.
          </p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/')} 
              className="text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
              Go Home
            </button>
            <button 
              className="bg-univet-blue text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
              onClick={() => {
                alert("Please click the 'Login' button in the top right corner.");
              }}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const generateMCQs = async () => {
    if (!topic.trim()) {
        setError('Please enter a topic');
        return;
    }
    if (count > 50) {
        setError('Maximum 50 MCQs allowed at once');
        return;
    }
    
    setLoading(true);
    setError('');
    setMcqs([]);
    setUserAnswers({});
    setShowResults(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Generate ${count} multiple choice questions about "${topic}" appropriate for Grade 9 or 10 curriculum. 
      Return strictly a JSON array of objects.
      Each object must have: 
      - "question" (string)
      - "options" (array of 4 strings)
      - "correctAnswer" (string, must match one of the options exactly)
      - "explanation" (string, brief explanation of why the answer is correct)
      
      Do not include markdown formatting (like \`\`\`json). Just the raw JSON string.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      const text = response.text || '';
      // Clean up potential markdown code blocks if the model adds them despite instructions
      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      
      try {
        const parsedMCQs = JSON.parse(cleanText);
        if (Array.isArray(parsedMCQs) && parsedMCQs.length > 0) {
            setMcqs(parsedMCQs);
        } else {
            throw new Error('Invalid format received');
        }
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError, cleanText);
        setError('Failed to parse the generated MCQs. Please try again with a different topic wording.');
      }

    } catch (err: any) {
      console.error("Generation Error:", err);
      setError('Failed to generate MCQs. Please check your connection or try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (showResults) return;
    setUserAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }));
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((mcq, index) => {
      if (userAnswers[index] === mcq.correctAnswer) {
        score++;
      }
    });
    return score;
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #mcq-content, #mcq-content * {
            visibility: visible;
          }
          #mcq-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
          .print-only-header {
            display: block !important;
            margin-bottom: 20px;
            text-align: center;
          }
        }
        .print-only-header {
          display: none;
        }
      `}</style>
      
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 no-print">
          <div>
            <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4" />
              <span>AI Study Tool</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-black text-slate-800">
              Exam Generator
            </h1>
            <p className="text-slate-500 font-medium mt-2">
              Create custom practice tests instantly with UNIVET Neural.
            </p>
          </div>

          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-6 min-w-[200px]">
             <div className="flex-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Generated</div>
                <div className="text-xs text-slate-500 font-bold">{mcqs.length > 0 ? `${mcqs.length} Questions` : 'Ready'}</div>
             </div>
             <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-univet-blue" />
             </div>
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 md:p-8 mb-8 border border-white no-print">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
            <div className="flex-1 w-full space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Study Topic</label>
              <input 
                type="text" 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Biology Chapter 4, Linear Algebra..."
                className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:outline-none focus:bg-white transition-all text-slate-700 font-bold placeholder:text-slate-400"
                disabled={loading}
              />
            </div>
            <div className="w-full md:w-32 space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Count</label>
              <input 
                type="number" 
                value={count}
                onChange={(e) => setCount(Math.min(50, Math.max(1, parseInt(e.target.value) || 0)))}
                min="1"
                max="50"
                className="w-full h-14 px-4 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 focus:outline-none focus:bg-white transition-all text-slate-700 font-bold text-center"
                disabled={loading}
              />
            </div>
            <button 
              onClick={generateMCQs}
              disabled={loading || !topic}
              className="h-14 w-full md:w-auto md:px-8 bg-univet-blue hover:bg-blue-800 text-white rounded-2xl flex items-center justify-center font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10 shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  <span>Working...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span>Generate</span>
                </>
              )}
            </button>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center border border-red-100">
              <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Quiz Content Container for Print */}
        <div id="mcq-content">
          
          {/* Print Only Header */}
          <div className="print-only-header mb-8 pb-4 border-b border-black">
             <h1 className="text-2xl font-bold mb-2">UNIVET Practice Quiz</h1>
             <p className="text-sm">Topic: {topic} | Questions: {mcqs.length}</p>
          </div>

          {/* Quiz Section */}
          {mcqs.length > 0 && (
            <div className="space-y-6 animate-reveal">
              
              {!showResults && (
                 <div className="flex items-center justify-between bg-blue-50 p-6 rounded-3xl border border-blue-100 no-print">
                   <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                      <span className="text-blue-800 font-bold uppercase tracking-wider text-sm">Session Active</span>
                   </div>
                   <span className="font-mono font-bold text-blue-700 bg-white px-4 py-2 rounded-xl">
                      {Object.keys(userAnswers).length} / {mcqs.length} Answered
                   </span>
                 </div>
              )}

              {showResults && (
                  <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100 text-center space-y-4 no-print">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                        <Award className="w-8 h-8 text-emerald-500" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-serif font-black text-emerald-800">Excellent Work!</h2>
                        <p className="text-emerald-700 font-medium mt-1">
                            You scored <span className="font-bold text-xl">{calculateScore()}</span> out of <span className="font-bold text-xl">{mcqs.length}</span>
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <button
                          onClick={handleDownloadPDF}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2"
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Report</span>
                        </button>
                        <button
                            onClick={() => {
                                setMcqs([]);
                                setTopic('');
                                setShowResults(false);
                                setUserAnswers({});
                            }}
                            className="flex items-center justify-center space-x-2 text-emerald-700 bg-emerald-100/50 hover:bg-emerald-100 font-bold px-6 py-3 rounded-xl transition-all"
                        >
                            <RefreshCcw className="w-5 h-5" />
                            <span>New Topic</span>
                        </button>
                      </div>
                  </div>
              )}

              <div className="space-y-4 bg-white sm:p-4 rounded-3xl">
                {mcqs.map((mcq, index) => {
                  const isSelected = (info: string) => userAnswers[index] === info;
                  const isCorrect = mcq.correctAnswer === mcq.options.find(o => o === userAnswers[index]);

                  return (
                    <div key={index} className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-100 print:shadow-none print:border-b print:border-slate-300 print:rounded-none">
                      <div className="flex items-start gap-4 mb-6">
                          <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-sm print:border print:border-slate-400">
                              {index + 1}
                          </span>
                          <h3 className="text-lg md:text-xl font-bold text-slate-800 leading-snug pt-0.5">
                              {mcq.question}
                          </h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-0 md:pl-12 print:block print:space-y-2">
                          {mcq.options.map((option, optIdx) => {
                              let optionClass = "border-slate-200 hover:border-slate-300 hover:bg-slate-50";
                              
                              if (showResults) {
                                  if (option === mcq.correctAnswer) {
                                      optionClass = "border-emerald-500 bg-emerald-50 text-emerald-900 print:bg-transparent print:border-black print:font-bold";
                                  } else if (isSelected(option) && option !== mcq.correctAnswer) {
                                      optionClass = "border-rose-500 bg-rose-50 text-rose-900 print:hidden"; // Hide wrong answers in print if you want a clean key, or keep them. Let's keep clarity.
                                  } else {
                                      optionClass = "border-slate-100 opacity-60 print:border-transparent";
                                  }
                              } else if (isSelected(option)) {
                                  optionClass = "border-univet-blue bg-blue-50 text-univet-blue ring-1 ring-univet-blue";
                              }

                              return (
                                  <button
                                      key={optIdx}
                                      onClick={() => handleOptionSelect(index, option)}
                                      disabled={showResults}
                                      className={`text-left w-full p-4 rounded-xl border-2 font-medium transition-all duration-200 relative overflow-hidden print:p-2 print:border ${optionClass}`}
                                  >
                                      <div className="flex items-center">
                                          <span className="w-6 h-6 rounded-full border border-current mr-3 flex items-center justify-center text-xs opacity-50">
                                            {String.fromCharCode(65 + optIdx)}
                                          </span>
                                          {option}
                                      </div>
                                      
                                      {/* Icons for UI only, hidden in print usually handled by visibility hidden * unless specifically shown */}
                                      <span className="no-print">
                                          {showResults && option === mcq.correctAnswer && (
                                              <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                                          )}
                                          {showResults && isSelected(option) && option !== mcq.correctAnswer && (
                                              <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-500" />
                                          )}
                                      </span>
                                  </button>
                              );
                          })}
                      </div>

                      {showResults && (
                          <div className="mt-6 ml-0 md:ml-12 p-5 bg-slate-50 rounded-2xl text-sm text-slate-600 border border-slate-200 print:bg-transparent print:border print:border-slate-300 print:mt-2">
                              <div className="flex items-center gap-2 mb-2">
                                <BookOpen className="w-4 h-4 text-blue-500 no-print" />
                                <span className="font-bold text-slate-800">Explanation:</span>
                              </div>
                              <p className="leading-relaxed">{mcq.explanation}</p>
                          </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {!showResults && (
                  <div className="flex justify-end pt-4 pb-12 no-print">
                      <button
                          onClick={() => setShowResults(true)}
                          disabled={Object.keys(userAnswers).length < mcqs.length}
                          className="h-14 px-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                          <span>Complete Quiz</span>
                          <ArrowRight className="w-5 h-5" />
                      </button>
                  </div>
              )}
            </div>
          )}

          {/* Empty State / Initial Instructions */}
          {mcqs.length === 0 && !loading && !error && (
            <div className="py-20 text-center bg-white rounded-[3rem] border border-dashed border-slate-200 animate-reveal no-print">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileText className="w-10 h-10 text-blue-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-700 mb-2">No active quiz</h3>
                <p className="text-slate-400 font-medium max-w-sm mx-auto px-4">
                    Enter a subject above to generate a unique set of practice questions tailored to your grade level.
                </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default McqGenerator;
