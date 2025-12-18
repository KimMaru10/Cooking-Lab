# ユースケース図

アクターごとのシステム利用シナリオを示します。

## 全体ユースケース図

```mermaid
flowchart LR
    subgraph Actors[アクター]
        Student[👨‍🎓 生徒]
        Instructor[👩‍🍳 講師]
        Staff[👔 運営スタッフ]
    end

    subgraph System[クッキングラボ予約システム]
        subgraph StudentUC[生徒のユースケース]
            UC1[レッスンを検索する]
            UC2[レッスン詳細を閲覧する]
            UC3[スケジュールを予約する]
            UC4[予約をキャンセルする]
            UC5[チケットを購入する]
            UC6[チケット残高を確認する]
            UC7[予約履歴を確認する]
        end

        subgraph InstructorUC[講師のユースケース]
            UC8[担当レッスンを確認する]
            UC9[レッスンを開始する]
            UC10[出席を記録する]
            UC11[欠席を記録する]
        end

        subgraph StaffUC[運営スタッフのユースケース]
            UC12[レッスンを登録する]
            UC13[レッスンを編集する]
            UC14[スケジュールを設定する]
            UC15[講師をアサインする]
            UC16[予約状況を管理する]
        end
    end

    %% 生徒のユースケース
    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7

    %% 講師のユースケース
    Instructor --> UC8
    Instructor --> UC9
    Instructor --> UC10
    Instructor --> UC11

    %% 運営スタッフのユースケース
    Staff --> UC12
    Staff --> UC13
    Staff --> UC14
    Staff --> UC15
    Staff --> UC16

    %% スタイリング
    classDef studentStyle fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef instructorStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef staffStyle fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px

    class UC1,UC2,UC3,UC4,UC5,UC6,UC7 studentStyle
    class UC8,UC9,UC10,UC11 instructorStyle
    class UC12,UC13,UC14,UC15,UC16 staffStyle
```

## アクター別ユースケース詳細

### 生徒

```mermaid
flowchart TB
    Student[👨‍🎓 生徒]

    subgraph レッスン関連
        UC1[レッスンを検索する]
        UC2[レッスン詳細を閲覧する]
    end

    subgraph 予約関連
        UC3[スケジュールを予約する]
        UC4[予約をキャンセルする]
        UC7[予約履歴を確認する]
    end

    subgraph チケット関連
        UC5[チケットを購入する]
        UC6[チケット残高を確認する]
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5
    Student --> UC6
    Student --> UC7

    UC1 -.->|include| UC2
    UC3 -.->|include| UC6
```

| ユースケース | 説明 | 事前条件 | 事後条件 |
|-------------|------|----------|----------|
| レッスンを検索する | カテゴリ・難易度・日程でレッスンを検索 | ログイン済み | - |
| レッスン詳細を閲覧する | レッスン内容・スケジュール・空き状況を確認 | - | - |
| スケジュールを予約する | 希望のスケジュールを選んで予約 | チケット1枚以上保有、定員に空きあり | チケット1枚消費 |
| 予約をキャンセルする | 予約済みスケジュールをキャンセル | 開催24時間前まで | チケット1枚返却 |
| チケットを購入する | 1枚/5枚/10枚プランから購入 | ログイン済み | チケット追加（有効期限6ヶ月） |
| チケット残高を確認する | 保有チケット数と有効期限を確認 | ログイン済み | - |
| 予約履歴を確認する | 過去・未来の予約一覧を表示 | ログイン済み | - |

### 講師

```mermaid
flowchart TB
    Instructor[👩‍🍳 講師]

    subgraph レッスン確認
        UC8[担当レッスンを確認する]
    end

    subgraph レッスン実施
        UC9[レッスンを開始する]
        UC10[出席を記録する]
        UC11[欠席を記録する]
    end

    Instructor --> UC8
    Instructor --> UC9
    Instructor --> UC10
    Instructor --> UC11

    UC9 -.->|include| UC10
    UC9 -.->|include| UC11
    UC11 -.->|extend| UC11a[ペナルティを付与する]
```

| ユースケース | 説明 | 事前条件 | 事後条件 |
|-------------|------|----------|----------|
| 担当レッスンを確認する | 自分がアサインされたスケジュール一覧を表示 | ログイン済み | - |
| レッスンを開始する | 開催時刻以降にレッスンを開始状態にする | 開催時刻到達 | レッスン状態が「進行中」に |
| 出席を記録する | 参加した生徒に出席をつける | レッスン開始後 | 予約ステータスが「出席」に |
| 欠席を記録する | 無断欠席の生徒に欠席をつける | レッスン開始後 | ペナルティポイント+1 |

### 運営スタッフ

```mermaid
flowchart TB
    Staff[👔 運営スタッフ]

    subgraph レッスン管理
        UC12[レッスンを登録する]
        UC13[レッスンを編集する]
    end

    subgraph スケジュール管理
        UC14[スケジュールを設定する]
        UC15[講師をアサインする]
    end

    subgraph 運営管理
        UC16[予約状況を管理する]
    end

    Staff --> UC12
    Staff --> UC13
    Staff --> UC14
    Staff --> UC15
    Staff --> UC16

    UC12 -.->|include| UC14
    UC14 -.->|include| UC15
```

| ユースケース | 説明 | 事前条件 | 事後条件 |
|-------------|------|----------|----------|
| レッスンを登録する | 新規レッスン（タイトル・カテゴリ・難易度・内容）を登録 | ログイン済み | レッスンが作成される |
| レッスンを編集する | 既存レッスンの情報を更新 | レッスンが存在 | レッスン情報が更新される |
| スケジュールを設定する | レッスンに開催日程・定員（1〜8名）を設定 | レッスンが存在 | スケジュールが作成される |
| 講師をアサインする | スケジュールに講師を割り当てる | スケジュールが存在 | 講師がアサインされる |
| 予約状況を管理する | 全スケジュールの予約状況を確認・管理 | ログイン済み | - |

## ビジネスルールとの関連

| ユースケース | 関連するビジネスルール |
|-------------|----------------------|
| スケジュールを予約する | チケット消費（FIFO）、定員チェック、重複予約禁止、ペナルティ停止チェック |
| 予約をキャンセルする | 24時間前までキャンセル可、チケット返却 |
| チケットを購入する | 有効期限6ヶ月 |
| 欠席を記録する | ペナルティポイント+1、3点で1ヶ月予約停止 |
| スケジュールを設定する | 定員1〜8名 |
