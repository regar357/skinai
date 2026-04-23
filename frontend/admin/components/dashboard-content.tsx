import { Users, UserCheck, BarChart3, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts"

const stats = [
  {
    label: "총 사용자",
    value: "1,234",
    icon: <Users className="h-5 w-5" />,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-500",
  },
  {
    label: "활성 사용자",
    value: "892",
    icon: <UserCheck className="h-5 w-5" />,
    iconBg: "bg-green-50",
    iconColor: "text-green-500",
  },
  {
    label: "총 분석 건수",
    value: "5,678",
    icon: <BarChart3 className="h-5 w-5" />,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    label: "오늘 분석",
    value: "45",
    icon: <Calendar className="h-5 w-5" />,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
]

const diagnosisData = [
  { month: "1월", value: 120, percentage: 60 },
  { month: "2월", value: 150, percentage: 75 },
  { month: "3월", value: 180, percentage: 90 },
  { month: "4월", value: 200, percentage: 100 },
]

const diseaseData = [
  { name: "기저세포암", value: 45, percentage: 28 },
  { name: "편평세포암", value: 32, percentage: 20 },
  { name: "흑색종", value: 28, percentage: 18 },
  { name: "양성 종양", value: 65, percentage: 34 },
]

const userTrendData = [
  { month: "1월", active: 45, new: 50 },
  { month: "2월", active: 60, new: 65 },
  { month: "3월", active: 65, new: 70 },
  { month: "4월", active: 50, new: 55 },
]

export function DashboardContent() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-gray-200 bg-white">
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-base font-semibold text-gray-700">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${stat.iconBg}`}
              >
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-start">
        {/* 진단 건수 - Area Chart */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              진단 건수
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={diagnosisData}>
                <defs>
                  <linearGradient id="colorDiagnosis" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value) => [`${value}건`, '진단 건수']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fill="url(#colorDiagnosis)"
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 질환별 분포 - Donut Chart */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <CardTitle className="text-base font-semibold text-gray-900">
              질환별 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={diseaseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {diseaseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(${142 + index * 15}, 70%, ${45 + index * 5}%)`} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`${value}건`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {diseaseData.map((item, index) => (
                <div key={item.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <div 
                      className="w-2 h-2 rounded-full flex-shrink-0" 
                      style={{ backgroundColor: `hsl(${142 + index * 15}, 70%, ${45 + index * 5}%)` }}
                    />
                    <span className="text-gray-600 truncate">{item.name}</span>
                  </div>
                  <span className="font-medium text-gray-700 ml-1">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 사용자 추이 - Grouped Bar Chart */}
        <Card className="border-gray-200 bg-white">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                사용자 추이
              </CardTitle>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  <span className="text-gray-600">활성</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-gray-600">신규</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={userTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  formatter={(value, name) => [
                    `${value}명`, 
                    name === 'active' ? '활성 사용자' : '신규 사용자'
                  ]}
                />
                <Bar dataKey="active" fill="#3b82f6" radius={[2, 2, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="new" fill="#4ade80" radius={[2, 2, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
