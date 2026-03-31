'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('image/')) {
      setError('请上传图片文件');
      return;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('图片大小不能超过 10MB');
      return;
    }
    setFile(selectedFile);
    setResult(null);
    setError(null);
    processImage(selectedFile);
  };

  const processImage = async (imageFile: File) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/remove-bg', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || '处理失败');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);
    } catch (err) {
      setError((err as Error).message || '处理失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const download = () => {
    if (result) {
      const a = document.createElement('a');
      a.href = result;
      a.download = `removed-bg-${file?.name.replace(/\.[^.]+$/, '')}.png`;
      a.click();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent mb-4">
            AI 抠图工具
          </h1>
          <p className="text-slate-400 text-lg">一键去除图片背景</p>
        </div>

        {/* Upload Area */}
        {!file && !loading && !result && (
          <div
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-green-400 bg-green-400/10'
                : 'border-cyan-400/30 hover:border-cyan-400 bg-white/5'
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <div className="text-6xl mb-4">📁</div>
            <p className="text-xl mb-2">点击或拖拽图片到这里</p>
            <p className="text-slate-500">支持 JPG、PNG，最大 10MB</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-xl text-cyan-400">AI 正在抠图中...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-xl p-6 mb-6 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="text-center">
            <div className="flex justify-center gap-8 flex-wrap mb-8">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-slate-400 mb-4">原图</p>
                {file && (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Original"
                    className="max-w-xs max-h-64 rounded-lg"
                  />
                )}
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-slate-400 mb-4">抠图结果</p>
                <img
                  src={result}
                  alt="Result"
                  className="max-w-xs max-h-64 rounded-lg"
                />
              </div>
            </div>
            <div className="flex gap-4 justify-center">
              <button
                onClick={download}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full font-semibold hover:scale-105 transition-transform"
              >
                下载结果
              </button>
              <button
                onClick={reset}
                className="px-8 py-3 bg-white/10 rounded-full font-semibold hover:bg-white/20 transition-colors"
              >
                再处理一张
              </button>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-16 bg-green-500/10 border border-green-500/30 rounded-xl p-6">
          <h3 className="text-green-400 font-semibold mb-4">使用提示</h3>
          <ul className="text-slate-400 space-y-2">
            <li>• 建议使用人物、商品、动物等有明显主体的图片</li>
            <li>• 图片越大处理越慢，请耐心等待</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
