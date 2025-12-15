import React from 'react';
import { Check, X, Sparkles, Building2, GraduationCap } from 'lucide-react';
import { User } from '../types';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentUser: User;
    onUpgrade: (plan: 'free' | 'pro' | 'enterprise') => void;
}

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, currentUser, onUpgrade }) => {
    if (!isOpen) return null;

    const plans = [
        {
            id: 'free',
            name: 'Free Tier',
            price: '$0',
            period: '/month',
            description: 'Test drive the future of lesson planning.',
            icon: GraduationCap,
            features: [
                '1 Active Document',
                '50 AI Queries / mo',
                'Basic Output Formats',
                'Standard AI Model (Flash)',
                'Community Support'
            ],
            cta: 'Current Plan',
            disabled: currentUser.plan === 'free',
            highlight: false
        },
        {
            id: 'pro',
            name: 'Educator Pro',
            price: '$19.99',
            period: '/month',
            description: 'Reclaim 10+ hours per week.',
            icon: Sparkles,
            features: [
                '20 Active Documents',
                '500 AI Queries / mo',
                'Advanced Formats (Tables, PDF)',
                'Priority AI Processing',
                'Differentiation Wizard',
                'Email Support (24hr)'
            ],
            cta: currentUser.plan === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
            disabled: currentUser.plan === 'pro',
            highlight: true
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: '$499',
            period: '/mo (starts at)',
            description: 'Scale without limits.',
            icon: Building2,
            features: [
                'Unlimited Documents',
                'Unlimited AI Queries',
                'Team Management',
                'Shared Content Library',
                'Custom Branding & Domain',
                'Dedicated Account Manager'
            ],
            cta: currentUser.plan === 'enterprise' ? 'Current Plan' : 'Contact Sales',
            disabled: currentUser.plan === 'enterprise',
            highlight: false
        }
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Choose your learning power</h2>
                    <p className="text-slate-500 max-w-2xl mx-auto">
                        Unlock advanced AI models, unlimited documents, and specialized pedagogical tools designed to save you time.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 pt-0">
                    {plans.map((plan) => {
                        const Icon = plan.icon;
                        return (
                            <div 
                                key={plan.id}
                                className={`relative rounded-2xl p-6 border-2 transition-all duration-300 ${
                                    plan.highlight 
                                    ? 'border-indigo-600 bg-indigo-50/30 shadow-xl scale-105 z-10' 
                                    : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                {plan.highlight && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`p-3 rounded-xl ${plan.highlight ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-900">{plan.name}</h3>
                                        <p className="text-xs text-slate-500">{plan.description}</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                                    <span className="text-slate-500">{plan.period}</span>
                                </div>

                                <button
                                    onClick={() => onUpgrade(plan.id as any)}
                                    disabled={plan.disabled}
                                    className={`w-full py-3 rounded-xl font-bold mb-8 transition-all ${
                                        plan.disabled
                                            ? 'bg-slate-100 text-slate-400 cursor-default'
                                            : plan.highlight
                                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-indigo-200'
                                                : 'bg-slate-900 text-white hover:bg-slate-800'
                                    }`}
                                >
                                    {plan.cta}
                                </button>

                                <div className="space-y-4">
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <div className={`mt-0.5 p-0.5 rounded-full ${plan.highlight ? 'bg-indigo-100 text-indigo-600' : 'bg-green-100 text-green-600'}`}>
                                                <Check size={12} strokeWidth={3} />
                                            </div>
                                            <span className="text-sm text-slate-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};