import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock } from 'lucide-react';
import Card from '../shared/Card';
import Button from '../shared/Button';

export default function FavoritePractices({ 
  favorites = [],
  practices = [],
  onStart,
  onToggleFavorite
}) {
  const favoritePractices = practices.filter(p => favorites.includes(p.id));

  if (favoritePractices.length === 0) {
    return (
      <Card className="text-center py-8">
        <Star className="w-10 h-10 text-[#999] mx-auto mb-3 opacity-50" />
        <p className="text-[#666666]">No favorite practices yet</p>
        <p className="text-sm text-[#999] mt-1">
          Star practices to add them to your favorites
        </p>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <AnimatePresence mode="popLayout">
        {favoritePractices.map((practice) => (
          <motion.div
            key={practice.id}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <Card hover className="flex flex-col h-full bg-gradient-to-br from-yellow-50 to-white">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-[#1A1A1A] flex-1">
                  {practice.name}
                </h3>
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 flex-shrink-0" />
              </div>

              <p className="text-xs text-[#999] flex items-center gap-1 mb-3">
                <Clock className="w-3 h-3" />
                {practice.duration} min
              </p>

              <p className="text-sm text-[#666666] mb-3 flex-1">
                {practice.description}
              </p>

              <Button
                onClick={() => onStart?.(practice)}
                variant="primary"
                size="sm"
                className="w-full"
              >
                Start Now
              </Button>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}