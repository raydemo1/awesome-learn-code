import React from 'react';
import { PixelCard } from '@/components/ui/PixelCard';
import { ArrowRight } from 'lucide-react';

interface VisualState {
  reversed: number[];
  remaining: number[];
  prev: number | null;
  curr: number | null;
  next: number | null;
}

interface VisualizerProps {
  currentState: VisualState;
}

export const Visualizer: React.FC<VisualizerProps> = ({ currentState }) => {
  if (!currentState) return null;

  return (
    <PixelCard variant="dark" className="h-full p-4 flex flex-col relative overflow-hidden">
      <h3 className="font-heading text-xs text-warning mb-6 flex items-center gap-2">
        <i className="ra ra-scroll-unfurled text-lg"></i>
        内存状态
      </h3>
      
      <div className="flex-1 flex flex-col justify-center items-center gap-12 overflow-y-auto">
        
        {/* Linked List Visualization */}
        <div className="flex items-center flex-wrap justify-center gap-2">
          {/* Reversed Part (if any) */}
          {currentState.reversed && currentState.reversed.map((node, idx) => (
            <React.Fragment key={`rev-${node}`}>
              <div className="w-12 h-12 border-3 border-accent bg-accent/20 flex items-center justify-center font-code text-xl font-bold shadow-pixel-sm text-accent">
                {node}
              </div>
              <ArrowRight className="text-accent w-6 h-6 stroke-[3px]" />
            </React.Fragment>
          ))}

          {/* Remaining Part */}
          {currentState.remaining && currentState.remaining.map((node, idx) => (
            <React.Fragment key={`rem-${node}`}>
              <div className="w-12 h-12 border-3 border-black bg-secondary flex items-center justify-center font-code text-xl font-bold shadow-pixel-sm">
                {node}
              </div>
              {idx < currentState.remaining.length - 1 && (
                <ArrowRight className="text-foreground w-6 h-6 stroke-[3px]" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Pointers */}
        <div className="flex justify-center gap-8 w-full flex-wrap">
          <div className="flex flex-col items-center">
            <span className="font-code text-xs text-muted-foreground mb-1">prev</span>
            <div className="w-16 h-8 border-2 border-dashed border-destructive/50 flex items-center justify-center font-code text-destructive text-sm">
              {currentState.prev === null ? 'null' : currentState.prev}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-code text-xs text-muted-foreground mb-1">curr</span>
            <div className="w-16 h-8 border-2 border-black bg-accent flex items-center justify-center font-code text-black text-sm font-bold shadow-pixel-sm">
              {currentState.curr === null ? 'null' : currentState.curr}
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="font-code text-xs text-muted-foreground mb-1">next</span>
            <div className="w-16 h-8 border-2 border-dashed border-blue-400/50 flex items-center justify-center font-code text-blue-400 text-sm">
              {currentState.next === null ? 'null' : currentState.next}
            </div>
          </div>
        </div>

      </div>
    </PixelCard>
  );
};
