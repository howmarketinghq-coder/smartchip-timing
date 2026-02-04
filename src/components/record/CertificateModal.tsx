"use client";

import { useRef, useEffect, useCallback } from "react";
import { Share2, Download } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatDateKR } from "@/lib/utils";
import type { Event, Record } from "@/types";

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  record: Record;
}

const drawCherryBlossoms = (ctx: CanvasRenderingContext2D) => {
  const petals = [
    { x: 50, y: 30, s: 12 },
    { x: 150, y: 50, s: 10 },
    { x: 300, y: 20, s: 14 },
    { x: 450, y: 40, s: 11 },
    { x: 550, y: 25, s: 13 },
    { x: 100, y: 140, s: 8 },
    { x: 500, y: 130, s: 9 },
    { x: 350, y: 150, s: 7 },
  ];
  petals.forEach((p) => {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,183,197,${0.3 + Math.random() * 0.4})`;
    for (let i = 0; i < 5; i++) {
      const angle = ((i * 72 - 90) * Math.PI) / 180;
      const x = p.x + Math.cos(angle) * p.s;
      const y = p.y + Math.sin(angle) * p.s;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  });
};

const roundRect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) => {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
};

export default function CertificateModal({
  isOpen,
  onClose,
  event,
  record,
}: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    // Top gradient decoration
    const gradient = ctx.createLinearGradient(0, 0, w, 200);
    gradient.addColorStop(0, "#fce4ec");
    gradient.addColorStop(1, "#fff0f5");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, 180);

    // Cherry blossoms
    drawCherryBlossoms(ctx);

    // Event name
    ctx.fillStyle = "#E30613";
    ctx.font = 'bold 22px "Noto Sans KR", sans-serif';
    ctx.textAlign = "center";
    ctx.fillText("제32회", w / 2, 80);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = 'bold 36px "Noto Sans KR", sans-serif';
    ctx.fillText("경주벚꽃마라톤", w / 2, 125);

    // RECORD title
    ctx.fillStyle = "#333";
    ctx.font = 'bold 40px "Bebas Neue", Arial, sans-serif';
    ctx.fillText("RECORD", w / 2, 240);

    // Name label
    ctx.fillStyle = "#E30613";
    ctx.font = '16px "Noto Sans KR", sans-serif';
    ctx.fillText("이름", w / 2, 290);

    // Name
    ctx.fillStyle = "#1a1a1a";
    ctx.font = 'bold 42px "Noto Sans KR", sans-serif';
    ctx.fillText(record.name, w / 2, 340);

    // Bib and Course
    ctx.font = '16px "Noto Sans KR", sans-serif';
    ctx.fillStyle = "#E30613";
    ctx.fillText("배번호", w / 2 - 100, 400);
    ctx.fillText("코스", w / 2 + 100, 400);

    ctx.fillStyle = "#1a1a1a";
    ctx.font = 'bold 36px "Noto Sans KR", sans-serif';
    ctx.fillText(record.bib, w / 2 - 100, 450);
    ctx.fillText(record.course, w / 2 + 100, 450);

    // Time box
    const timeBoxY = 490;
    ctx.fillStyle = "#E30613";
    roundRect(ctx, 60, timeBoxY, w - 120, 80, 10);
    ctx.fill();

    ctx.fillStyle = "#fff";
    ctx.font = 'bold 52px "Bebas Neue", Arial, sans-serif';
    ctx.fillText(record.finishTime, w / 2, timeBoxY + 55);

    // Congratulations
    ctx.fillStyle = "#333";
    ctx.font = '18px "Noto Sans KR", sans-serif';
    ctx.fillText("완주를 축하드립니다.", w / 2, 630);
    ctx.fillText(formatDateKR(event.date), w / 2, 660);

    // Bottom sponsors
    ctx.fillStyle = "#666";
    ctx.font = '12px "Noto Sans KR", sans-serif';
    ctx.fillText(
      "Golden City Gyeongju | APEC 2025 KOREA | 경주시 체육회",
      w / 2,
      820
    );

    // SmartChip logo
    ctx.fillStyle = "#999";
    ctx.font = '10px "Oswald", sans-serif';
    ctx.fillText("No1 Timing System", w / 2, 860);
    ctx.font = 'bold 14px "Bebas Neue", sans-serif';
    ctx.fillText("SMART CHIP", w / 2, 878);
  }, [event, record]);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generateCertificate();
    }
  }, [isOpen, generateCertificate]);

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `기록증_${record.name}_${event.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareCertificate = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (blob && navigator.share) {
        try {
          const file = new File([blob], "기록증.png", { type: "image/png" });
          await navigator.share({
            title: `${event.name} 기록증`,
            text: `${record.name} - ${record.finishTime}`,
            files: [file],
          });
        } catch {
          downloadCertificate();
        }
      } else {
        downloadCertificate();
      }
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} showCloseButton={false}>
      <div className="text-center">
        <h2 className="text-xl font-bold text-accent-green mb-2">{event.name}</h2>

        <div className="relative w-full max-w-[400px] mx-auto my-5 rounded-xl overflow-hidden shadow-lg">
          <canvas
            ref={canvasRef}
            width={600}
            height={900}
            className="w-full block"
          />
        </div>

        <p className="text-xs text-accent-red mb-4">
          ※ 기록증을 클릭하면 더 크게 볼 수 있습니다
        </p>

        <div className="flex gap-3 justify-center mb-4">
          <Button onClick={shareCertificate} className="flex items-center gap-2">
            <Share2 size={16} />
            SHARE
          </Button>
          <Button
            onClick={downloadCertificate}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <Download size={16} />
            DownLoad
          </Button>
        </div>

        <Button onClick={onClose} variant="secondary" className="w-full">
          닫기
        </Button>
      </div>
    </Modal>
  );
}
