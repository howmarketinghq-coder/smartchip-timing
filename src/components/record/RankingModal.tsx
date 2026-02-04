"use client";

import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import type { Event, Record, Ranking } from "@/types";

interface RankingModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  record: Record;
  ranking: Ranking;
}

export default function RankingModal({
  isOpen,
  onClose,
  event,
  record,
  ranking,
}: RankingModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="text-center">
        <h2 className="text-xl font-bold text-accent-green mb-4">{event.name}</h2>
        <h2 className="font-[family-name:var(--font-bebas-neue)] text-[42px] tracking-[3px] mb-8">
          MY RANKING
        </h2>

        {/* My Ranking Box */}
        <div className="bg-bg-secondary rounded-xl p-6 mb-8 border border-border">
          <div className="text-base font-semibold my-2.5">
            <span className="text-text-secondary">{record.course} Rank : </span>
            <span className="text-accent-green font-[family-name:var(--font-bebas-neue)] text-3xl ml-2">
              {ranking.overallRank}
            </span>
          </div>
          <div className="text-base font-semibold my-2.5">
            <span className="text-text-secondary">
              {record.course} {ranking.genderLabel} Rank :{" "}
            </span>
            <span className="text-accent-green font-[family-name:var(--font-bebas-neue)] text-3xl ml-2">
              {ranking.genderRank}
            </span>
          </div>
          <div className="text-base font-semibold my-2.5">
            <span className="text-text-secondary">My Record : </span>
            <span className="text-accent-green font-[family-name:var(--font-bebas-neue)] text-2xl">
              {ranking.myRecord}
            </span>
          </div>
        </div>

        <p className="text-xs text-text-muted mb-4">실격자 처리 후 변동될 수 있습니다.</p>

        <h3 className="font-[family-name:var(--font-bebas-neue)] text-3xl tracking-[2px] mb-1">
          TOP 3 RESULT
        </h3>
        <p className="text-sm text-text-secondary mb-8">
          - {record.course} {ranking.genderLabel} -
        </p>

        {/* Podium */}
        <div className="flex justify-center items-end gap-5 mb-8">
          {/* Silver - 2nd */}
          {ranking.top3.length >= 2 && (
            <div className="text-center">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-3 font-[family-name:var(--font-bebas-neue)] text-3xl bg-gradient-to-br from-[#c0c0c0] to-[#a0a0a0] text-[#1a1a1a]">
                2
              </div>
              <p className="text-sm text-text-secondary mb-1">Bib. {ranking.top3[1].bib}</p>
              <span className="inline-block px-3 py-1 rounded bg-[rgba(192,192,192,0.15)] text-accent-silver font-[family-name:var(--font-bebas-neue)] text-base">
                {ranking.top3[1].time}
              </span>
            </div>
          )}

          {/* Gold - 1st */}
          {ranking.top3.length >= 1 && (
            <div className="text-center mb-5">
              <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center mx-auto mb-3 font-[family-name:var(--font-bebas-neue)] text-4xl bg-gradient-to-br from-[#ffd700] to-[#f0c000] text-[#1a1a1a] shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                1
              </div>
              <p className="text-sm text-text-secondary mb-1">Bib. {ranking.top3[0].bib}</p>
              <span className="inline-block px-3 py-1 rounded bg-[rgba(255,215,0,0.15)] text-accent-gold font-[family-name:var(--font-bebas-neue)] text-base">
                {ranking.top3[0].time}
              </span>
            </div>
          )}

          {/* Bronze - 3rd */}
          {ranking.top3.length >= 3 && (
            <div className="text-center">
              <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-3 font-[family-name:var(--font-bebas-neue)] text-3xl bg-gradient-to-br from-[#cd7f32] to-[#a06020] text-[#1a1a1a]">
                3
              </div>
              <p className="text-sm text-text-secondary mb-1">Bib. {ranking.top3[2].bib}</p>
              <span className="inline-block px-3 py-1 rounded bg-[rgba(205,127,50,0.15)] text-accent-bronze font-[family-name:var(--font-bebas-neue)] text-base">
                {ranking.top3[2].time}
              </span>
            </div>
          )}
        </div>

        <Button onClick={onClose} variant="secondary" className="w-full">
          닫기
        </Button>
      </div>
    </Modal>
  );
}
