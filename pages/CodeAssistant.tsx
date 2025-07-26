import React, { useState, useCallback } from 'react';
import CodeInput from '../components/CodeInput';
import OutputDisplay from '../components/OutputDisplay';
import ActionSelector from '../components/ActionSelector';
import * as geminiService from '../services/geminiService';
import { SparklesIcon } from '../components/icons';

export type ActionType = 'review' | 'explain' | 'test' | 'refactor';

const CodeAssistant: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [action, setAction] = useState<ActionType>('review');
  const [output, setOutput] = useState<string>('');
  const [solution, setSolution] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSolutionLoading, setIsSolutionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [solutionError, setSolutionError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<ActionType | null>(null);

  const actionMap = {
    review: { service: geminiService.runCodeReview, buttonText: 'Review Code' },
    explain: { service: geminiService.runCodeExplanation, buttonText: 'Explain Code' },
    test: { service: geminiService.runTestGeneration, buttonText: 'Generate Tests' },
    refactor: { service: geminiService.runCodeRefactor, buttonText: 'Refactor Code' },
  };

  const handleExecuteAction = useCallback(async () => {
    if (!code.trim()) {
      setError('Please enter some code to analyze.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput('');
    setSolution('');
    setSolutionError(null);
    setLastAction(action);

    try {
      const result = await actionMap[action].service(code);
      setOutput(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to execute action: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [code, action]);
  
  const handleGenerateSolution = useCallback(async () => {
    if (!code || !output) return;

    setIsSolutionLoading(true);
    setSolutionError(null);
    setSolution('');

    try {
      const result = await geminiService.generateSolution(code, output);
      setSolution(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setSolutionError(`Failed to generate solution: ${errorMessage}`);
    } finally {
      setIsSolutionLoading(false);
    }
  }, [code, output]);


  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="flex flex-col space-y-4">
          <ActionSelector selectedAction={action} setAction={setAction} isLoading={isLoading} />
          <CodeInput code={code} setCode={setCode} isLoading={isLoading || isSolutionLoading} />
          <button
            onClick={handleExecuteAction}
            disabled={isLoading || !code || isSolutionLoading}
            className="flex items-center justify-center w-full px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isLoading ? (
              'Analyzing...'
            ) : (
              <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                {actionMap[action].buttonText}
              </>
            )}
          </button>
        </div>
        
        <OutputDisplay
          output={output}
          isLoading={isLoading}
          error={error}
          lastAction={lastAction}
          onGenerateSolution={handleGenerateSolution}
          isSolutionLoading={isSolutionLoading}
          solution={solution}
          solutionError={solutionError}
        />
      </div>
    </div>
  );
};

export default CodeAssistant;
