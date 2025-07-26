import React, { useState, useCallback } from 'react';
import * as geminiService from '../services/geminiService';
import Loader from '../components/Loader';
import { PhotoIcon, SparklesIcon } from '../components/icons';

type AspectRatio = "1:1" | "16:9" | "9:16" | "4:3" | "3:4";

const aspectRatios: AspectRatio[] = ["1:1", "16:9", "9:16", "4:3", "3:4"];

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);

    const handleGenerate = useCallback(async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt to generate an image.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImage(null);

        try {
            const images = await geminiService.runImageGeneration(prompt, aspectRatio);
            if (images && images.length > 0) {
                setGeneratedImage(`data:image/jpeg;base64,${images[0]}`);
            } else {
                throw new Error("The API did not return any images.");
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to generate image: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [prompt, aspectRatio]);
    
    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `${prompt.slice(0, 30).replace(/\s/g, '_') || 'generated_image'}.jpeg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopy = () => {
        if (!generatedImage) return;
        navigator.clipboard.writeText(generatedImage).then(() => {
            alert('Image Data URL copied to clipboard!');
        }, (err) => {
            console.error('Could not copy text: ', err);
            alert('Failed to copy.');
        });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <label htmlFor="prompt-input" className="block text-sm font-medium text-zinc-400 mb-2">Enter your prompt</label>
                        <textarea
                            id="prompt-input"
                            rows={4}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            disabled={isLoading}
                            placeholder="A futuristic cityscape at sunset, with flying cars and neon lights..."
                            className="w-full p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-400 mb-2">Aspect Ratio</label>
                        <div className="grid grid-cols-3 gap-2">
                            {aspectRatios.map(ratio => (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    disabled={isLoading}
                                    className={`py-2 px-3 rounded-md text-sm font-semibold border-2 transition-colors ${aspectRatio === ratio ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-zinc-700/50 border-zinc-700 hover:border-zinc-500 text-zinc-300'}`}
                                >
                                    {ratio}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading || !prompt.trim()}
                        className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-emerald-500 disabled:bg-zinc-600 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        {isLoading ? 'Generating...' : 'Generate Image'}
                    </button>
                     {error && <p className="text-red-400 text-center text-sm">{error}</p>}
                </div>

                <div className="bg-zinc-800/50 border border-zinc-700 rounded-lg flex items-center justify-center min-h-[300px] md:min-h-full p-4">
                    {isLoading && <Loader />}
                    {!isLoading && !generatedImage && (
                        <div className="text-center text-zinc-500">
                            <PhotoIcon className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm">Your generated image will appear here.</p>
                        </div>
                    )}
                    {generatedImage && (
                        <div className="space-y-4">
                            <img src={generatedImage} alt={prompt} className="max-w-full max-h-[400px] rounded-md object-contain" />
                            <div className="flex gap-2 justify-center">
                                <button onClick={handleDownload} className="px-4 py-2 text-sm bg-zinc-600 hover:bg-zinc-500 rounded-md">Download</button>
                                <button onClick={handleCopy} className="px-4 py-2 text-sm bg-zinc-600 hover:bg-zinc-500 rounded-md">Copy URL</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGenerator;
