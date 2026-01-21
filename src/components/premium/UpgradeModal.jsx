import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, TrendingUp, Target, Zap } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

const features = {
  premium: [
    { icon: TrendingUp, text: 'Advanced trend analysis & insights' },
    { icon: Sparkles, text: 'Exclusive meditation library (50+ practices)' },
    { icon: Target, text: 'Premium coaching reports (monthly/quarterly)' },
    { icon: Zap, text: 'Priority AI suggestions & personalized plans' },
    { icon: Crown, text: 'Advanced gamification challenges' },
    { icon: Check, text: 'Ad-free experience' }
  ]
};

export default function UpgradeModal({ onClose, feature }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#1A1A1A] mb-2">
              Unlock Premium
            </h2>
            <p className="text-[#666666]">
              {feature || 'Take your personal growth to the next level'}
            </p>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <Card className="border-2 border-[#E5D9CC]">
              <div className="text-center">
                <p className="text-sm text-[#999] mb-2">Monthly</p>
                <p className="text-4xl font-bold text-[#1A1A1A] mb-1">
                  $9<span className="text-lg text-[#666]">/mo</span>
                </p>
                <p className="text-xs text-[#999]">Billed monthly</p>
              </div>
            </Card>
            <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-white relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full">
                  SAVE 40%
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm text-[#999] mb-2">Yearly</p>
                <p className="text-4xl font-bold text-[#1A1A1A] mb-1">
                  $5<span className="text-lg text-[#666]">/mo</span>
                </p>
                <p className="text-xs text-[#999]">$60 billed annually</p>
              </div>
            </Card>
          </div>

          {/* Features */}
          <div className="mb-6">
            <h3 className="font-semibold text-[#1A1A1A] mb-4">Premium Features:</h3>
            <div className="space-y-3">
              {features.premium.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-sm text-[#666666] mt-1">{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="space-y-3">
            <Button 
              onClick={() => {
                alert('Subscription integration would go here (Stripe, etc.)');
              }}
              variant="primary" 
              className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
            <button
              onClick={onClose}
              className="w-full text-sm text-[#666666] hover:text-[#1A1A1A] py-2"
            >
              Maybe later
            </button>
          </div>

          <p className="text-xs text-center text-[#999] mt-4">
            Cancel anytime. 7-day money-back guarantee.
          </p>
        </Card>
      </motion.div>
    </motion.div>
  );
}