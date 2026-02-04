import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 관리자 계정 생성
  const hashedPassword = await bcrypt.hash("smartchip2026", 10);
  await prisma.admin.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      password: hashedPassword,
    },
  });

  // 제32회 경주벚꽃마라톤대회 생성
  const gyeongjuEvent = await prisma.event.upsert({
    where: { id: "gyeongju-cherry-32" },
    update: {},
    create: {
      id: "gyeongju-cherry-32",
      name: "제32회 경주벚꽃마라톤대회",
      date: new Date("2025-04-05"),
      courses: JSON.stringify(["5Km", "10Km", "하프", "풀코스"]),
      status: "past",
    },
  });

  // 샘플 기록 데이터
  const sampleRecords = [
    {
      bib: "10006",
      name: "김현수",
      course: "10Km",
      gender: "M",
      finishTime: "00:46:45",
      speed: 13.04,
      pace: "04:40",
      splits: JSON.stringify([
        { point: "0.4km", time: "00:02:34", passTime: "08:19:12", pace: "06:05" },
        { point: "5.0km", time: "00:24:42", passTime: "08:41:20", pace: "04:49" },
        { point: "10.0km", time: "00:46:45", passTime: "09:03:23", pace: "04:24" },
      ]),
    },
    {
      bib: "12858",
      name: "박민준",
      course: "10Km",
      gender: "M",
      finishTime: "00:32:53",
      speed: 18.24,
      pace: "03:17",
      splits: JSON.stringify([
        { point: "0.4km", time: "00:01:18", passTime: "08:17:58", pace: "03:15" },
        { point: "5.0km", time: "00:16:25", passTime: "08:33:05", pace: "03:17" },
        { point: "10.0km", time: "00:32:53", passTime: "08:49:33", pace: "03:17" },
      ]),
    },
    {
      bib: "11667",
      name: "이준호",
      course: "10Km",
      gender: "M",
      finishTime: "00:33:08",
      speed: 18.1,
      pace: "03:19",
      splits: JSON.stringify([
        { point: "0.4km", time: "00:01:20", passTime: "08:18:00", pace: "03:20" },
        { point: "5.0km", time: "00:16:30", passTime: "08:33:10", pace: "03:18" },
        { point: "10.0km", time: "00:33:08", passTime: "08:49:48", pace: "03:20" },
      ]),
    },
    {
      bib: "10940",
      name: "정서연",
      course: "10Km",
      gender: "M",
      finishTime: "00:35:50",
      speed: 16.74,
      pace: "03:35",
      splits: JSON.stringify([
        { point: "0.4km", time: "00:01:26", passTime: "08:18:06", pace: "03:35" },
        { point: "5.0km", time: "00:17:55", passTime: "08:34:35", pace: "03:35" },
        { point: "10.0km", time: "00:35:50", passTime: "08:52:30", pace: "03:35" },
      ]),
    },
    {
      bib: "10100",
      name: "최영민",
      course: "10Km",
      gender: "M",
      finishTime: "00:38:20",
      speed: 15.65,
      pace: "03:50",
      splits: JSON.stringify([
        { point: "0.4km", time: "00:01:32", passTime: "08:18:12", pace: "03:50" },
        { point: "5.0km", time: "00:19:10", passTime: "08:35:50", pace: "03:50" },
        { point: "10.0km", time: "00:38:20", passTime: "08:55:00", pace: "03:50" },
      ]),
    },
    {
      bib: "20001",
      name: "강지은",
      course: "10Km",
      gender: "F",
      finishTime: "00:42:15",
      speed: 14.2,
      pace: "04:13",
      splits: JSON.stringify([
        { point: "0.4km", time: "00:01:41", passTime: "08:18:21", pace: "04:13" },
        { point: "5.0km", time: "00:21:08", passTime: "08:37:48", pace: "04:14" },
        { point: "10.0km", time: "00:42:15", passTime: "08:58:55", pace: "04:13" },
      ]),
    },
    {
      bib: "10200",
      name: "한승우",
      course: "10Km",
      gender: "M",
      finishTime: "00:44:30",
      speed: 13.48,
      pace: "04:27",
      splits: JSON.stringify([
        { point: "0.4km", time: "00:01:47", passTime: "08:18:27", pace: "04:27" },
        { point: "5.0km", time: "00:22:15", passTime: "08:38:55", pace: "04:27" },
        { point: "10.0km", time: "00:44:30", passTime: "09:01:10", pace: "04:27" },
      ]),
    },
    {
      bib: "10300",
      name: "윤도현",
      course: "10Km",
      gender: "M",
      finishTime: "00:48:55",
      speed: 12.27,
      pace: "04:53",
      splits: JSON.stringify([
        { point: "0.4km", time: "00:01:57", passTime: "08:18:37", pace: "04:53" },
        { point: "5.0km", time: "00:24:28", passTime: "08:41:08", pace: "04:54" },
        { point: "10.0km", time: "00:48:55", passTime: "09:05:35", pace: "04:53" },
      ]),
    },
    {
      bib: "30001",
      name: "조혜림",
      course: "하프",
      gender: "F",
      finishTime: "01:48:30",
      speed: 11.63,
      pace: "05:09",
      splits: JSON.stringify([
        { point: "5.0km", time: "00:25:45", passTime: "08:42:25", pace: "05:09" },
        { point: "10.0km", time: "00:51:30", passTime: "09:08:10", pace: "05:09" },
        { point: "15.0km", time: "01:17:15", passTime: "09:33:55", pace: "05:09" },
        { point: "21.1km", time: "01:48:30", passTime: "10:05:10", pace: "05:09" },
      ]),
    },
    {
      bib: "30100",
      name: "신태호",
      course: "하프",
      gender: "M",
      finishTime: "01:32:10",
      speed: 13.72,
      pace: "04:22",
      splits: JSON.stringify([
        { point: "5.0km", time: "00:21:50", passTime: "08:38:30", pace: "04:22" },
        { point: "10.0km", time: "00:43:40", passTime: "09:00:20", pace: "04:22" },
        { point: "15.0km", time: "01:05:30", passTime: "09:22:10", pace: "04:22" },
        { point: "21.1km", time: "01:32:10", passTime: "09:48:50", pace: "04:22" },
      ]),
    },
  ];

  // 기록 데이터 삽입
  for (const record of sampleRecords) {
    await prisma.record.upsert({
      where: {
        eventId_bib: {
          eventId: gyeongjuEvent.id,
          bib: record.bib,
        },
      },
      update: record,
      create: {
        ...record,
        eventId: gyeongjuEvent.id,
      },
    });
  }

  // 샘플 포스터 데이터 - 기존 데이터 삭제 후 재생성
  await prisma.poster.deleteMany({});
  await prisma.poster.createMany({
    data: [
      {
        type: "hero",
        imageUrl: "https://placehold.co/600x400/1a3a5c/ffffff?text=2026+PIS+수영대회",
        link: "#",
        order: 1,
      },
      {
        type: "hero",
        imageUrl: "https://placehold.co/600x400/3a1a5c/ffffff?text=서울마라톤+2026",
        link: "#",
        order: 2,
      },
      {
        type: "next",
        imageUrl: "https://placehold.co/300x240/E30613/ffffff?text=JUST+RUN+10",
        link: "#",
        order: 1,
      },
      {
        type: "next",
        imageUrl: "https://placehold.co/300x240/1565C0/ffffff?text=청주+납대회",
        link: "#",
        order: 2,
      },
      {
        type: "next",
        imageUrl: "https://placehold.co/300x240/2E7D32/ffffff?text=김포한강+마라톤",
        link: "#",
        order: 3,
      },
      {
        type: "next",
        imageUrl: "https://placehold.co/300x240/F57C00/ffffff?text=동해안+울트라",
        link: "#",
        order: 4,
      },
      {
        type: "next",
        imageUrl: "https://placehold.co/300x240/7B1FA2/ffffff?text=JUST+RUN+10+시즌2",
        link: "#",
        order: 5,
      },
      {
        type: "next",
        imageUrl: "https://placehold.co/300x240/00838F/ffffff?text=제주+올레+런",
        link: "#",
        order: 6,
      },
    ],
  });

  // 추가 과거 대회 생성
  const pastEvents = [
    { id: "jinju-training-2026", name: "2026 진주지역 달림이 합동훈련", date: "2026-01-25", courses: ["10Km", "하프"] },
    { id: "korea-snow-trail-2026", name: "2026 코리아 스노우 트레일", date: "2026-01-18", courses: ["10Km", "30Km", "50Km"] },
    { id: "geoje-mountain-2026", name: "2026 거제 산방산 임도런", date: "2026-01-03", courses: ["10Km", "20Km"] },
    { id: "hanam-relay-2025", name: "2025 하남시육상연맹 클럽 대항전 마라톤대회", date: "2025-12-28", courses: ["5Km", "10Km", "하프"] },
    { id: "jinju-35-2025", name: "제35회 진주마라톤대회", date: "2025-12-21", courses: ["10Km", "하프", "풀코스"] },
    { id: "seoul-year-end-2025", name: "2025 서울 연말 달리기 페스티벌", date: "2025-12-14", courses: ["5Km", "10Km"] },
    { id: "busan-ocean-2025", name: "2025 부산 오션 마라톤", date: "2025-11-30", courses: ["10Km", "하프", "풀코스"] },
    { id: "chuncheon-2025", name: "2025 춘천마라톤", date: "2025-10-26", courses: ["10Km", "하프", "풀코스"] },
    { id: "daegu-color-run-2025", name: "2025 대구 컬러런 페스티벌", date: "2025-09-20", courses: ["5Km"] },
  ];

  for (const event of pastEvents) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: {
        id: event.id,
        name: event.name,
        date: new Date(event.date),
        courses: JSON.stringify(event.courses),
        status: "past",
      },
    });
  }

  console.log("Seed data created successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
