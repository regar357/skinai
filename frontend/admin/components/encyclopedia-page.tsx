"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Search } from "lucide-react"

interface EncyclopediaEntry {
  id: number
  title: string
  category: string
  description: string
  modifiedDate: string
}

const encyclopediaData: EncyclopediaEntry[] = [
  {
    id: 1,
    title: "기저세포암",
    category: "피부암",
    description: "가장 흔한 유형의 피부암으로, 일반적으로 서서히 성장합니다. 주로 얼굴, 목, 손 등 노출된 부위에 발생합니다.",
    modifiedDate: "2024-07-20",
  },
  {
    id: 2,
    title: "편평세포암",
    category: "피부암",
    description: "두 번째로 흔한 피부암 유형입니다. 궤양 형태로 발생하며 전이 가능성이 있습니다.",
    modifiedDate: "2024-07-19",
  },
  {
    id: 3,
    title: "흑색종",
    category: "피부암",
    description: "가장 위험한 피부암 유형으로, 빠르게 전이될 수 있습니다. 조기 발견이 매우 중요합니다.",
    modifiedDate: "2024-07-18",
  },
]

export function EncyclopediaPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredData = encyclopediaData.filter(
    (entry) =>
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <Button className="bg-blue-500 hover:bg-blue-600">
          <Plus className="mr-2 h-4 w-4" />
          새 백과사전 항목 추가
        </Button>
        
        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Encyclopedia Table */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b">
                <TableHead className="w-16 font-medium text-gray-700">ID</TableHead>
                <TableHead className="w-48 font-medium text-gray-700">제목</TableHead>
                <TableHead className="w-32 font-medium text-gray-700">카테고리</TableHead>
                <TableHead className="font-medium text-gray-700">설명</TableHead>
                <TableHead className="w-32 font-medium text-gray-700">수정일</TableHead>
                <TableHead className="w-32 text-right font-medium text-gray-700">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((entry) => (
                <TableRow key={entry.id} className="hover:bg-gray-50 border-b">
                  <TableCell className="py-4 text-gray-900">{entry.id}</TableCell>
                  <TableCell className="py-4 font-medium text-blue-600">{entry.title}</TableCell>
                  <TableCell className="py-4 text-gray-600">{entry.category}</TableCell>
                  <TableCell className="py-4 text-gray-600">
                    <div className="max-w-xs truncate" title={entry.description}>
                      {entry.description}
                    </div>
                  </TableCell>
                  <TableCell className="py-4 text-gray-600">{entry.modifiedDate}</TableCell>
                  <TableCell className="py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="text-sm text-blue-500 hover:text-blue-700 font-medium">수정</button>
                      <button className="text-sm text-red-500 hover:text-red-700 font-medium">삭제</button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredData.length === 0 && (
            <div className="py-8 text-center text-gray-500">검색 결과가 없습니다.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
