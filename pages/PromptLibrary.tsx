import React, { useCallback, useState } from 'react';
import Loader from '../components/Loader';
import CodeBlock from '../components/common/CodeBlock';
import Modal from '../components/common/Modal';
import { InformationCircleIcon, SparklesIcon } from '../components/icons';
import * as geminiService from '../services/geminiService';

const PromptLibrary: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) {
      setError('Please describe the prompt you want to generate.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      const result = await geminiService.generatePrompt(description);
      setGeneratedPrompt(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to generate prompt: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [description]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-zinc-100">AI Prompt Generator</h1>
        <button onClick={() => setIsModalOpen(true)} className="text-zinc-400 hover:text-emerald-400" aria-label="Learn about good prompts">
          <InformationCircleIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label htmlFor="prompt-description" className="block text-sm font-medium text-zinc-300 mb-2">
            Describe the kind of prompt you want to create
          </label>
          <textarea
            id="prompt-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isLoading}
            placeholder="e.g., a prompt to create a weekly meal plan for a vegetarian"
            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
          />
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || !description.trim()}
          className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <SparklesIcon className="w-5 h-5 mr-2" />
          {isLoading ? 'Generating...' : 'Generate Prompt'}
        </button>
        
        {/* Output Section */}
        <div className="mt-8">
            <h2 className="text-lg font-semibold text-zinc-300 mb-3">Generated Prompt</h2>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg min-h-[150px] p-2 flex items-center justify-center w-full">
                 {isLoading && <Loader />}
        
                {!isLoading && error && (
                    <div className="text-red-400 text-center text-sm p-4">
                        <p>{error}</p>
                    </div>
                )}

                {!isLoading && !error && !generatedPrompt && (
                    <p className="text-zinc-500 text-center p-4">Your generated prompt will appear here.</p>
                )}

                {!isLoading && generatedPrompt && (
                    <div className="w-full">
                        <CodeBlock code={generatedPrompt} />
                    </div>
                )}
            </div>
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="How to Write a Good Prompt">
        <div className="text-zinc-300 space-y-4">
            <p>A well-crafted prompt is key to getting the best results from an AI. Here are some tips:</p>
            <div>
                <h4 className="font-semibold text-emerald-400">Be Specific and Detailed</h4>
                <p className="text-sm text-zinc-400">Provide as much context as possible. Instead of "write a story," try "write a short horror story about a lighthouse keeper who discovers a secret."</p>
            </div>
            <div>
                <h4 className="font-semibold text-emerald-400">Define the Persona</h4>
                <p className="text-sm text-zinc-400">Tell the AI who to be. For example, "Act as an expert copywriter..." or "You are a friendly and encouraging fitness coach..."</p>
            </div>
            <div>
                <h4 className="font-semibold text-emerald-400">Set the Format</h4>
                <p className="text-sm text-zinc-400">Specify how you want the output. Ask for a list, a JSON object, a table, or a code snippet in a particular language.</p>
            </div>
             <div>
                <h4 className="font-semibold text-emerald-400">Provide Examples</h4>
                <p className="text-sm text-zinc-400">For complex tasks, give a "one-shot" or "few-shot" example. Show the AI exactly what a good response looks like.</p>
            </div>
            <div>
                <h4 className="font-semibold text-emerald-400">Iterate and Refine</h4>
                <p className="text-sm text-zinc-400">Your first prompt might not be perfect. Don't be afraid to tweak your prompt and try again to get closer to your desired output.</p>
            </div>
        </div>
      </Modal>
    </div>
  );
};

export default PromptLibrary;