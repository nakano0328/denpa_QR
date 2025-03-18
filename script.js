const qrcodeDiv = document.getElementById('qrcode');
const generateButton = document.getElementById('generate-button');
const saveButton = document.getElementById('save-button');
const historyList = document.getElementById('history-list');
const avoidanceButtons = document.querySelectorAll('.avoidance-buttons button');
const antennaSelect = document.getElementById('antenna-select');
const statusTableContainer = document.getElementById('status-table-container');

let qrcode;
const history = [];
let avoidanceBonus = 0;

// ステータスデータ
const statusData = {
    "アンテナ無し": {
        "0": [40, 37, 34, 32, 29],
        "3+": [37, 34, 32, 29, 26],
        "3-": [34, 32, 29, 26, 24]
    },
    "足元ガード": {
        "0": [35, 32, 30, 27, 25],
        "3+": [32, 30, 27, 25, 22],
        "3-": [30, 27, 25, 22, 20]
    },
    "単体回復": {
        "0": [41, 39, 36, 33, 31],
        "3+": [39, 36, 33, 31, 28],
        "3-": [36, 33, 31, 28, 26]
    },
    "全体回復": {
        "0": [43, 40, 38, 35, 33],
        "3+": [40, 38, 35, 33, 30],
        "3-": [38, 35, 33, 30, 27]
    },
    "単体復活": {
        "0": [42, 40, 37, 35, 32],
        "3+": [40, 37, 35, 32, 30],
        "3-": [37, 35, 32, 30, 27]
    },
    "全体復活": {
        "0": [46, 44, 41, 39, 36],
        "3+": [44, 41, 39, 36, 34],
        "3-": [41, 39, 36, 34, 31]
    },
    "解毒": {
        "0": [42, 39, 37, 34, 32],
        "3+": [39, 37, 34, 32, 29],
        "3-": [37, 34, 32, 29, 26]
    },
    "痺れとる": {
        "0": [43, 41, 38, 36, 33],
        "3+": [41, 38, 36, 33, 31],
        "3-": [38, 36, 33, 31, 28]
    },
    "目覚める": {
        "0": [43, 40, 38, 35, 33],
        "3+": [40, 38, 35, 33, 30],
        "3-": [38, 35, 33, 30, 27]
    },
    "属性治す": {
        "0": [42, 40, 37, 34, 32],
        "3+": [40, 37, 34, 32, 29],
        "3-": [37, 34, 32, 29, 27]
    },
    "全て治す": {
        "0": [42, 40, 37, 35, 32],
        "3+": [40, 37, 35, 32, 30],
        "3-": [37, 35, 32, 30, 27]
    },
    "無敵": {
        "0": [42, 40, 37, 35, 32],
        "3+": [40, 37, 35, 32, 30],
        "3-": [37, 35, 32, 30, 27]
    },
    "興奮": {
        "0": [37, 35, 32, 30, 27],
        "3+": [35, 32, 30, 27, 25],
        "3-": [32, 30, 27, 25, 22]
    },
    "蓄える": {
        "0": [42, 39, 37, 35, 32],
        "3+": [39, 37, 35, 32, 30],
        "3-": [37, 35, 32, 30, 27]
    },
    "単体増強系": {
        "0": [36, 34, 32, 30, 27],
        "3+": [34, 32, 30, 27, 25],
        "3-": [32, 30, 27, 25, 23]
    },
    "単体増強系(かわしやすい系)": {
        "0": [36, 34, 32, 30, 27],
        "3+": [34, 32, 30, 27, 25],
        "3-": [32, 30, 27, 25, 23]
    },
    "全体増強系": {
        "0": [35, 33, 31, 29, 27],
        "3+": [33, 31, 29, 27, 25],
        "3-": [31, 29, 27, 25, 23]
    },
    "弱体系": {
        "0": [37, 35, 32, 30, 27],
        "3+": [35, 32, 30, 27, 25],
        "3-": [32, 30, 27, 25, 22]
    },
    "弱体系(みんなかわしやすい)": {
        "0": [37, 35, 32, 30, 27],
        "3+": [35, 32, 30, 27, 25],
        "3-": [32, 30, 27, 25, 22]
    },
    "単体攻撃(火,水)": {
        "0": [34, 32, 30, 28, 25],
        "3+": [32, 30, 28, 25, 23],
        "3-": [30, 28, 25, 23, 21]
    },
    "単体攻撃(風,光)": {
        "0": [33, 31, 29, 27, 24],
        "3+": [31, 29, 27, 24, 22],
        "3-": [29, 27, 24, 22, 20]
    },
    "単体攻撃(土,雷,氷,闇)": {
        "0": [33, 31, 29, 27, 24],
        "3+": [31, 29, 27, 24, 22],
        "3-": [29, 27, 24, 22, 20]
    },
    "3体攻撃(火,水)": {
        "0": [36, 34, 31, 29, 27],
        "3+": [34, 31, 29, 27, 24],
        "3-": [31, 29, 27, 24, 22]
    },
    "3体攻撃(風,光)": {
        "0": [35, 33, 30, 28, 26],
        "3+": [33, 30, 28, 26, 23],
        "3-": [30, 28, 26, 23, 21]
    },
    "3体攻撃(土,雷,氷,闇)": {
        "0": [35, 33, 30, 28, 26],
        "3+": [33, 30, 28, 26, 23],
        "3-": [30, 28, 26, 23, 21]
    },
    "全体攻撃(火,水)": {
        "0": [37, 34, 32, 30, 27],
        "3+": [34, 32, 30, 27, 25],
        "3-": [32, 30, 27, 25, 22]
    },
    "全体攻撃(風,光)": {
        "0": [36, 33, 31, 29, 26],
        "3+": [33, 31, 29, 26, 24],
        "3-": [31, 29, 26, 24, 21]
    },
    "全体攻撃(土,雷,氷,闇)": {
        "0": [36, 33, 31, 29, 26],
        "3+": [33, 31, 29, 26, 24],
        "3-": [31, 29, 26, 24, 21]
    },
    "ノックダウン": {
        "0": [38, 36, 33, 31, 28],
        "3+": [36, 33, 31, 28, 26],
        "3-": [33, 31, 28, 26, 23]
    }
};

// 初期化
function init() {
    try {
        qrcode = new QRCode(qrcodeDiv, {
            width: 256,
            height: 256
        });
        console.log(qrcode);
        generateQRCode();

        antennaSelect.addEventListener('change', updateAvoidanceBonus);
        antennaSelect.addEventListener('change', displayStatusTable);

        avoidanceButtons.forEach(button => {
            button.addEventListener('click', function() {
                avoidanceButtons.forEach(btn => btn.classList.remove('selected'));
                this.classList.add('selected');
                displayStatusTable();
            });
        });

        // 最初の回避ボタンを選択
        if (avoidanceButtons.length > 0) {
            avoidanceButtons[0].click();
        }

        updateAvoidanceBonus();
        updateAvoidanceButtonLabels();
        displayStatusTable();
    } catch (error) {
        console.error("初期化中にエラーが発生しました:", error);
    }
}

// 回避率ボーナスを更新
function updateAvoidanceBonus() {
    const selectedAntenna = antennaSelect.value;
    avoidanceBonus = 0;

    if (selectedAntenna === "足元ガード") {
        avoidanceBonus += 1;
    } else if (selectedAntenna === "単体増強系(かわしやすい系)") {
        avoidanceBonus += 2;
    } else if (selectedAntenna === "弱体系(みんなかわしやすい)") {
        avoidanceBonus += 4;
    } else if (selectedAntenna === "単体攻撃(風,光)" || selectedAntenna === "3体攻撃(風,光)" || selectedAntenna === "全体攻撃(風,光)") {
        avoidanceBonus += 1;
    } else if (selectedAntenna === "ノックダウン") {
        avoidanceBonus += 1;
    }

    updateAvoidanceButtonLabels();
}

// 回避ボタンのラベルを更新
function updateAvoidanceButtonLabels() {
    avoidanceButtons.forEach(button => {
        const value = button.dataset.value; // data-value 属性の値を直接取得
        let totalAvoidance = "";

        if (value.includes('+')) {
            // 例: "3+" → "4+"
            const numValue = parseInt(value);
            totalAvoidance = (numValue + avoidanceBonus) + "+";
        } else if (value.includes('-')) {
            // 例: "3-" → "4-"
            const numValue = parseInt(value);
            totalAvoidance = (numValue + avoidanceBonus) + "-";
        } else {
            // 通常の数値の場合
            totalAvoidance = (parseInt(value) + avoidanceBonus).toString();
        }
        button.textContent = totalAvoidance; // ボタンのテキストを変更
    });
}

// ランダムな20桁の文字列を生成
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// QRコードを生成・表示
function generateQRCode() {
    try {
        const text = generateRandomString(20);
        qrcode.clear();
        qrcode.makeCode(text);
        addToHistory(text);
    } catch (error) {
        console.error("QRコードの生成中にエラーが発生しました:", error);
    }
}

// 履歴に追加
function addToHistory(text) {
    history.unshift(text);
    const li = document.createElement('li');
    li.textContent = text;
    li.addEventListener('click', () => {
        qrcode.clear();
        qrcode.makeCode(text);
    });
    historyList.insertBefore(li, historyList.firstChild);
}

// ボタンクリック時の処理
generateButton.addEventListener('click', generateQRCode);

// ステータス表を表示
function displayStatusTable() {
    const selectedAntenna = antennaSelect.value;
    const selectedAvoidanceButton = document.querySelector('.avoidance-buttons button.selected');
    const avoidanceValue = selectedAvoidanceButton ? selectedAvoidanceButton.dataset.value : null;

    let values = ["", "", "", "", ""]; // 初期値を空白にする
    if (selectedAntenna && avoidanceValue && statusData[selectedAntenna] && statusData[selectedAntenna][avoidanceValue]) {
        values = statusData[selectedAntenna][avoidanceValue];
    }

    let tableHTML = `
        <table id="status-table">
            <tr>
                <th></th>
                <th>最大</th>
                <th>準最大</th>
                <th>中間</th>
                <th>準最速</th>
                <th>最速</th>
            </tr>
            <tr>
                <td>HP</td>
                <td>${values[0] || ""}</td>
                <td>${values[1] || ""}</td>
                <td>${values[2] || ""}</td>
                <td>${values[3] || ""}</td>
                <td>${values[4] || ""}</td>
            </tr>
        </table>
    `;
    statusTableContainer.innerHTML = tableHTML;
}

// QRコード保存処理
saveButton.addEventListener('click', function() {
    const canvas = qrcodeDiv.querySelector('canvas');
    if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'qrcode.png';
        link.click();
    }
});

// 初期化処理を実行
init();