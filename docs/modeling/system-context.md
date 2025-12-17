# システム関連図

システム全体の構成とアクターの関係を示します。

```mermaid
flowchart TB
    subgraph Actors[アクター]
        Student[👨‍🎓 生徒]
        Instructor[👩‍🍳 講師]
        Staff[👔 運営スタッフ]
    end

    subgraph System[クッキングラボ予約システム]
        subgraph Frontend[フロントエンド]
            WebUI[🖥️ Web UI<br/>Next.js 14]
        end

        subgraph Backend[バックエンド]
            API[⚙️ REST API<br/>Laravel 11]

            subgraph Domains[ドメイン]
                LessonDomain[📚 レッスン管理]
                ReservationDomain[📅 予約管理]
                TicketDomain[🎫 チケット管理]
                StudentDomain[👤 生徒管理]
            end
        end

        subgraph DataStore[データストア]
            DB[(🗄️ MySQL 8.0)]
        end
    end

    subgraph External[外部システム]
        Payment[💳 決済システム<br/>※将来実装]
    end

    %% アクターとフロントエンドの関係
    Student -->|レッスン検索<br/>予約・キャンセル<br/>チケット購入| WebUI
    Instructor -->|レッスン開始<br/>出席管理| WebUI
    Staff -->|レッスン登録<br/>スケジュール管理<br/>全体管理| WebUI

    %% フロントエンドとバックエンドの関係
    WebUI <-->|HTTP/JSON| API

    %% APIとドメインの関係
    API --> LessonDomain
    API --> ReservationDomain
    API --> TicketDomain
    API --> StudentDomain

    %% ドメインとDBの関係
    LessonDomain --> DB
    ReservationDomain --> DB
    TicketDomain --> DB
    StudentDomain --> DB

    %% 外部システムとの関係
    TicketDomain -.->|※将来連携| Payment

    %% スタイリング
    classDef actorStyle fill:#e1f5fe,stroke:#01579b,stroke-width:2px
    classDef frontendStyle fill:#fff3e0,stroke:#e65100,stroke-width:2px
    classDef backendStyle fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    classDef domainStyle fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    classDef dataStyle fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    classDef externalStyle fill:#eceff1,stroke:#546e7a,stroke-width:2px,stroke-dasharray: 5 5

    class Student,Instructor,Staff actorStyle
    class WebUI frontendStyle
    class API backendStyle
    class LessonDomain,ReservationDomain,TicketDomain,StudentDomain domainStyle
    class DB dataStyle
    class Payment externalStyle
```

## 構成要素の説明

| 要素 | 説明 |
|------|------|
| **Web UI** | 生徒・講師・運営スタッフが利用するWebアプリケーション |
| **REST API** | フロントエンドからのリクエストを処理するバックエンドAPI |
| **レッスン管理** | レッスン・スケジュールの登録・更新・削除を担当 |
| **予約管理** | 予約の作成・キャンセル・出席管理を担当 |
| **チケット管理** | チケットの購入・消費・有効期限管理を担当 |
| **生徒管理** | 生徒情報・ペナルティポイント管理を担当 |
| **MySQL** | 全てのデータを永続化するリレーショナルデータベース |
| **決済システム** | チケット購入時の決済処理（将来実装予定） |

## アクターの役割

### 生徒
- レッスンの検索・閲覧
- スケジュールへの予約・キャンセル
- チケットの購入・残高確認

### 講師
- 担当レッスンの確認
- レッスンの開始操作
- 出席・欠席の記録

### 運営スタッフ
- レッスンの登録・編集・削除
- スケジュールの設定
- 講師のアサイン
- 全体の管理・監視
