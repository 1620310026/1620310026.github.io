let stationConnections = {
    "友部": ["小山", "我孫子"],
    "我孫子": ["友部", "新松戸", "成田"],
    "小山": ["友部", "大宮", "高崎"],
    "新松戸": ["南浦和", "日暮里", "西船橋", "我孫子"],
    "成田": ["香取", "我孫子", "佐倉"],
    "大宮": ["小山", "高麗川", "倉賀野", "南浦和", "武蔵浦和"],
    "南浦和": ["新松戸", "武蔵浦和", "大宮", "赤羽"],
    "日暮里": ["上野", "田端", "尾久", "新松戸"],
    "上野": ["秋葉原", "日暮里"],
    "尾久": ["日暮里", "赤羽"],
    "西船橋": ["新松戸", "千葉", "錦糸町", "南船橋", "市川塩浜"],
    "香取": ["松岸", "成田"],
    "佐倉": ["成田", "成東", "千葉"],
    "高麗川": ["大宮", "倉賀野", "拝島"],
    "高崎": ["小山", "倉賀野"],
    "倉賀野": ["大宮", "高麗川", "高崎"],
    "武蔵浦和": ["南浦和", "大宮", "赤羽", "西国分寺"],
    "赤羽": ["南浦和", "武蔵浦和", "尾久", "田端", "池袋"],
    "田端": ["池袋", "赤羽", "日暮里"],
    "秋葉原": ["上野", "御茶ノ水", "神田", "錦糸町"],
    "千葉": ["佐倉", "蘇我", "西船橋"],
    "錦糸町": ["西船橋", "秋葉原", "東京"],
    "南船橋": ["西船橋", "市川塩浜", "蘇我"],
    "市川塩浜": ["南船橋", "西船橋", "東京"],
    "松岸": ["香取", "成東"],
    "成東": ["佐倉", "松岸", "大網"],
    "拝島": ["高麗川", "立川", "八王子"],
    "西国分寺": ["新宿", "武蔵浦和", "府中本町", "立川"],
    "池袋": ["赤羽", "田端", "新宿"],
    "御茶ノ水": ["秋葉原", "神田", "代々木"],
    "神田": ["秋葉原", "御茶ノ水", "東京"],
    "蘇我": ["千葉", "大網", "南船橋", "木更津"],
    "東京": ["神田", "品川", "錦糸町", "市川塩浜"],
    "大網": ["蘇我", "成東", "安房鴨川"],
    "立川": ["八王子", "府中本町", "西国分寺", "拝島"],
    "八王子": ["立川", "拝島", "橋本"],
    "府中本町": ["立川", "西国分寺", "武蔵小杉"],
    "新宿": ["池袋", "代々木", "西国分寺"],
    "代々木": ["御茶ノ水", "新宿", "品川"],
    "安房鴨川": ["木更津", "大網"],
    "木更津": ["安房鴨川", "蘇我"],
    "橋本": ["八王子", "茅ヶ崎", "東神奈川"],
    "武蔵小杉": ["府中本町", "品川", "尻手", "鶴見"],
    "品川": ["代々木", "東京", "川崎", "武蔵小杉"],
    "茅ヶ崎": ["橋本", "大船"],
    "東神奈川": ["橋本", "横浜", "鶴見"],
    "尻手": ["武蔵小杉", "浜川崎", "川崎"],
    "浜川崎": ["鶴見", "尻手"],
    "鶴見": ["浜川崎", "武蔵小杉", "東神奈川", "川崎"],
    "大船": ["茅ヶ崎", "横浜", "磯子"],
    "横浜": ["東神奈川", "磯子", "大船"],
    "磯子": ["大船", "横浜"],
    "川崎": ["品川", "鶴見", "尻手"]
};

const dropdown = document.getElementById("dropdown");
for (const station in stationConnections) {
    const option = document.createElement("option");
    option.value = station;
    option.textContent = station;
    dropdown.appendChild(option);
}

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
    if (selectedValues.includes("倉賀野")) {
        selectedValues.push("高崎");
    } 
    if (selectedValues.includes("高崎") && selectedValues.includes("友部")) {
        selectedValues.push("小山");
    } 
    if (selectedValues.includes("安房鴨川") && selectedValues.includes("友部")) {
        selectedValues.push("木更津");
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

function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("open");
    
}




