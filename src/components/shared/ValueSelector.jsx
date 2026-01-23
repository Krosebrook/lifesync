import React from 'react';
import { Heart } from 'lucide-react';

export default function ValueSelector({ values, selectedIds = [], onChange, label = "Link to your values" }) {
  const handleToggle = (valueId) => {
    if (selectedIds.includes(valueId)) {
      onChange(selectedIds.filter(id => id !== valueId));
    } else {
      onChange([...selectedIds, valueId]);
    }
  };

  if (!values || values.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Heart className="w-4 h-4 text-[#FF6B35]" />
        <label className="text-sm font-medium text-white">{label}</label>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value.id}
            type="button"
            onClick={() => handleToggle(value.id)}
            className={`px-4 py-2 rounded-sm text-sm font-medium transition-all ${
              selectedIds.includes(value.id)
                ? 'bg-[#FF6B35] text-white border border-[#FF6B35]'
                : 'bg-transparent text-[#9A9A9A] border border-[rgba(255,255,255,0.2)] hover:border-[#FF6B35]/50'
            }`}
          >
            {value.icon && <span className="mr-2">{value.icon}</span>}
            {value.name}
          </button>
        ))}
      </div>
      {selectedIds.length === 0 && (
        <p className="text-xs text-[#666666] italic">
          Connect this to what matters most
        </p>
      )}
    </div>
  );
}