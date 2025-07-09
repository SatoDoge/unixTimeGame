let currentUnixTime = 0;
let totalTimeDifference = 0;
let totalCount = 0;

function generateRandomUnixTime() {
    // 1970年1月1日から2038年1月19日までのランダムなUnixタイム
    const minTime = 0; // 1970年1月1日
    const maxTime = 2147483647; // 2038年1月19日（32bit intの上限）
    return Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
}

function newGame() {
    currentUnixTime = generateRandomUnixTime();
    document.getElementById('unixTime').textContent = currentUnixTime;
    document.getElementById('result').style.display = 'none';

    // 入力欄をクリア
    document.getElementById('year').value = '';
    document.getElementById('month').value = '';
    document.getElementById('day').value = '';
}

function formatTimeDifference(seconds) {
    const absDiff = Math.abs(seconds);
    const days = Math.floor(absDiff / 86400);
    const hours = Math.floor((absDiff % 86400) / 3600);
    const minutes = Math.floor((absDiff % 3600) / 60);
    const remainingSeconds = absDiff % 60;

    let result = '';
    if (days > 0) result += `${days}日`;
    if (hours > 0) result += `${hours}時間`;
    if (minutes > 0) result += `${minutes}分`;
    if (remainingSeconds > 0) result += `${remainingSeconds}秒`;

    return result || '0秒';
}

function getEvaluationMessage(averageDifference) {
    const avgDays = Math.abs(averageDifference) / 86400;

    if (avgDays < 1) {
        return '🏆 神級！';
    } else if (avgDays < 7) {
        return '🥇 素晴らしい！';
    } else if (avgDays < 30) {
        return '🥈 良い感じ！';
    } else if (avgDays < 365) {
        return '🥉 まずまず';
    } else {
        return '📚 もう少し頑張ろう！';
    }
}

function tweetResult() {
    const averageDifference = totalTimeDifference / totalCount;
    const evaluation = getEvaluationMessage(averageDifference);
    const averageText = formatTimeDifference(averageDifference);

    const tweetText = `Unixタイム日付当てゲームの結果！\n\n` +
        `🎯 問題数: ${totalCount}問\n` +
        `⏰ 平均ずれ: ${averageText}\n` +
        `📊 評価: ${evaluation}\n\n` +
        `あなたもチャレンジしてみよう！\n` +
        `#UnixTimeGame #日付当てゲーム`;

    const tweetURL = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(tweetURL, '_blank');
}

function checkAnswer() {
    const inputYear = parseInt(document.getElementById('year').value);
    const inputMonth = parseInt(document.getElementById('month').value);
    const inputDay = parseInt(document.getElementById('day').value);

    if (!inputYear || !inputMonth || !inputDay) {
        alert('年、月、日をすべて入力してください。');
        return;
    }

    // Unixタイムから正解の日付を計算
    const correctDate = new Date(currentUnixTime * 1000);
    const correctYear = correctDate.getFullYear();
    const correctMonth = correctDate.getMonth() + 1;
    const correctDay = correctDate.getDate();

    // 入力された日付からUnixタイムを計算
    const inputDate = new Date(inputYear, inputMonth - 1, inputDay);
    const inputUnixTime = Math.floor(inputDate.getTime() / 1000);

    // 時間の差を計算（秒単位）
    const timeDifference = inputUnixTime - currentUnixTime;

    totalCount++;
    totalTimeDifference += Math.abs(timeDifference);

    const resultDiv = document.getElementById('result');
    const averageDifference = totalTimeDifference / totalCount;

    // 結果の表示
    const diffText = formatTimeDifference(timeDifference);
    const direction = timeDifference > 0 ? '後' : '前';

    if (timeDifference === 0) {
        resultDiv.className = 'result correct';
        resultDiv.innerHTML = `🎉 完璧！<br>${correctYear}年${correctMonth}月${correctDay}日`;
    } else {
        resultDiv.className = 'result incorrect';
        resultDiv.innerHTML = `
            正解: ${correctYear}年${correctMonth}月${correctDay}日<br>
            あなたの回答: ${inputYear}年${inputMonth}月${inputDay}日<br>
            ずれ: ${diffText}${direction}
        `;
    }

    resultDiv.style.display = 'block';

    // スコア更新
    document.getElementById('total').textContent = totalCount;
    document.getElementById('average').textContent = formatTimeDifference(averageDifference);
    document.getElementById('evaluation').textContent = getEvaluationMessage(averageDifference);

    // ツイートボタンを表示（3問以上回答した場合）
    if (totalCount >= 3) {
        document.getElementById('tweetButton').style.display = 'inline-block';
    }
}

// ページ読み込み時に最初の問題を生成
window.onload = function () {
    newGame();
};

// Enterキーで答えを確認
document.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        checkAnswer();
    }
});