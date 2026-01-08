import React from 'react';
import { motion } from 'framer-motion';
import { Play, FileText, ExternalLink } from 'lucide-react';
import Card from '../shared/Card';

const resources = [
  {
    type: 'video',
    title: 'Mindful Productivity: Align Your Day with Your Values',
    url: 'https://www.youtube.com/watch?v=abc123',
    thumbnail: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=80'
  },
  {
    type: 'video',
    title: 'The Power of Habit: Building Routines That Stick',
    url: 'https://www.youtube.com/watch?v=def456',
    thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80'
  },
  {
    type: 'article',
    title: '5 Strategies for Intentional Living',
    url: 'https://www.example.com/article/intentional-living',
    thumbnail: 'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?w=400&q=80'
  }
];

export default function ResourcesSection() {
  return (
    <Card>
      <h3 className="font-semibold text-[#1A1A1A] mb-4">Inspiration & Resources</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {resources.map((resource, index) => (
          <motion.a
            key={index}
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group block"
          >
            <div className="relative h-32 rounded-[12px] overflow-hidden mb-3">
              <img 
                src={resource.thumbnail} 
                alt={resource.title}
                className="w-full h-full object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                  {resource.type === 'video' ? (
                    <Play className="w-5 h-5 text-[#1A1A1A] ml-1" />
                  ) : (
                    <ExternalLink className="w-5 h-5 text-[#1A1A1A]" />
                  )}
                </div>
              </div>
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  resource.type === 'video' 
                    ? 'bg-red-500 text-white' 
                    : 'bg-blue-500 text-white'
                }`}>
                  {resource.type === 'video' ? (
                    <span className="flex items-center gap-1">
                      <Play className="w-3 h-3" /> Video
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <FileText className="w-3 h-3" /> Article
                    </span>
                  )}
                </span>
              </div>
            </div>
            <h4 className="text-sm font-medium text-[#1A1A1A] line-clamp-2 group-hover:text-[#1ABC9C] transition-colors">
              {resource.title}
            </h4>
          </motion.a>
        ))}
      </div>
    </Card>
  );
}