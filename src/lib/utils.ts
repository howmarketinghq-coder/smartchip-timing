import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 시간 문자열을 초로 변환
 * @param timeStr - "HH:MM:SS" 형식
 * @returns 초
 */
export function timeToSeconds(timeStr: string): number {
  const parts = timeStr.split(":");
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

/**
 * 초를 시간 문자열로 변환
 * @param seconds
 * @returns "HH:MM:SS" 형식
 */
export function secondsToTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

/**
 * 날짜를 한국어 형식으로 변환
 * @param date - Date 객체 또는 "YYYY-MM-DD" 형식
 * @returns "YYYY년 M월 D일" 형식
 */
export function formatDateKR(date: Date | string): string {
  const d = new Date(date);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환
 */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

/**
 * 페이스 문자열을 분 단위 숫자로 변환
 * @param pace - "MM:SS" 형식
 * @returns 분 (소수점 포함)
 */
export function paceToMinutes(pace: string): number {
  const parts = pace.split(":");
  return parseInt(parts[0]) + parseInt(parts[1]) / 60;
}
