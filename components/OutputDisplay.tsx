import React from 'react';
import Loader from './Loader';
import { SparklesIcon, WandSparklesIcon } from './icons';
import { ActionType } from '../pages/CodeAssistant';
import CodeBlock from './common/CodeBlock';

interface OutputDisplayProps {
  output: string;
  isLoading: boolean;
  error: string | null;
  lastAction: ActionType | null;
  onGenerateSolution: () => void;
  isSolutionLoading: boolean;
  solution: string;
  solutionError: string | null;
}

const FormattedLine: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split(/(\*\*.*?\*\*)/g).filter(Boolean);
  return (
    <p>
      {parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={index} className="text-zinc-100 font-semibold">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </p>
  );
};

const OutputDisplay: React.FC<OutputDisplayProps> = (props) => {
  const { 
    output, isLoading, error, lastAction, 
    onGenerateSolution, isSolutionLoading, solution, solutionError 
  } = props;

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader />
          <p className="mt-4 text-zinc-400">Analyzing your code...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-4 rounded-lg">
            <h3 className="font-bold mb-2">An Error Occurred</h3>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      );
    }
    
    if (output) {
        const isCodeOutput = lastAction === 'test' || lastAction === 'refactor';
        return isCodeOutput 
            ? <CodeBlock code={output} />
            : <div className="space-y-4">{output.split('\n').filter(line => line.trim() !== '').map((line, index) => <FormattedLine key={index} text={line} />)}</div>;
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <SparklesIcon className="w-16 h-16 text-zinc-600 mb-4" />
        <h3 className="text-xl font-semibold text-zinc-400">Ready to Analyze</h3>
        <p className="text-zinc-500 mt-2">
          Choose an action, paste your code, and click the button to get started.
        </p>
      </div>
    );
  };

  const renderSolutionSection = () => {
    if (lastAction !== 'review' || !output || isLoading) return null;

    return (
      <div className="mt-6 pt-6 border-t border-zinc-700">
        {!solution && !isSolutionLoading && !solutionError && (
             <button
                onClick={onGenerateSolution}
                className="flex items-center justify-center w-full px-4 py-2 bg-zinc-700 text-white font-semibold rounded-lg shadow-md hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-800 focus:ring-emerald-500 transition-colors duration-200"
            >
                <WandSparklesIcon className="w-5 h-5 mr-2" />
                Generate Solution
            </button>
        )}

        {isSolutionLoading && (
            <div className="flex items-center justify-center flex-col">
                <Loader />
                <p className="mt-2 text-zinc-400 text-sm">Generating solution...</p>
            </div>
        )}

        {solutionError && (
             <div className="bg-red-900/20 border border-red-500/30 text-red-300 p-3 rounded-lg text-sm text-center">
                <p>{solutionError}</p>
            </div>
        )}

        {solution && (
            <div>
                 <h3 className="text-lg font-semibold text-zinc-200 mb-3">Suggested Solution</h3>
                 <CodeBlock code={solution} />
            </div>
        )}
      </div>
    );
  };

  const titles: Record<ActionType, string> = {
    review: 'Review Feedback',
    explain: 'Code Explanation',
    test: 'Generated Tests',
    refactor: 'Refactored Code'
  }

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg p-6 h-full flex flex-col">
      <h2 className="text-xl font-semibold text-zinc-200 mb-4 pb-2 border-b border-zinc-700 flex-shrink-0">
        {lastAction ? titles[lastAction] : 'Output'}
      </h2>
      <div className="prose prose-sm prose-invert max-w-none text-zinc-300 whitespace-pre-wrap flex-grow overflow-y-auto">
        {renderMainContent()}
      </div>
       {renderSolutionSection()}
    </div>
  );
};

export default OutputDisplay;
