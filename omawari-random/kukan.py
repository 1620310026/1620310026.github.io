import json

# JSONファイルからデータを読み込む
station_connections = {
    "名古屋": ["伏見", "丸の内"],
    "伏見": ["名古屋", "栄", "丸の内", "上前津"],
    "丸の内": ["名古屋", "伏見", "久屋大通"],
    "栄": ["伏見", "久屋大通", "上前津", "今池"],
    "久屋大通": ["丸の内", "栄", "今池", "平安通"],
    "上前津": ["伏見", "栄", "御器所", "新瑞橋"],
    "今池": ["栄", "久屋大通", "御器所", "本山"],
    "御器所": ["上前津", "今池", "八事", "新瑞橋"],
    "新瑞橋": ["上前津", "御器所", "八事"],
    "本山": ["今池", "平安通", "八事"],
    "八事": ["御器所", "新瑞橋", "本山"],
    "平安通": ["久屋大通", "本山"]
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

