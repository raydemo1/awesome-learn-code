import React, { useState, useRef } from 'react';
import { PixelCard } from './PixelCard';
import { PixelButton } from './PixelButton';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (text: string) => void;
  isLoading: boolean;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [text, setText] = useState('');
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'OCR 失败');
      }

      const data = await response.json();
      if (data.text) {
        setText((prev) => (prev ? prev + '\n\n' + data.text : data.text));
      }
    } catch (error: any) {
      console.error('OCR Error:', error);
      alert('图片识别失败: ' + error.message);
    } finally {
      setIsOcrLoading(false);
      // 重置 input，允许重复上传同一张图片
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <PixelCard className="w-full max-w-2xl p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-white"
        >
          <i className="ra ra-cancel text-2xl"></i>
        </button>

        <h2 className="font-heading text-warning text-xl mb-2 flex items-center gap-3">
          <i className="ra ra-book"></i>
          新的挑战
        </h2>
        <p className="font-body text-muted-foreground mb-4 text-lg">
          你可以将题目描述粘贴在这里，或者直接上传题目截图，我们将使用 AI 识别并为你召唤怪兽！
        </p>

        <div className="flex gap-4 mb-4">
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <PixelButton 
            variant="default" 
            onClick={() => fileInputRef.current?.click()}
            disabled={isOcrLoading || isLoading}
            className="flex items-center gap-2"
          >
            {isOcrLoading ? (
              <span className="flex items-center gap-2 animate-pulse text-accent">
                <i className="ra ra-crystal-ball"></i> 识别中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <i className="ra ra-eye"></i> 上传题目截图 (OCR)
              </span>
            )}
          </PixelButton>
        </div>

        <textarea
          className="w-full h-56 bg-secondary border-3 border-black shadow-pixel-sm p-4 font-code text-foreground focus:outline-none focus:border-accent resize-none mb-6"
          placeholder="例如：给定一个整数数组 nums 和一个整数目标值 target，请你在该数组中找出和为目标值 target 的那两个整数，并返回它们的数组下标..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end gap-4">
          <PixelButton variant="default" onClick={onClose} disabled={isLoading || isOcrLoading}>
            取消
          </PixelButton>
          <PixelButton 
            variant="accent" 
            onClick={() => onSubmit(text)} 
            disabled={!text.trim() || isLoading || isOcrLoading}
            className="w-48"
          >
            {isLoading ? (
              <span className="flex items-center gap-2 animate-pulse">
                <i className="ra ra-crystal-ball"></i> 召唤中...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <i className="ra ra-lightning-sword"></i> 召唤怪兽
              </span>
            )}
          </PixelButton>
        </div>
      </PixelCard>
    </div>
  );
};
