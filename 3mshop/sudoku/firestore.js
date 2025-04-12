// import 해야 함
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase"; // firebase.js에서 export한 db

/**
 * 문자열 "3분 10초" 같은 시간 => 총 초로 변환
 */
export function parseTimeString(str) {
  const match = str.match(/(\d+)분\s*(\d+)초/);
  if (!match) return 0;
  const minutes = parseInt(match[1]);
  const seconds = parseInt(match[2]);
  return minutes * 60 + seconds;
}

/**
 * rankings 컬렉션에 랭킹 저장
 */
export async function saveRanking({ username, hints, time, totalSeconds }) {
  try {
    await addDoc(collection(db, "rankings"), {
      username,
      hints,
      time,
      totalSeconds,
      reg_date: Timestamp.now(),
    });
    console.log("🔥 랭킹 저장 완료!");
  } catch (e) {
    console.error("❌ 랭킹 저장 실패:", e);
  }
}