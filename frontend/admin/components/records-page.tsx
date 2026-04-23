"use client"

import { useState } from "react"
import { Search, Download, Calendar } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ExamRecord {
  id: number
  username: string
  userId: string
  examDate: string
  examType: string
  result: string
}

const RECORDS: ExamRecord[] = [
  { id: 1,  username: "김민준", userId: "U001", examDate: "2024-07-21", examType: "피부 종양 검사", result: "기저세포암 의심"    },
  { id: 2,  username: "이서연", userId: "U002", examDate: "2024-07-20", examType: "흑색종 검사",    result: "정상 소견"          },
  { id: 3,  username: "박지호", userId: "U003", examDate: "2024-07-19", examType: "피부 종양 검사", result: "편평세포암 가능성"   },
  { id: 4,  username: "최수빈", userId: "U004", examDate: "2024-07-18", examType: "반복 검사",      result: "치료 후 호전"        },
  { id: 5,  username: "정현우", userId: "U005", examDate: "2024-07-17", examType: "피부 종양 검사", result: "양성 종양"           },
  { id: 6,  username: "한소희", userId: "U006", examDate: "2024-07-17", examType: "흑색종 검사",    result: "정상 소견"           },
  { id: 7,  username: "오준혁", userId: "U007", examDate: "2024-07-16", examType: "피부 종양 검사", result: "기저세포암 의심"     },
  { id: 8,  username: "윤아름", userId: "U008", examDate: "2024-07-15", examType: "반복 검사",      result: "경과 관찰 필요"      },
  { id: 9,  username: "임채원", userId: "U009", examDate: "2024-07-14", examType: "피부 종양 검사", result: "정상 소견"           },
  { id: 10, username: "강태양", userId: "U010", examDate: "2024-07-13", examType: "흑색종 검사",    result: "흑색종 의심"         },
  { id: 11, username: "백하은", userId: "U011", examDate: "2024-07-12", examType: "피부 종양 검사", result: "양성 종양"           },
  { id: 12, username: "신동현", userId: "U012", examDate: "2024-07-11", examType: "반복 검사",      result: "치료 후 호전"        },
  { id: 13, username: "조미래", userId: "U013", examDate: "2024-07-10", examType: "피부 종양 검사", result: "편평세포암 가능성"   },
  { id: 14, username: "문지우", userId: "U014", examDate: "2024-07-09", examType: "흑색종 검사",    result: "정상 소견"           },
  { id: 15, username: "류세진", userId: "U015", examDate: "2024-07-08", examType: "피부 종양 검사", result: "기저세포암 의심"     },
  { id: 16, username: "김민준", userId: "U001", examDate: "2024-07-07", examType: "반복 검사",      result: "치료 반응 양호"      },
  { id: 17, username: "이서연", userId: "U002", examDate: "2024-07-05", examType: "피부 종양 검사", result: "정상 소견"           },
  { id: 18, username: "박지호", userId: "U003", examDate: "2024-07-03", examType: "흑색종 검사",    result: "경과 관찰 필요"      },
]

const EXAM_TYPES = ["전체", "피부 종양 검사", "흑색종 검사", "반복 검사"]

export function RecordsPage() {
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("전체")

  const filtered = RECORDS.filter((r) => {
    const matchSearch =
      r.username.includes(search) || r.userId.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === "전체" || r.examType === typeFilter
    return matchSearch && matchType
  })

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="사용자명 또는 사용자ID 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-white"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44 h-9 text-sm bg-white">
            <SelectValue placeholder="검사 종류" />
          </SelectTrigger>
          <SelectContent>
            {EXAM_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="h-9 px-3 text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1.5" />
          날짜 선택
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 px-4 ml-auto">
          <Download className="h-4 w-4 mr-1.5" />
          내보내기
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-800">검사 기록 목록</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-16 px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">사용자명</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">사용자ID</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">검사일자</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">검사 종류</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">결과</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((record) => (
              <TableRow key={record.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <TableCell className="px-5 py-4 text-sm font-medium text-gray-700">{record.id}</TableCell>
                <TableCell className="px-5 py-4 text-sm font-medium text-gray-800">{record.username}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-blue-600 font-medium">{record.userId}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600">{record.examDate}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700">{record.examType}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700">{record.result}</TableCell>
                <TableCell className="px-5 py-4 text-sm">
                  <span className="flex gap-3">
                    <button className="text-blue-500 hover:text-blue-600 font-medium">상세보기</button>
                    <button className="text-blue-500 hover:text-blue-600 font-medium">다운로드</button>
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-gray-400">
            검색 결과가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}
