import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface SpriteAnimatorProps {
  src: string;
  frameWidth: number;
  frameHeight: number;
  frameCount: number;
  fps?: number;
  scale?: number;
  flipX?: boolean;
  className?: string;
  isHit?: boolean;
}

export const SpriteAnimator: React.FC<SpriteAnimatorProps> = ({
  src,
  frameWidth,
  frameHeight,
  frameCount,
  fps = 8,
  scale = 1,
  flipX = false,
  className = '',
  isHit = false,
}) => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frameCount);
    }, 1000 / fps);
    
    return () => clearInterval(interval);
  }, [frameCount, fps]);

  return (
    <div 
      className={cn(
        "relative overflow-hidden", 
        className,
        isHit ? "animate-shake" : "" // 受击时的抖动特效
      )}
      style={{
        width: frameWidth * scale,
        height: frameHeight * scale,
        transform: flipX ? 'scaleX(-1)' : 'none',
      }}
    >
      {/* 
        由于是 Sprite Sheet（多帧合并在一起的图片），
        我们需要将其作为背景，通过调整 marginLeft/left 来显示不同的帧。
      */}
      <img
        src={src}
        alt="sprite"
        style={{
          position: 'absolute',
          left: -(frame * frameWidth * scale),
          top: 0,
          width: frameWidth * frameCount * scale,
          height: frameHeight * scale,
          imageRendering: 'pixelated', // 保证像素放大不模糊
          maxWidth: 'none',
          // 如果被击中，叠加一个白/红的滤镜效果
          filter: isHit ? 'brightness(2) sepia(1) hue-rotate(-50deg) saturate(5)' : 'none',
          transition: 'filter 0.1s',
        }}
      />
    </div>
  );
};
