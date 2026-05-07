"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Clock,
  Activity,
  AlertTriangle,
  Server,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Performance trend data - Realistic medical AI metrics
const performanceData = [
  { month: "1월", 정확도: 92.3, 정밀도: 89.7, 재현율: 91.2, F1점수: 90.4 },
  { month: "2월", 정확도: 93.5, 정밀도: 90.8, 재현율: 92.6, F1점수: 91.7 },
  { month: "3월", 정확도: 94.8, 정밀도: 92.1, 재현율: 94.3, F1점수: 93.2 },
  { month: "4월", 정확도: 96.1, 정밀도: 93.7, 재현율: 95.8, F1점수: 94.7 },
];

// Disease accuracy data - Simple structure for BarChart
const diseaseAccuracyData = [
  { name: "기저세포암", value: 96.5 },
  { name: "편평세포암", value: 94.2 },
  { name: "흑색종", value: 91.8 },
  { name: "양성 종양", value: 88.2 },
  { name: "광선 각화증", value: 89.7 },
  { name: "지루성 각화증", value: 85.9 },
];

// Mini chart data for summary cards
const miniChartData = [
  { time: "00:00", value: 120 },
  { time: "04:00", value: 98 },
  { time: "08:00", value: 145 },
  { time: "12:00", value: 167 },
  { time: "16:00", value: 134 },
  { time: "20:00", value: 112 },
];

const summaryCards = [
  {
    title: "평균 응답시간",
    value: "2.3초",
    change: "+0.2초",
    trend: "up",
    icon: Clock,
    color: "blue",
    unit: "ms",
  },
  {
    title: "일일 요청량",
    value: "15,234",
    change: "+12%",
    trend: "up",
    icon: Activity,
    color: "green",
    unit: "건",
  },
  {
    title: "오류율",
    value: "0.8%",
    change: "-0.3%",
    trend: "down",
    icon: AlertTriangle,
    color: "red",
    unit: "%",
  },
  {
    title: "가동 시간",
    value: "99.9%",
    change: "안정",
    trend: "stable",
    icon: Server,
    color: "purple",
    unit: "%",
  },
];

const modelInfo = [
  { label: "모델 버전", value: "EfficientNet-B4 v2.1" },
  { label: "마지막 학습일", value: "2024-07-15" },
  { label: "학습 데이터셋", value: "ISIC 2024 (15,234 이미지)" },
  { label: "모델 아키텍처", value: "EfficientNet-B4" },
  { label: "입력 크기", value: "380x380 RGB" },
  { label: "분류 클래스", value: "7개 질환 클래스" },
];

export function AIMonitoringPage() {
  return (
    <div className="space-y-3">
      {/* Summary Cards - Optimized Layout */}
      <div className="grid grid-cols-4 gap-3">
        {summaryCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} className="shadow-md border-gray-100 rounded-xl">
              <CardContent className="p-2">
                <div className="flex items-center">
                  <div className={`p-1.5 rounded-lg bg-${card.color}-50 mr-2`}>
                    <Icon className={`w-5 h-5 text-${card.color}-500`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-0.5">{card.title}</p>
                    <p className="text-lg font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className="flex items-center text-xs">
                    {card.trend === "up" && (
                      <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                    )}
                    {card.trend === "down" && (
                      <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        card.trend === "up"
                          ? "text-green-500 font-semibold"
                          : card.trend === "down"
                          ? "text-red-500 font-semibold"
                          : "text-gray-500 font-semibold"
                      }
                    >
                      {card.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Section - Two Charts */}
      <div className="grid grid-cols-2 gap-4">
        {/* Model Performance Trend */}
        <Card className="shadow-md border-gray-100 rounded-xl">
          <CardContent className="p-3">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              모델 성능 추이
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" domain={[85, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                  labelStyle={{ color: "#374151", fontWeight: 600 }}
                  formatter={(value, name) => [
                    `${value}%`,
                    name === "정확도" ? "정확도" :
                    name === "정밀도" ? "정밀도" :
                    name === "재현율" ? "재현율" : "F1점수"
                  ]}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: "15px" }}
                  iconType="line"
                />
                <Line
                  type="monotone"
                  dataKey="정확도"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="정밀도"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="재현율"
                  stroke="#f59e0b"
                  strokeWidth={3}
                  dot={{ fill: "#f59e0b", r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="F1점수"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ fill: "#8b5cf6", r: 5 }}
                  activeDot={{ r: 7 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Disease Detection Accuracy */}
        <Card className="shadow-md border-gray-100 rounded-xl">
          <CardContent className="p-3">
            <h3 className="text-base font-semibold text-gray-900 mb-3">
              질환별 탐지 정확도
            </h3>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart 
                data={[
                  { disease: "기저세포암", 정확도: 96.5 },
                  { disease: "편평세포암", 정확도: 94.2 },
                  { disease: "흑색종", 정확도: 91.8 },
                  { disease: "양성 종양", 정확도: 88.2 },
                  { disease: "광선 각화증", 정확도: 89.7 },
                  { disease: "지루성 각화증", 정확도: 85.9 }
                ]}
                layout="vertical"
                margin={{ top: 20, right: 30, bottom: 20, left: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis 
                  dataKey="disease" 
                  type="category" 
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value) => [`${value}%`, '정확도']}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar 
                  dataKey="정확도" 
                  fill="#3b82f6"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  isAnimationActive={false}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Model Information - Reduced Spacing */}
      <Card className="shadow-md border-gray-100 rounded-xl">
        <CardContent className="p-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            모델 정보
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {modelInfo.map((info, index) => (
              <div key={index} className="flex justify-between items-center p-1.5 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600 font-medium">{info.label}</span>
                <span className="text-sm font-semibold text-gray-900">
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
