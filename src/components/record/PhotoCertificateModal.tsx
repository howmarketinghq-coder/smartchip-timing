"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Share2, Download, ImageIcon } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatDateKR } from "@/lib/utils";
import type { Event, Record } from "@/types";

interface PhotoCertificateModalProps {
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

export default function PhotoCertificateModal({
  isOpen,
  onClose,
  event,
  record,
}: PhotoCertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<HTMLImageElement | null>(null);

  const generatePhotoCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // Background
    ctx.fillStyle = "#fff0f5";
    ctx.fillRect(0, 0, w, h);

    // Top decoration
    const topGradient = ctx.createLinearGradient(0, 0, w, 0);
    topGradient.addColorStop(0, "#fce4ec");
    topGradient.addColorStop(0.5, "#fff");
    topGradient.addColorStop(1, "#fce4ec");
    ctx.fillStyle = topGradient;
    ctx.fillRect(0, 0, w, 60);

    drawCherryBlossoms(ctx);

    // Photo area
    const photoX = 80;
    const photoY = 70;
    const photoW = w - 160;
    const photoH = 380;

    if (uploadedPhoto) {
      ctx.save();
      ctx.beginPath();
      roundRect(ctx, photoX, photoY, photoW, photoH, 8);
      ctx.clip();

      // Fit image to area with crop
      const imgRatio = uploadedPhoto.width / uploadedPhoto.height;
      const boxRatio = photoW / photoH;
      let sx: number, sy: number, sw: number, sh: number;

      if (imgRatio > boxRatio) {
        sh = uploadedPhoto.height;
        sw = sh * boxRatio;
        sx = (uploadedPhoto.width - sw) / 2;
        sy = 0;
      } else {
        sw = uploadedPhoto.width;
        sh = sw / boxRatio;
        sx = 0;
        sy = (uploadedPhoto.height - sh) / 2;
      }

      ctx.drawImage(
        uploadedPhoto,
        sx,
        sy,
        sw,
        sh,
        photoX,
        photoY,
        photoW,
        photoH
      );
      ctx.restore();
    } else {
      // Checkerboard pattern for empty state
      const tileSize = 15;
      for (let tx = photoX; tx < photoX + photoW; tx += tileSize) {
        for (let ty = photoY; ty < photoY + photoH; ty += tileSize) {
          const isEven =
            ((tx - photoX) / tileSize + (ty - photoY) / tileSize) % 2 === 0;
          ctx.fillStyle = isEven ? "#e0e0e0" : "#f5f5f5";
          ctx.fillRect(
            tx,
            ty,
            Math.min(tileSize, photoX + photoW - tx),
            Math.min(tileSize, photoY + photoH - ty)
          );
        }
      }

      // Upload prompt
      ctx.fillStyle = "#999";
      ctx.font = '16px "Noto Sans KR", sans-serif';
      ctx.textAlign = "center";
      ctx.fillText("이미지 불러오기", w / 2, photoY + photoH / 2 + 40);
    }

    // Bottom info area
    const infoY = 480;

    // RUN RECORD logo
    ctx.fillStyle = "#333";
    ctx.font = 'bold 12px "Oswald", sans-serif';
    ctx.textAlign = "left";
    ctx.fillText("RUN", 100, infoY + 20);
    ctx.fillText("RECORD", 100, infoY + 35);

    // Name
    ctx.fillStyle = "#1a1a1a";
    ctx.font = 'bold 28px "Noto Sans KR", sans-serif';
    ctx.fillText(record.name, 100, infoY + 75);

    // Bib
    ctx.fillStyle = "#666";
    ctx.font = '14px "Noto Sans KR", sans-serif';
    ctx.fillText(`BIB ${record.bib}`, 100, infoY + 100);

    // Time
    ctx.fillStyle = "#E30613";
    ctx.font = 'bold 36px "Bebas Neue", sans-serif';
    ctx.fillText(record.finishTime, 100, infoY + 145);

    // Event name (right side)
    ctx.textAlign = "right";
    ctx.fillStyle = "#E30613";
    ctx.font = 'bold 18px "Noto Sans KR", sans-serif';
    ctx.fillText("제32회", w - 80, infoY + 90);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = 'bold 22px "Noto Sans KR", sans-serif';
    ctx.fillText("경주벚꽃마라톤", w - 80, infoY + 118);
    ctx.fillStyle = "#666";
    ctx.font = '14px "Noto Sans KR", sans-serif';
    ctx.fillText(formatDateKR(event.date), w - 80, infoY + 145);

    ctx.textAlign = "center";

    // Bottom decoration
    const btmGrad = ctx.createLinearGradient(0, h - 60, 0, h);
    btmGrad.addColorStop(0, "rgba(252,228,236,0)");
    btmGrad.addColorStop(1, "#fce4ec");
    ctx.fillStyle = btmGrad;
    ctx.fillRect(0, h - 60, w, 60);
  }, [event, record, uploadedPhoto]);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      generatePhotoCertificate();
    }
  }, [isOpen, generatePhotoCertificate]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setUploadedPhoto(img);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const downloadCertificate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = `포토기록증_${record.name}_${event.name}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareCertificate = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(async (blob) => {
      if (blob && navigator.share) {
        try {
          const file = new File([blob], "포토기록증.png", { type: "image/png" });
          await navigator.share({
            title: `${event.name} 포토기록증`,
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

        <div
          className="relative w-full max-w-[400px] mx-auto my-5 rounded-xl overflow-hidden shadow-lg cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <canvas
            ref={canvasRef}
            width={600}
            height={800}
            className="w-full block"
          />
          {!uploadedPhoto && (
            <div className="absolute top-[15%] left-[18%] w-[64%] h-[45%] flex flex-col items-center justify-center border-2 border-dashed border-text-muted rounded-lg bg-[rgba(200,200,200,0.1)] transition-colors hover:bg-[rgba(200,200,200,0.2)] hover:border-text-secondary">
              <ImageIcon size={48} className="text-text-muted mb-2" />
              <span className="text-sm text-text-muted">이미지 불러오기</span>
            </div>
          )}
          {uploadedPhoto && (
            <div className="absolute top-[15%] left-[18%] w-[64%] h-[45%] flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <span className="text-xs text-white bg-black/50 px-2 py-1 rounded">
                터치하여 사진 변경
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
        </div>

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
