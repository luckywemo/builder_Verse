'use client';

import { useState } from 'react';

export default function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeSentiment = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputs: text }),
      });
      
      const result = await response.json();
      const sentimentScore = result[0][0].score;
      setSentiment(sentimentScore > 0.5 ? 'Positive' : 'Negative');
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      setSentiment('Error analyzing text');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Sentiment Analysis</h2>
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter text to analyze"
          rows={4}
        />
        <button
          onClick={analyzeSentiment}
          disabled={loading || !text}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Sentiment'}
        </button>
        {sentiment && (
          <p className="text-lg">
            Sentiment: <span className={sentiment === 'Positive' ? 'text-green-600' : 'text-red-600'}>{sentiment}</span>
          </p>
        )}
      </div>
    </div>
  );
} 