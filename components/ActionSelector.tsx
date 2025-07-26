import React from 'react';
import { ActionType } from '../pages/CodeAssistant';
import { SparklesIcon, DocumentTextIcon, BeakerIcon, WandSparklesIcon } from './icons';

interface ActionSelectorProps {
    selectedAction: ActionType;
    setAction: (action: ActionType) => void;
    isLoading: boolean;
}

const actions: { id: ActionType; name: string; icon: React.ElementType }[] = [
    { id: 'review', name: 'Review', icon: SparklesIcon },
    { id: 'explain', name: 'Explain', icon: DocumentTextIcon },
    { id: 'test', name: 'Generate Tests', icon: BeakerIcon },
    { id: 'refactor', name: 'Refactor', icon: WandSparklesIcon },
];

const ActionSelector: React.FC<ActionSelectorProps> = ({ selectedAction, setAction, isLoading }) => {
    return (
        <div>
            <label className="mb-2 text-sm font-medium text-zinc-400 block">Select Action</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {actions.map(({ id, name, icon: Icon }) => (
                    <button
                        key={id}
                        onClick={() => setAction(id)}
                        disabled={isLoading}
                        className={`flex items-center justify-center text-sm font-semibold p-3 rounded-lg border-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                            ${selectedAction === id
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-zinc-700/50 border-zinc-700 hover:border-zinc-500 text-zinc-300'
                            }`}
                        aria-pressed={selectedAction === id}
                    >
                        <Icon className="w-5 h-5 mr-2" />
                        {name}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ActionSelector;
