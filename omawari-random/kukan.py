import json

# JSONファイルからデータを読み込む
station_connections = {
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

# すべての区間を出力するプログラム
print("All Sections:")
printed_sections = set()  # 既に出力した区間を記録するセット

for start_station, destinations in station_connections.items():
    for end_station in destinations:
        # 始点と終点が同じでなく、まだ出力されていない場合のみ出力
        if start_station != end_station and (start_station, end_station) not in printed_sections:
            print('<option value="'f'{start_station} - {end_station}''">'f'{start_station} - {end_station}''</option>')
            printed_sections.add((start_station, end_station))
            printed_sections.add((end_station, start_station))  # 入れ替えた方向も記録

