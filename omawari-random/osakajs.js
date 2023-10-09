let stationConnections = {
    "近江塩津": ["堅田", "米原"],
    "堅田": ["近江塩津", "山科"],
    "米原": ["近江塩津", "草津"],
    "山科": ["堅田", "草津", "京都"],
    "草津": ["米原", "柘植", "山科"],
    "京都": ["山科", "木津", "新大阪"],
    "柘植": ["草津", "木津"],
    "木津": ["京都", "柘植", "奈良", "放出"],
    "新大阪": ["京都", "大阪", "鴫野"],
    "奈良": ["木津", "王子", "桜井"],
    "放出": ["木津", "鴫野", "久宝寺"],
    "大阪": ["新大阪", "尼崎", "京橋", "西九条"],
    "鴫野": ["新大阪", "放出", "京橋"],
    "王子": ["奈良", "久宝寺", "高田"],
    "桜井": ["奈良", "高田"],
    "久宝寺": ["放出", "王子", "天王寺"],
    "尼崎": ["大阪", "京橋", "三宮", "谷川"],
    "京橋": ["尼崎", "大阪", "鴫野", "天王寺"],
    "西九条": ["大阪", "天王寺"],
    "高田": ["和歌山", "桜井", "王子"],
    "天王寺": ["久宝寺", "西九条", "京橋","和歌山"],
    "加古川": ["谷川", "三宮"],
    "三宮": ["尼崎", "加古川"],
    "谷川": ["加古川", "尼崎"],
    "和歌山": ["高田", "天王寺"]
};




function generateRandomRouteJS(selectedStation) {
    const stationList = Object.keys(stationConnections);
    const startGoal = selectedStation;
    const route = [startGoal];
    const visitedStations = new Set();
    const selectedEkisuu = document.querySelector('input[name="ekisuu"]:checked').value;
    const [ekisuumin, ekisuumax] = selectedEkisuu.split(",").map(Number);
    let keiyufuka = liststation();
    const output = document.getElementById('output');

    if (isInArray(keiyufuka, startGoal)) {
        output.textContent = "経由不可の駅を通らない大回りのルートを作成できません。";
    } else {
        try {
            let iterationCount = 0; 
            const maxIterations = 500000; 
            output.textContent = "ルート生成中...";

            setTimeout(() =>{
            while (iterationCount < maxIterations) {
                const currentStation = route[route.length - 1];
                const availableStations = stationConnections[currentStation].filter(station => !route.slice(1).includes(station));
                
                const unvisitedStations = availableStations.filter(station => !visitedStations.has(station));
                
                if (unvisitedStations.length === 0) {
                    if (route.length === 1) {
                        break;
                    }
                    route.pop();
                    continue;
                } else {
                    const nextStation = unvisitedStations[Math.floor(Math.random() * unvisitedStations.length)];
                    route.push(nextStation);
                    
                    if (nextStation === startGoal) {
                        if (new Set(route).size === 2) {
                            route.pop();
                            continue;
                        }
                        
                        if (route.length >= ekisuumin && route.length <= ekisuumax && !isInArray(keiyufuka,"ルート: " + route.join(" → "))) {
                            const output = document.getElementById('output');
                            output.textContent = route.join(" → ");
                            return route;
                        } else {
                            route.length = 1;
                            visitedStations.clear();
                            continue;
                        }
                    }
                    visitedStations.add(nextStation);
                }

                iterationCount++; 
            }

            if (iterationCount === maxIterations) {
                const output = document.getElementById('output');
                output.textContent = "遠すぎる、もしくは経由不可にする駅の指定が多すぎるため、指定した駅数を経由するルートを生成できませんでした";
            }
            }, 100); 

        } catch (error) {
            console.error("エラーが発生しました。ルートを再生成します。");
            return generateRandomRouteJS(selectedStation, ekisuumin, ekisuumax);
        }
    }
}

function generateRandomRoute(selectedValues) {
    const dropdown = document.getElementById('dropdown');
    const selectedSection = dropdown.value;
    const output = document.getElementById('output');


    if (isInArray(selectedValues, selectedSection)) {
        const output = document.getElementById('output');
        output.textContent = "経由不可の駅を通らない大回りのルートを作成できません。";
    } else {
        if (selectedSection.includes(" - ")) {
            const [startStation, goalStation] = selectedSection.split(" - ");
            const shouldSwap = Math.random() < 0.5;
            const selectedEkisuu = document.querySelector('input[name="ekisuu"]:checked').value;
            const [ekisuumin, ekisuumax] = selectedEkisuu.split(",").map(Number);
            const [actualStart, actualGoal] = shouldSwap ? [goalStation, startStation] : [startStation, goalStation];
            let result = [];
            let attempts = 0;
            output.textContent = "ルートを生成中..."; 
            setTimeout(() =>{
            do {
                result = generateRandomRoutePython(actualStart, actualGoal);
                attempts++; 
            } while (
                (result.length <= 1 ||
                result.length > ekisuumax ||
                result.length < ekisuumin ||
                isInArray(selectedValues, `始点駅 → ${result.join(' → ')} → 終点駅`)) &&
                attempts < 20000 
            );
            if (attempts >= 20000) {
                output.textContent = "遠すぎる、もしくは経由不可にする駅の指定が多すぎるため、指定した駅数を経由するルートを生成できませんでした";
            } else {
                output.textContent = `始点駅 → ${result.join(' → ')} → 終点駅`;
            }
            }, 100); 
        } else {
            console.error('Invalid section format.');
        } 
    }      
}

function generateRandomRoutePython(startStation, goalStation) {
    const stationList = Object.keys(stationConnections);

    const route = [startStation];
    const visitedStations = new Set();
    visitedStations.add(startStation);

    while (true) {
        const currentStation = route[route.length - 1];
        const availableStations = stationConnections[currentStation].filter(station => !route.slice(1).includes(station));

        const unvisitedStations = availableStations.filter(station => !visitedStations.has(station));

        if (unvisitedStations.length === 0) {
            if (route.length === 1) {
                break;
            }
            route.pop();
            continue;
        } else {
            
            const nextStation = unvisitedStations[Math.floor(Math.random() * unvisitedStations.length)];
                route.push(nextStation);

                if (nextStation === goalStation) {
                    if (new Set(route).size === 2) {
                        route.pop();
                        continue;
                    }

                    return route;
                }
            
            visitedStations.add(nextStation);
        }
    }

    return route;
}

function generateRoute() {
    const dropdown = document.getElementById("dropdown");
    const selectedSection = dropdown.value;
    let result = liststation();
    let result2 = liststation2();

    var selectedValue = document.querySelector('input[name="1"]:checked').value;
    if (selectedValue === "o") {
        if (selectedSection.includes(" - ")) {
            generateRandomRoute(result);
        } else {
            generateRandomRouteJS(selectedSection);
        }
    }else {
        let startStation = "a"
        let goalStation = "a"
        let outputoption = 3
        const dropdown2 = document.getElementById("dropdown2");
        const selectedSection2 = dropdown2.value;
        const output = document.getElementById('output');
        if (selectedSection === selectedSection2){
            output.textContent = "始点・終点が同じ駅・区間にしたい場合は、ルートの形状を「O型(一周)」に指定してルートの生成を行ってください";
            return;
        }
        let samecheck = "a"
        let fuka = "aaaaaaaabbbbb"
        while(startStation === goalStation){
            startStation = "a"
            goalStation = "a"
            outputoption = 3
            samecheck = "a"
            if (selectedSection2.includes(" - ")) {
            }
            else{
                samecheck = selectedSection2
            }
    
            if (selectedSection.includes(" - ")) {
                const [startStation1, startStation2] = selectedSection.split(" - ");
                if(isInArray(result2, startStation1)) {
                    if(isInArray(result2, startStation2)) {
                        output.textContent = "経由不可の駅を通らない大回りのルートを作成できません。";
                        return;
                    }
                    else{
                        startStation = startStation2
                    }
                }
                else{
                    if(isInArray(result2, startStation2)) {
                        startStation = startStation1
                    }
                    else{
                        if (Math.random() < 0.5) {
                            if(samecheck === startStation1){
                                startStation = startStation2
                                fuka = startStation2 + " → " + startStation1
                            }
                            else{
                                startStation = startStation1
                                fuka = startStation1 + " → " + startStation2
                            }
                        }
                        else{
                            if(samecheck === startStation2){
                                startStation = startStation1
                                fuka = startStation1 + " → " + startStation2
                            }
                            else{
                                startStation = startStation2
                                fuka = startStation2 + " → " + startStation1
                            }
                        }
    
                    }
    
                }
    
            }
            else{
                if(isInArray(result2, selectedSection)) {
                    output.textContent = "経由不可の駅を通らない大回りのルートを作成できません。";
                    return;
                }
                else{
                    startStation = selectedSection
                    outputoption = outputoption - 1
                    samecheck = selectedSection
                }
            }
            
            if (selectedSection2.includes(" - ")) {
                const [goalStation1, goalStation2] = selectedSection2.split(" - ");
                if(isInArray(result2, goalStation1)) {
                    if(isInArray(result2, goalStation2)) {
                        output.textContent = "経由不可の駅を通らない大回りのルートを作成できません。";
                        return;
                    }
                    else{
                        goalStation = goalStation2
                    }
                }
                else{
                    if(isInArray(result2, goalStation2)) {
                        goalStation = goalStation1
                    }
                    else{
                        if (Math.random() < 0.5) {
                            if(samecheck === goalStation1){
                                goalStation = goalStation2
                            }
                            else{
                            goalStation = goalStation1
                            }
                        }
                        else{
                            if(samecheck === goalStation2){
                                goalStation = goalStation1
                            }
                            goalStation = goalStation2
                        }
    
                    }
    
                }
    
            }
            else{
                if(isInArray(result2, selectedSection2)) {
                    output.textContent = "経由不可の駅を通らない大回りのルートを作成できません。";
                    return;
                }
                else{
                    goalStation = selectedSection2
                    outputoption = outputoption - 2
                }
            }
            
            if(isInArray(result2, startStation)) {
                output.textContent = "経由不可の駅を通らない大回りのルートを作成できません。";
                return;
            }
            
            if(isInArray(result2, goalStation)) {
                output.textContent = "経由不可の駅を通らない大回りのルートを作成できません。";
                return;
            }
            
        }
        generateRandomRoute2(startStation,goalStation,outputoption,fuka);
    }
}



function liststation(){
    var checkboxes = document.querySelectorAll('input[name="keiyufuka"]:checked');
    var selectedValues = [];
    checkboxes.forEach(function(checkbox) {
        selectedValues.push(checkbox.value);
    });
    if (selectedValues.includes("谷川")) {
        selectedValues.push("三宮");
        selectedValues.push("加古川");

    } 
    if (selectedValues.includes("加古川")) {
        selectedValues.push("谷川");
        selectedValues.push("三宮");

    } 
    if (selectedValues.includes("近江塩津")) {
        selectedValues.push("米原");
    } 
    return selectedValues
}

function liststation2(){
    var checkboxes = document.querySelectorAll('input[name="keiyufuka"]:checked');
    var selectedValues = [];
    checkboxes.forEach(function(checkbox) {
        selectedValues.push(checkbox.value);
    });
    return selectedValues
}

function isInArray(array, value){
    for (let i = 0; i < array.length; i++) {
      const key = array[i];
      if (key === '') {
        continue;
      }
      if (value.includes(key)) {
        return true;
      }
    }
    return false; 
}

function showElement() {
    var selectedValue = document.querySelector('input[name="1"]:checked').value;
    var elementToShow = document.getElementById('elementToShow');
    if (selectedValue === "n") {
        elementToShow.style.display = "block";
        const sentaku = document.getElementById('sentaku');
        sentaku.textContent = `大回り乗車の始点となる駅のある区間もしくは駅（乗換駅+αのみ）を選択`;
        const dropdown2 = document.getElementById("dropdown2");
        for (const station in stationConnections) {
            const option = document.createElement("option");
            option.value = station;
            option.textContent = station;
            dropdown2.appendChild(option);
        }        
    } else {
        elementToShow.style.display = "none";
        const sentaku = document.getElementById('sentaku');
        sentaku.textContent = `大回り乗車の始点・終点となる駅のある区間もしくは駅（乗換駅+αのみ）を選択`;
    }
}

function generateRandomRoute2(startStation,goalStation,outputoption,fuka) {
    const output = document.getElementById('output');
    const selectedEkisuu = document.querySelector('input[name="ekisuu"]:checked').value;
    const [ekisuumin, ekisuumax] = selectedEkisuu.split(",").map(Number);
    let result = [];
    let attempts = 0;
    output.textContent = "ルートを生成中...";
    let selectedValues = liststation2();
    selectedValues[selectedValues.length] = fuka;
 
    setTimeout(() =>{
    do {
        result = generateRandomRoutePython(startStation, goalStation,);
        attempts++; 
    } while (
        (result.length <= 1 ||
        result.length > ekisuumax ||
        result.length < ekisuumin ||
        isInArray(selectedValues, `${result.join(' → ')}`)) &&
        attempts < 20000 
    );
    if (attempts >= 20000) {
        output.textContent = "遠すぎる、もしくは経由不可にする駅の指定が多すぎるため、指定した駅数を経由する大回りのルートを生成できませんでした";
    } else {
        if(outputoption === 1){
            output.textContent = `始点駅 → ${result.join(' → ')}`;
        }
        if(outputoption === 2){
            output.textContent = `${result.join(' → ')} → 終点駅`;
        }
        if(outputoption === 3){
            output.textContent = `始点駅 → ${result.join(' → ')} → 終点駅`;
        }
        if(outputoption === 0){
            output.textContent = `${result.join(' → ')}`;
        }
    }
    }, 100);  
}

function download(){
    const output = document.getElementById('output');
    const outputtext = output.textContent;
    const text = outputtext; 
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // フォント、テキストサイズ、背景色を設定
    const fontSize = 64; // テキストのフォントサイズを大きく
    const fontFamily = "Arial";
    const backgroundColor = "white";

    // 画像サイズを設定（縦画面の16:9）
    const canvasWidth = 1080;
    const canvasHeight = 1920;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // 背景を塗りつぶす
    context.fillStyle = backgroundColor;
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    // テキストの描画設定
    context.fillStyle = "black"; // テキストの色
    context.font = `${fontSize}px ${fontFamily}`;

    // テキストを折り返して描画
    const textLines = wrapText(text, context, canvasWidth - 20, fontSize);
    const lineHeight = fontSize * 1.2; // 行の高さを設定
    let y = (canvasHeight - (textLines.length * lineHeight)) / 2; // テキストを中央に配置

    textLines.forEach((line) => {
        context.fillText(line, 10, y);
        y += lineHeight;
    });

    // 画像として保存
    const dataURL = canvas.toDataURL("image/png");

    // ダウンロードリンクを作成
    const a = document.createElement("a");
    a.href = dataURL;
    a.download = 'omawari_random_route.png'; // 保存するファイル名を指定
    a.click();
}

function wrapText(text, context, maxWidth, fontSize) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = context.measureText(currentLine + " " + word).width;

        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }

    lines.push(currentLine);
    return lines;
}

const dropdown = document.getElementById("dropdown");
for (const station in stationConnections) {
    const option = document.createElement("option");
    option.value = station;
    option.textContent = station;
    dropdown.appendChild(option);
}