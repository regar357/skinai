"use client"

import { useState } from "react"
import { Search, Plus, Download, Calendar } from "lucide-react"
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

interface User {
  id: number
  username: string
  email: string
  status: "활성" | "정지"
  joinDate: string
  lastLogin: string
  analysisCount: number
}

const USERS: User[] = [
  { id: 1,  username: "김민준", email: "minjun.kim@example.com",   status: "활성", joinDate: "2024-01-15", lastLogin: "2024-07-21", analysisCount: 25 },
  { id: 2,  username: "이서연", email: "seoyeon.lee@example.com",  status: "정지", joinDate: "2024-02-20", lastLogin: "2024-07-18", analysisCount: 12 },
  { id: 3,  username: "박지호", email: "jiho.park@example.com",    status: "활성", joinDate: "2024-03-10", lastLogin: "2024-07-21", analysisCount: 8  },
  { id: 4,  username: "최수빈", email: "subin.choi@example.com",   status: "활성", joinDate: "2024-03-22", lastLogin: "2024-07-20", analysisCount: 34 },
  { id: 5,  username: "정현우", email: "hyunwoo.jung@example.com", status: "정지", joinDate: "2024-04-05", lastLogin: "2024-06-30", analysisCount: 6  },
  { id: 6,  username: "한소희", email: "sohee.han@example.com",    status: "활성", joinDate: "2024-04-18", lastLogin: "2024-07-19", analysisCount: 19 },
  { id: 7,  username: "오준혁", email: "junhyuk.oh@example.com",   status: "활성", joinDate: "2024-05-02", lastLogin: "2024-07-21", analysisCount: 42 },
  { id: 8,  username: "윤아름", email: "areum.yoon@example.com",   status: "정지", joinDate: "2024-05-14", lastLogin: "2024-07-05", analysisCount: 3  },
  { id: 9,  username: "임채원", email: "chaewon.lim@example.com",  status: "활성", joinDate: "2024-05-27", lastLogin: "2024-07-20", analysisCount: 15 },
  { id: 10, username: "강태양", email: "taeyang.kang@example.com", status: "활성", joinDate: "2024-06-08", lastLogin: "2024-07-21", analysisCount: 7  },
  { id: 11, username: "백하은", email: "haeun.baek@example.com",   status: "활성", joinDate: "2024-06-15", lastLogin: "2024-07-18", analysisCount: 22 },
  { id: 12, username: "신동현", email: "donghyun.shin@example.com",status: "정지", joinDate: "2024-06-20", lastLogin: "2024-07-10", analysisCount: 9  },
  { id: 13, username: "조미래", email: "mirae.jo@example.com",     status: "활성", joinDate: "2024-06-25", lastLogin: "2024-07-21", analysisCount: 31 },
  { id: 14, username: "문지우", email: "jiwoo.moon@example.com",   status: "활성", joinDate: "2024-07-01", lastLogin: "2024-07-20", analysisCount: 5  },
  { id: 15, username: "류세진", email: "sejin.ryu@example.com",    status: "활성", joinDate: "2024-07-08", lastLogin: "2024-07-21", analysisCount: 2  },
]

function StatusBadge({ status }: { status: "활성" | "정지" }) {
  if (status === "활성") {
    return (
      <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-700">
        활성
      </span>
    )
  }
  return (
    <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700">
      정지
    </span>
  )
}

export function UsersPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filtered = USERS.filter((u) => {
    const matchSearch =
      u.username.includes(search) || u.email.includes(search)
    const matchStatus =
      statusFilter === "all" || u.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm h-9 px-4">
          <Plus className="h-4 w-4 mr-1.5" />
          사용자 추가
        </Button>
        <Button variant="outline" className="text-sm h-9 px-4">
          <Download className="h-4 w-4 mr-1.5" />
          내보내기
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="사용자 검색..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm bg-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-36 h-9 text-sm bg-white">
            <SelectValue placeholder="전체 상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="활성">활성</SelectItem>
            <SelectItem value="정지">정지</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="h-9 px-3 text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-1.5" />
          날짜 선택
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50">
              <TableHead className="w-16 px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">ID</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">사용자명</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">이메일</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">상태</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">가입일</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">마지막 로그인</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">분석 횟수</TableHead>
              <TableHead className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((user) => (
              <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                <TableCell className="px-5 py-4 text-sm font-medium text-blue-600">{user.id}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-800 font-medium">{user.username}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600">{user.email}</TableCell>
                <TableCell className="px-5 py-4">
                  <StatusBadge status={user.status} />
                </TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600">{user.joinDate}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-600">{user.lastLogin}</TableCell>
                <TableCell className="px-5 py-4 text-sm text-gray-700">{user.analysisCount}</TableCell>
                <TableCell className="px-5 py-4 text-sm">
                  {user.status === "활성" ? (
                    <span className="flex gap-3">
                      <button className="text-orange-500 hover:text-orange-600 font-medium">정지</button>
                      <button className="text-red-500 hover:text-red-600 font-medium">삭제</button>
                    </span>
                  ) : (
                    <span className="flex gap-3">
                      <button className="text-blue-500 hover:text-blue-600 font-medium">해제</button>
                      <button className="text-red-500 hover:text-red-600 font-medium">삭제</button>
                    </span>
                  )}
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
