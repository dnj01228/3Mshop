import { getRankings, saveRanking, parseTimeString } from './firestore.js';

document.getElementById("show-rankings").addEventListener("click", async () => {
    const rankings = await getRankings();
    const rankingListDiv = document.getElementById("ranking-list");
    const container = document.getElementById("ranking-container");

    if (rankings.length === 0) {
        rankingListDiv.innerHTML = "<p>아직 랭킹이 없습니다 😢</p>";
    } else {
        let html = "<h2>🏆 TOP 10 랭킹</h2><ol style='text-align: left;'>";
        rankings.slice(0, 10).forEach((rank, index) => {
        html += `<li><strong>${rank.username}</strong> - ${rank.time} / 힌트: ${rank.hints}</li>`;
        });
        html += "</ol>";
        rankingListDiv.innerHTML = html;
    }

    container.style.display = "block";
});


// 랭킹 저장 버튼 클릭 시
document.getElementById("save-score").addEventListener("click", async () => {
    const username = document.getElementById("username").value.trim();
    if (!username) {
        alert("닉네임을 입력해주세요!");
        return;
    }

    var totalTime = Math.floor((Date.now() - gameStartTime) / 1000);
    var clearTimeStr = formatTime(totalTime);

    const totalSeconds = parseTimeString(clearTimeStr);

    await saveRanking({
        username,
        hints: totalHintsUsed,
        time: clearTimeStr,
        totalSeconds,
    });

    alert("랭킹이 저장되었습니다!");
    document.getElementById("game-over").style.display = "none";
});