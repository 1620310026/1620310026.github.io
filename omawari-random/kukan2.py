import json
from typing import Dict, List, Tuple, Set, Any

station_connections: Dict[str, List[str]] = {
    "池袋": ["後楽園", "飯田橋", "新宿三丁目"],
    "後楽園": ["池袋", "飯田橋", "大手町"],
    "飯田橋": ["池袋", "後楽園", "市ケ谷", "九段下"],
    "新宿三丁目": ["池袋", "四ツ谷", "明治神宮前"],
    "大手町": ["後楽園", "銀座", "北千住", "日比谷", "日本橋", "竹橋", "神保町", "三越前"],
    "市ケ谷": ["飯田橋", "四ツ谷", "麹町"],
    "九段下": ["飯田橋", "竹橋", "神保町", "永田町"],
    "四ツ谷": ["市ケ谷", "永田町", "新宿三丁目", "赤坂見附"],
    "明治神宮前": ["新宿三丁目", "渋谷", "表参道"],
    "銀座": ["大手町", "霞ケ関", "日本橋", "新橋", "茅場町", "日比谷"],
    "北千住": ["大手町", "上野"],
    "日比谷": ["大手町", "霞ケ関", "銀座"],
    "日本橋": ["大手町", "茅場町", "三越前", "銀座"],
    "竹橋": ["大手町", "九段下"],
    "神保町": ["大手町", "九段下"],
    "三越前": ["大手町", "上野", "日本橋"],
    "麹町": ["市ケ谷", "永田町"],
    "永田町": ["九段下", "青山一丁目", "麹町", "四ツ谷", "溜池山王"],
    "赤坂見附": ["四ツ谷", "国会議事堂前", "青山一丁目", "溜池山王"],
    "渋谷": ["明治神宮前", "表参道"],
    "表参道": ["明治神宮前", "渋谷", "国会議事堂前", "外苑前", "青山一丁目"],
    "霞ケ関": ["銀座", "国会議事堂前", "日比谷"],
    "新橋": ["銀座", "溜池山王"],
    "上野": ["北千住", "茅場町", "三越前"],
    "茅場町": ["日本橋", "上野", "銀座"],
    "青山一丁目": ["永田町", "赤坂見附", "表参道", "外苑前"],
    "溜池山王": ["永田町", "赤坂見附", "新橋"],
    "国会議事堂前": ["赤坂見附", "霞ケ関", "表参道"],
    "外苑前": ["表参道", "青山一丁目"]
}

def validate_connections(
    connections: Dict[str, List[str]],
    auto_fix: bool = False,
    save_to: str | None = None,
    verbose: bool = True
) -> Tuple[Dict[str, List[str]], List[str]]:
    """
    connections を検査し、問題を報告する。
    auto_fix=True の場合、以下を自動で実行:
      - 自己接続を削除
      - リスト内の重複を削除
      - 相互リンクが欠けている場合は補完（必要なら未定義駅のキーを作成）
    save_to にパスを指定すると、修正後の connections を JSON に保存する。
    戻り値: (修正後の connections, レポート行のリスト)
    """
    report: List[str] = []
    # コピーを作って元データを破壊しない
    conn = {k: list(v) for k, v in connections.items()}

    # まず重複と自己参照を検出／修正
    for station, dests in list(conn.items()):
        orig_len = len(dests)
        # 重複削除（順序は保持）
        seen: Set[str] = set()
        new_dests: List[str] = []
        for d in dests:
            if d not in seen:
                seen.add(d)
                new_dests.append(d)
        if len(new_dests) != orig_len:
            report.append(f"重複検出: '{station}' の接続リストに重複がありました -> {dests}")
            if auto_fix:
                conn[station] = new_dests
                report.append(f"  -> 重複を除去しました: '{station}': {new_dests}")
        # 自己参照
        if station in conn[station]:
            report.append(f"自己接続検出: '{station}' が自身を接続先に含んでいます.")
            if auto_fix:
                conn[station] = [x for x in conn[station] if x != station]
                report.append(f"  -> 自己接続を削除しました: '{station}': {conn[station]}")

    # 次に相互性と未定義駅のチェック
    # collect keys first because auto_fix may add new keys
    keys = set(conn.keys())
    # iterate over snapshot of items since we may modify conn in loop
    for start, dests in list(conn.items()):
        for end in list(dests):
            if end == start:
                # 自己参照は既に扱ったが念のため
                continue
            if end not in conn:
                report.append(f"未定義駅参照: '{start}' が '{end}' を参照していますが '{end}' は定義されていません.")
                if auto_fix:
                    conn[end] = [start]  # 新しいキーを作り reciprocal にする
                    report.append(f"  -> 新しい駅 '{end}' を作成し '{start}' を追加しました.")
            else:
                # end が start を参照しているか
                if start not in conn[end]:
                    report.append(f"相互リンク欠落: '{start}' -> '{end}' はあるが、'{end}' に '{start}' がありません.")
                    if auto_fix:
                        conn[end].append(start)
                        report.append(f"  -> '{end}' に '{start}' を追加しました.")
    # 最終的に各リストを整えて（重複削除・ソートは任意）
    for k in list(conn.keys()):
        # remove duplicates and keep stable order
        seen: Set[str] = set()
        new_list: List[str] = []
        for x in conn[k]:
            if x not in seen:
                seen.add(x)
                new_list.append(x)
        conn[k] = new_list

    # 要約
    if not report:
        report.append("検査完了: 問題は見つかりませんでした。")
    else:
        report.insert(0, f"検査結果: 問題 {len(report)} 件を検出しました。")

    # 保存オプション
    if auto_fix and save_to:
        try:
            with open(save_to, "w", encoding="utf-8") as f:
                json.dump(conn, f, ensure_ascii=False, indent=2)
            report.append(f"修正後データを '{save_to}' に保存しました。")
        except Exception as e:
            report.append(f"保存エラー: {e}")

    if verbose:
        for line in report:
            print(line)

    return conn, report

def print_all_sections(connections: Dict[str, List[str]]) -> None:
    """
    すべての区間（重複を除いた無向区間）を
    <option value="A - B">A - B</option> の形式で出力する。
    """
    printed_pairs: Set[Tuple[str, str]] = set()
    print("\nAll Sections:")
    for a, dests in connections.items():
        for b in dests:
            if a == b:
                continue
            pair = tuple(sorted((a, b)))  # 無向エッジとして一つにする
            if pair not in printed_pairs:
                print(f'<option value="{pair[0]} - {pair[1]}">{pair[0]} - {pair[1]}</option>')
                printed_pairs.add(pair)

# ==== 使用例 ====
if __name__ == "__main__":
    # 検査のみ（自動修正しない）
    fixed, report = validate_connections(station_connections, auto_fix=False, verbose=True)

    # 必要なら自動修正してファイルに保存:
    # fixed, report = validate_connections(station_connections, auto_fix=True, save_to="fixed_connections.json", verbose=True)

    # 最後に区間出力
    print_all_sections(fixed)
