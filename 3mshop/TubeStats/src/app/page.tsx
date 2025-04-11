"use client";

import { useState, useEffect } from "react";
import { extractVideoId, getVideoStats, VideoStats } from "@/services/youtube";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThumbsUp, MessageSquare, Play } from "lucide-react";
import { analyzeComments } from "@/ai/flows/analyze-comments-flow";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoStats, setVideoStats] = useState<VideoStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commentSentiment, setCommentSentiment] = useState<string | null>(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState<
    { positive: number; negative: number; neutral: number } | null
  >(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const fetchVideoStats = async () => {
    setIsLoading(true);
    setError(null);
    setVideoStats(null);
    setCommentSentiment(null);
    setSentimentAnalysis(null);

    try {
      const videoId = extractVideoId(videoUrl);
      if (!videoId) {
        throw new Error("유효하지 않은 YouTube URL입니다.");
      }

      const stats = await getVideoStats(videoId);
      setVideoStats(stats);

      // Dummy comments for testing sentiment analysis
      const dummyComments = [
        "정말 멋진 영상이네요!",
        "이 영상은 별로인 것 같아요.",
        "도움이 많이 됐습니다. 감사합니다!",
        "지루해요...",
        "최고의 영상!",
      ];

      const sentimentAnalysisResult = await analyzeComments({ comments: dummyComments });
      setCommentSentiment(sentimentAnalysisResult.sentimentSummary);

      // Mock sentiment analysis (replace with actual AI analysis)
      const positiveComments = dummyComments.filter(comment => comment.includes("멋진") || comment.includes("최고"));
      const negativeComments = dummyComments.filter(comment => comment.includes("별로") || comment.includes("지루"));
      const neutralComments = dummyComments.filter(comment => !comment.includes("멋진") && !comment.includes("최고") && !comment.includes("별로") && !comment.includes("지루"));

      setSentimentAnalysis({
        positive: positiveComments.length,
        negative: negativeComments.length,
        neutral: neutralComments.length,
      });

    } catch (e: any) {
      setError(e.message || "비디오 통계 정보를 가져오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = sentimentAnalysis
    ? [
      { name: "긍정", value: sentimentAnalysis.positive },
      { name: "부정", value: sentimentAnalysis.negative },
      { name: "중립", value: sentimentAnalysis.neutral },
    ]
    : [];

  return (
    <div className="container mx-auto p-4 grid gap-4 max-w-3xl">
      <div className="flex flex-col gap-2">
        <Input
          type="url"
          placeholder="YouTube 비디오 링크를 붙여넣으세요"
          value={videoUrl}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <Button onClick={fetchVideoStats} disabled={isLoading}>
          {isLoading ? "불러오는 중..." : "통계 정보 가져오기"}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </div>

      {videoStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp className="h-4 w-4" /> 좋아요
              </CardTitle>
            </CardHeader>
            <CardContent>{videoStats.likes.toLocaleString()}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" /> 댓글
              </CardTitle>
            </CardHeader>
            <CardContent>{videoStats.comments.toLocaleString()}</CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-4 w-4" /> 조회수
              </CardTitle>
            </CardHeader>
            <CardContent>{videoStats.views.toLocaleString()}</CardContent>
          </Card>
        </div>
      )}

      {commentSentiment && (
        <div className="flex flex-col gap-2">
          <Card>
            <CardHeader>
              <CardTitle>댓글 분위기 분석 요약</CardTitle>
            </CardHeader>
            <CardContent>
              {commentSentiment}
            </CardContent>
          </Card>
        </div>
      )}

      {sentimentAnalysis && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <line x1="12" y1="20" x2="12" y2="10" />
                <line x1="18" y1="20" x2="18" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
              댓글 분위기 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
