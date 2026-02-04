"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Phone } from "lucide-react";
import PaceChart from "@/components/record/PaceChart";
import RankingModal from "@/components/record/RankingModal";
import CertificateModal from "@/components/record/CertificateModal";
import PhotoCertificateModal from "@/components/record/PhotoCertificateModal";
import { timeToSeconds } from "@/lib/utils";
import type { Event, Record, Ranking } from "@/types";

interface RecordResultClientProps {
  event: Event;
  record: Record;
  allRecords: Record[];
}

export default function RecordResultClient({
  event,
  record,
  allRecords,
}: RecordResultClientProps) {
  const [showRanking, setShowRanking] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [showPhotoCert, setShowPhotoCert] = useState(false);

  // Calculate ranking
  const ranking: Ranking = useMemo(() => {
    const courseRecords = allRecords
      .filter((r) => r.course === record.course)
      .sort((a, b) => timeToSeconds(a.finishTime) - timeToSeconds(b.finishTime));

    const genderRecords = courseRecords
      .filter((r) => r.gender === record.gender)
      .sort((a, b) => timeToSeconds(a.finishTime) - timeToSeconds(b.finishTime));

    const overallRank = courseRecords.findIndex((r) => r.bib === record.bib) + 1;
    const genderRank = genderRecords.findIndex((r) => r.bib === record.bib) + 1;

    const top3 = genderRecords.slice(0, 3).map((r, i) => ({
      rank: i + 1,
      bib: r.bib,
      name: r.name,
      time: r.finishTime,
    }));

    return {
      overallRank,
      genderRank,
      totalCourse: courseRecords.length,
      totalGender: genderRecords.length,
      myRecord: record.finishTime,
      top3,
      genderLabel: record.gender === "M" ? "Man" : "Woman",
    };
  }, [allRecords, record]);

  return (
    <>
      {/* Event Title */}
      <h2 className="text-xl font-bold text-center mb-6 text-accent-green">
        {event.name}
      </h2>

      {/* SmartChip Logo */}
      <div className="text-center mb-4">
        <svg width="120" height="30" viewBox="0 0 120 30" fill="none">
          <path
            d="M10 22C10 22 20 4 40 15C60 26 70 8 70 8"
            stroke="#E30613"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <text x="75" y="10" fill="#999" fontSize="7" fontFamily="Oswald">
            No1 Timing System
          </text>
          <text
            x="75"
            y="24"
            fill="#fff"
            fontSize="12"
            fontFamily="'Bebas Neue'"
            letterSpacing="1"
          >
            SMART CHIP
          </text>
        </svg>
      </div>

      {/* Name, Course, Bib */}
      <div className="text-center mb-6">
        <p className="text-base mb-2">
          <span className="font-bold text-lg">{record.name}</span>
          <span className="text-text-secondary"> {record.course}</span>
          <span className="text-text-muted text-sm"> BIB {record.bib}</span>
        </p>
      </div>

      {/* Finish Time */}
      <div className="font-[family-name:var(--font-bebas-neue)] text-7xl text-center my-4 text-accent-green tracking-[3px] drop-shadow-[0_0_30px_rgba(0,230,118,0.2)]">
        {record.finishTime}
      </div>

      {/* Speed, Pace */}
      <div className="text-center mb-8">
        <span className="block text-sm text-text-secondary mb-1">
          Speed <strong className="text-text-primary">{record.speed.toFixed(2)}</strong> km/h
        </span>
        <span className="block text-sm text-text-secondary">
          Pace <strong className="text-text-primary">{record.pace}</strong> min/km
        </span>
      </div>

      {/* Split Table */}
      <table className="w-full border-collapse mb-8 text-sm">
        <thead className="bg-bg-card">
          <tr>
            <th className="px-2 py-2.5 font-semibold text-xs uppercase text-text-secondary border-b-2 border-border-light">
              POINT
            </th>
            <th className="px-2 py-2.5 font-semibold text-xs uppercase text-text-secondary border-b-2 border-border-light">
              TIME
            </th>
            <th className="px-2 py-2.5 font-semibold text-xs uppercase text-text-secondary border-b-2 border-border-light">
              PASS TIME
            </th>
            <th className="px-2 py-2.5 font-semibold text-xs uppercase text-text-secondary border-b-2 border-border-light">
              PACE<small>(min/km)</small>
            </th>
          </tr>
        </thead>
        <tbody>
          {record.splits.map((split, index) => (
            <tr key={index}>
              <td className="px-2 py-2.5 text-center border-b border-border">
                <strong>{split.point}</strong>
              </td>
              <td className="px-2 py-2.5 text-center border-b border-border">
                {split.time}
              </td>
              <td className="px-2 py-2.5 text-center border-b border-border">
                {split.passTime}
              </td>
              <td className="px-2 py-2.5 text-center border-b border-border">
                {split.pace}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pace Chart */}
      <div className="bg-bg-secondary rounded-xl p-5 mb-8 border border-border">
        <PaceChart splits={record.splits} />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <button
          onClick={() => setShowRanking(true)}
          className="px-4 py-3 border border-border-light rounded-lg bg-transparent text-text-primary text-sm font-medium cursor-pointer transition-colors hover:bg-bg-card hover:border-text-secondary"
        >
          순위 조회
        </button>
        <button
          onClick={() => setShowCertificate(true)}
          className="px-4 py-3 border border-border-light rounded-lg bg-transparent text-text-primary text-sm font-medium cursor-pointer transition-colors hover:bg-bg-card hover:border-text-secondary"
        >
          기록증
        </button>
        <button
          onClick={() => setShowPhotoCert(true)}
          className="px-4 py-3 border border-border-light rounded-lg bg-transparent text-text-primary text-sm font-medium cursor-pointer transition-colors hover:bg-bg-card hover:border-text-secondary"
        >
          포토 기록증
        </button>
      </div>

      <Link
        href={`/record/${event.id}`}
        className="block w-full px-4 py-3 border border-border-light rounded-lg bg-transparent text-text-secondary text-sm cursor-pointer text-center transition-colors hover:bg-bg-card"
      >
        다른 기록 조회
      </Link>

      {/* Error Link */}
      <a href="#" className="block text-center mt-5 text-accent-red text-sm">
        <Phone size={14} className="inline mr-1" />
        기록오류 문의 바로가기
      </a>

      {/* Modals */}
      <RankingModal
        isOpen={showRanking}
        onClose={() => setShowRanking(false)}
        event={event}
        record={record}
        ranking={ranking}
      />

      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        event={event}
        record={record}
      />

      <PhotoCertificateModal
        isOpen={showPhotoCert}
        onClose={() => setShowPhotoCert(false)}
        event={event}
        record={record}
      />
    </>
  );
}
