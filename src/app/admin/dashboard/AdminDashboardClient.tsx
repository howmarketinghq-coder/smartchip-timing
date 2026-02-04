"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Edit, Trash2, Plus, FileSpreadsheet, Download } from "lucide-react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useToast } from "@/components/ui/Toast";
import { formatDate } from "@/lib/utils";
import * as XLSX from "xlsx";

interface Event {
  id: string;
  name: string;
  date: Date | string;
  courses: string[];
  status: string;
  recordCount: number;
}

interface AdminDashboardClientProps {
  events: Event[];
}

type TabType = "events" | "upload" | "posters" | "templates";

export default function AdminDashboardClient({ events: initialEvents }: AdminDashboardClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<TabType>("events");
  const [events, setEvents] = useState(initialEvents);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState("");
  const [uploadPreview, setUploadPreview] = useState<Record<string, string | number>[] | null>(null);

  // New event form
  const [newEventName, setNewEventName] = useState("");
  const [newEventDate, setNewEventDate] = useState("");
  const [newEventCourses, setNewEventCourses] = useState("");

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  const handleAddEvent = async () => {
    if (!newEventName || !newEventDate) {
      showToast("대회명과 개최일을 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEventName,
          date: newEventDate,
          courses: newEventCourses.split(",").map((c) => c.trim()).filter(Boolean),
          status: "upcoming",
        }),
      });

      if (res.ok) {
        const newEvent = await res.json();
        setEvents([{ ...newEvent, recordCount: 0 }, ...events]);
        setShowAddModal(false);
        setNewEventName("");
        setNewEventDate("");
        setNewEventCourses("");
        showToast("대회가 추가되었습니다.");
        router.refresh();
      }
    } catch {
      showToast("대회 추가 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm("이 대회를 삭제하시겠습니까?")) return;

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setEvents(events.filter((e) => e.id !== eventId));
        showToast("대회가 삭제되었습니다.");
      }
    } catch {
      showToast("대회 삭제 중 오류가 발생했습니다.");
    }
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!selectedEventId) {
      showToast("먼저 대회를 선택해주세요.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        if (jsonData.length === 0) {
          showToast("데이터가 비어있습니다.");
          return;
        }

        setUploadPreview(jsonData as Record<string, string | number>[]);
        showToast(`${jsonData.length}건의 데이터를 읽었습니다.`);
      } catch {
        showToast("파일 파싱 중 오류가 발생했습니다.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleConfirmUpload = async () => {
    if (!uploadPreview || !selectedEventId) return;

    try {
      const records = uploadPreview.map((row) => ({
        bib: String(row["배번호"] || row["bib"] || ""),
        name: String(row["이름"] || row["name"] || ""),
        course: String(row["코스"] || row["course"] || ""),
        gender: String(row["성별"] || row["gender"] || "M"),
        finishTime: String(row["완주시간"] || row["finishTime"] || "00:00:00"),
        speed: parseFloat(String(row["스피드"] || row["speed"] || "0")) || 0,
        pace: String(row["페이스"] || row["pace"] || "00:00"),
        splits: [],
      }));

      const res = await fetch(`/api/records/${selectedEventId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records }),
      });

      if (res.ok) {
        showToast(`${records.length}건의 기록이 업로드되었습니다.`);
        setUploadPreview(null);
        router.refresh();
      } else {
        throw new Error("Upload failed");
      }
    } catch {
      showToast("업로드 중 오류가 발생했습니다.");
    }
  };

  const downloadSampleExcel = () => {
    const sampleData = [
      ["배번호", "이름", "코스", "성별", "완주시간", "스피드", "페이스"],
      ["10001", "홍길동", "10Km", "M", "00:45:30", "13.19", "04:33"],
      ["10002", "김철수", "10Km", "M", "00:52:10", "11.50", "05:13"],
      ["20001", "이영희", "5Km", "F", "00:28:45", "10.43", "05:45"],
    ];

    const ws = XLSX.utils.aoa_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "기록데이터");
    XLSX.writeFile(wb, "스마트칩_기록양식.xlsx");
  };

  const tabs: { id: TabType; label: string }[] = [
    { id: "events", label: "대회 관리" },
    { id: "upload", label: "기록 업로드" },
    { id: "posters", label: "포스터 관리" },
    { id: "templates", label: "기록증 템플릿" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(10,10,10,0.95)] backdrop-blur-[10px] border-b border-border">
        <div className="max-w-[800px] mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-9 h-[18px]" viewBox="0 0 40 20" fill="none">
              <path
                d="M5 15C5 15 10 2 20 10C30 18 35 5 35 5"
                stroke="#E30613"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col">
              <span className="font-[family-name:var(--font-oswald)] text-[8px] text-accent-red tracking-[1px]">
                No1 Timing System
              </span>
              <span className="font-[family-name:var(--font-bebas-neue)] text-xl tracking-[2px] leading-none">
                SMART CHIP
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">관리자</span>
            <button
              onClick={handleLogout}
              className="text-xs text-accent-red cursor-pointer bg-transparent border-none"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="pt-20 pb-10 px-4 max-w-[800px] mx-auto">
        <h1 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-[2px] mb-1">
          ADMIN DASHBOARD
        </h1>
        <p className="text-text-muted text-sm mb-6">대회 및 기록 데이터를 관리합니다</p>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-bg-secondary rounded-lg p-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap text-center transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? "bg-accent-red text-white"
                  : "bg-transparent text-text-secondary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Events Panel */}
        {activeTab === "events" && (
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-5 pb-3 border-b border-border">대회 관리</h3>

            <Button onClick={() => setShowAddModal(true)} className="mb-5 flex items-center gap-2">
              <Plus size={16} />새 대회 추가
            </Button>

            <ul className="space-y-0">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="flex justify-between items-center py-3 border-b border-border last:border-b-0"
                >
                  <div>
                    <p className="text-sm font-medium">{event.name}</p>
                    <p className="text-xs text-text-muted">
                      {formatDate(event.date)} | {event.courses.join(", ")} | 참가자{" "}
                      {event.recordCount}명
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 rounded-lg text-xs bg-blue-500 text-white cursor-pointer">
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="px-3 py-1.5 rounded-lg text-xs bg-red-500 text-white cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {events.length === 0 && (
                <li className="py-5 text-center text-text-muted">등록된 대회가 없습니다.</li>
              )}
            </ul>
          </div>
        )}

        {/* Upload Panel */}
        {activeTab === "upload" && (
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-5 pb-3 border-b border-border">기록 데이터 업로드</h3>

            <div className="mb-4">
              <label className="block text-sm text-text-secondary mb-1.5">대회 선택</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="w-full px-3.5 py-3 bg-bg-card border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-red"
              >
                <option value="">대회를 선택하세요</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    ({formatDate(event.date)}) {event.name}
                  </option>
                ))}
              </select>
            </div>

            <label className="block border-2 border-dashed border-border-light rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-accent-red hover:bg-[rgba(227,6,19,0.05)]">
              <FileSpreadsheet size={36} className="mx-auto mb-3 text-text-muted" />
              <p className="text-sm text-text-secondary">엑셀 파일을 클릭하여 업로드하세요</p>
              <p className="text-xs text-text-muted mt-2">.xlsx, .xls 파일 지원</p>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                className="hidden"
                onChange={handleExcelUpload}
              />
            </label>

            <div className="mt-4 p-4 bg-bg-card rounded-lg border border-border">
              <p className="text-sm font-semibold text-accent-red mb-2">📋 엑셀 양식 안내</p>
              <p className="text-xs text-text-secondary leading-relaxed">
                엑셀 파일의 열 순서는 다음과 같아야 합니다:
                <br />
                <strong>배번호 | 이름 | 코스 | 성별(M/F) | 완주시간 | 스피드 | 페이스</strong>
                <br />
                <span className="text-text-muted">* 첫 번째 행은 헤더(제목)로 인식됩니다.</span>
              </p>
              <Button
                onClick={downloadSampleExcel}
                variant="secondary"
                size="sm"
                className="mt-3 flex items-center gap-2"
              >
                <Download size={14} />
                양식 다운로드
              </Button>
            </div>

            {uploadPreview && (
              <div className="mt-6">
                <h4 className="text-sm font-semibold mb-2">업로드 데이터 미리보기</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-bg-card">
                        <th className="px-2 py-2 text-left border-b-2 border-border-light">배번호</th>
                        <th className="px-2 py-2 text-left border-b-2 border-border-light">이름</th>
                        <th className="px-2 py-2 text-left border-b-2 border-border-light">코스</th>
                        <th className="px-2 py-2 text-left border-b-2 border-border-light">성별</th>
                        <th className="px-2 py-2 text-left border-b-2 border-border-light">완주시간</th>
                      </tr>
                    </thead>
                    <tbody>
                      {uploadPreview.slice(0, 10).map((row, i) => (
                        <tr key={i} className="hover:bg-bg-card">
                          <td className="px-2 py-2 border-b border-border">{row["배번호"] || row["bib"]}</td>
                          <td className="px-2 py-2 border-b border-border">{row["이름"] || row["name"]}</td>
                          <td className="px-2 py-2 border-b border-border">{row["코스"] || row["course"]}</td>
                          <td className="px-2 py-2 border-b border-border">{row["성별"] || row["gender"]}</td>
                          <td className="px-2 py-2 border-b border-border">{row["완주시간"] || row["finishTime"]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {uploadPreview.length > 10 && (
                    <p className="text-center text-text-muted text-xs py-2">
                      ... 외 {uploadPreview.length - 10}건
                    </p>
                  )}
                </div>
                <div className="flex gap-3 mt-4">
                  <Button onClick={handleConfirmUpload}>업로드 확인</Button>
                  <Button variant="secondary" onClick={() => setUploadPreview(null)}>
                    취소
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Posters Panel */}
        {activeTab === "posters" && (
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-5 pb-3 border-b border-border">포스터 관리</h3>
            <p className="text-sm text-text-secondary">
              메인 페이지의 히어로 슬라이더와 Next Event 슬라이더에 표시될 포스터를 관리합니다.
            </p>
            <p className="text-text-muted text-xs mt-4">포스터 업로드 기능은 추후 구현 예정입니다.</p>
          </div>
        )}

        {/* Templates Panel */}
        {activeTab === "templates" && (
          <div className="bg-bg-secondary rounded-xl p-6 border border-border">
            <h3 className="text-lg font-semibold mb-5 pb-3 border-b border-border">기록증 템플릿 관리</h3>
            <p className="text-sm text-text-secondary">
              대회별 기록증 및 포토기록증 배경 이미지를 관리합니다.
            </p>
            <p className="text-text-muted text-xs mt-4">템플릿 관리 기능은 추후 구현 예정입니다.</p>
          </div>
        )}
      </main>

      {/* Add Event Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <h3 className="text-lg font-semibold mb-5">새 대회 추가</h3>
        <div className="mb-4">
          <Input
            label="대회명"
            value={newEventName}
            onChange={(e) => setNewEventName(e.target.value)}
            placeholder="예: 제32회 경주벚꽃마라톤대회"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm text-text-secondary mb-1.5">개최일</label>
          <input
            type="date"
            value={newEventDate}
            onChange={(e) => setNewEventDate(e.target.value)}
            className="w-full px-3.5 py-3 bg-bg-card border border-border rounded-lg text-text-primary text-sm focus:outline-none focus:border-accent-red"
          />
        </div>
        <div className="mb-6">
          <Input
            label="코스 (쉼표로 구분)"
            value={newEventCourses}
            onChange={(e) => setNewEventCourses(e.target.value)}
            placeholder="예: 5Km, 10Km, 하프, 풀코스"
          />
        </div>
        <Button onClick={handleAddEvent} className="w-full flex items-center justify-center gap-2">
          <Plus size={16} />
          대회 추가
        </Button>
      </Modal>
    </>
  );
}
