# オブジェクト図

ドメインモデルの具体的なインスタンス例を示します。

## シナリオ1: レッスン予約

生徒「山田太郎」が「基本の和食」レッスンの1月15日開催スケジュールを予約するシナリオ。

### 予約前の状態

```mermaid
flowchart TB
    subgraph Student集約
        student1[/"🧑 student1: Student
        ―――――――――――
        id: STU-001
        name: 山田太郎
        email: yamada@example.com
        penaltyPoint: 0
        suspendedUntil: null"/]
    end

    subgraph Ticket集約
        ticket1[/"🎫 ticket1: Ticket
        ―――――――――――
        id: TKT-001
        studentId: STU-001
        plan: 5枚プラン
        remainingCount: 3
        purchasedAt: 2024-12-01
        expiresAt: 2025-06-01"/]
    end

    subgraph Lesson集約
        lesson1[/"📚 lesson1: Lesson
        ―――――――――――
        id: LES-001
        title: 基本の和食
        category: 和食
        difficulty: 初級"/]

        schedule1[/"📅 schedule1: Schedule
        ―――――――――――
        id: SCH-001
        startAt: 2025-01-15 10:00
        endAt: 2025-01-15 12:00
        capacity: 6
        instructorId: INS-001
        status: 予約受付中
        reservationCount: 2"/]
    end

    subgraph Instructor集約
        instructor1[/"👩‍🍳 instructor1: Instructor
        ―――――――――――
        id: INS-001
        name: 佐藤花子
        specialties: [和食, 洋食]"/]
    end

    lesson1 -->|contains| schedule1
    schedule1 -.->|instructorId| instructor1
    ticket1 -.->|studentId| student1
```

### 予約後の状態

```mermaid
flowchart TB
    subgraph Student集約
        student1[/"🧑 student1: Student
        ―――――――――――
        id: STU-001
        name: 山田太郎
        penaltyPoint: 0"/]
    end

    subgraph Ticket集約
        ticket1[/"🎫 ticket1: Ticket
        ―――――――――――
        id: TKT-001
        studentId: STU-001
        remainingCount: 2 ⬅️ 3→2
        expiresAt: 2025-06-01"/]
    end

    subgraph Lesson集約
        schedule1[/"📅 schedule1: Schedule
        ―――――――――――
        id: SCH-001
        capacity: 6
        reservationCount: 3 ⬅️ 2→3"/]
    end

    subgraph Reservation集約
        reservation1[/"📝 reservation1: Reservation
        ―――――――――――
        id: RSV-001
        studentId: STU-001
        scheduleId: SCH-001
        ticketId: TKT-001
        status: 予約済み
        reservedAt: 2025-01-10 15:30"/]
    end

    reservation1 -.->|studentId| student1
    reservation1 -.->|scheduleId| schedule1
    reservation1 -.->|ticketId| ticket1

    style reservation1 fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
    style ticket1 fill:#fff9c4,stroke:#f9a825,stroke-width:2px
    style schedule1 fill:#fff9c4,stroke:#f9a825,stroke-width:2px
```

**変更点**:
| オブジェクト | 属性 | 変更前 | 変更後 |
|-------------|------|--------|--------|
| ticket1 | remainingCount | 3 | 2 |
| schedule1 | reservationCount | 2 | 3 |
| reservation1 | - | (新規作成) | 予約済み |

---

## シナリオ2: 予約キャンセル

生徒「山田太郎」が予約をキャンセルするシナリオ（開催24時間前まで）。

### キャンセル後の状態

```mermaid
flowchart TB
    subgraph Ticket集約
        ticket1[/"🎫 ticket1: Ticket
        ―――――――――――
        id: TKT-001
        remainingCount: 3 ⬅️ 2→3（返却）"/]
    end

    subgraph Lesson集約
        schedule1[/"📅 schedule1: Schedule
        ―――――――――――
        id: SCH-001
        reservationCount: 2 ⬅️ 3→2"/]
    end

    subgraph Reservation集約
        reservation1[/"📝 reservation1: Reservation
        ―――――――――――
        id: RSV-001
        status: キャンセル済み ⬅️
        cancelledAt: 2025-01-14 09:00"/]
    end

    reservation1 -.->|scheduleId| schedule1
    reservation1 -.->|ticketId| ticket1

    style reservation1 fill:#ffcdd2,stroke:#c62828,stroke-width:3px
    style ticket1 fill:#c8e6c9,stroke:#2e7d32,stroke-width:2px
```

**変更点**:
| オブジェクト | 属性 | 変更前 | 変更後 |
|-------------|------|--------|--------|
| reservation1 | status | 予約済み | キャンセル済み |
| reservation1 | cancelledAt | null | 2025-01-14 09:00 |
| ticket1 | remainingCount | 2 | 3（返却） |
| schedule1 | reservationCount | 3 | 2 |

---

## シナリオ3: 出欠記録（出席）

講師「佐藤花子」がレッスン終了後、生徒「山田太郎」に出席を記録するシナリオ。

```mermaid
flowchart TB
    subgraph Lesson集約
        schedule1[/"📅 schedule1: Schedule
        ―――――――――――
        id: SCH-001
        status: 終了 ⬅️ 進行中→終了"/]
    end

    subgraph Reservation集約
        reservation1[/"📝 reservation1: Reservation
        ―――――――――――
        id: RSV-001
        studentId: STU-001
        scheduleId: SCH-001
        status: 出席 ⬅️ 予約済み→出席"/]
    end

    subgraph Student集約
        student1[/"🧑 student1: Student
        ―――――――――――
        id: STU-001
        penaltyPoint: 0（変更なし）"/]
    end

    reservation1 -.->|studentId| student1
    reservation1 -.->|scheduleId| schedule1

    style reservation1 fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
```

---

## シナリオ4: 出欠記録（無断欠席）

生徒「鈴木次郎」が無断欠席し、ペナルティが付与されるシナリオ。

### 欠席記録前

```mermaid
flowchart TB
    subgraph Student集約
        student2[/"🧑 student2: Student
        ―――――――――――
        id: STU-002
        name: 鈴木次郎
        penaltyPoint: 2
        suspendedUntil: null"/]
    end

    subgraph Reservation集約
        reservation2[/"📝 reservation2: Reservation
        ―――――――――――
        id: RSV-002
        studentId: STU-002
        scheduleId: SCH-001
        status: 予約済み"/]
    end

    reservation2 -.->|studentId| student2
```

### 欠席記録後（ペナルティ3点到達 → 予約停止）

```mermaid
flowchart TB
    subgraph Student集約
        student2[/"🧑 student2: Student
        ―――――――――――
        id: STU-002
        name: 鈴木次郎
        penaltyPoint: 3 ⬅️ 2→3
        suspendedUntil: 2025-02-15 ⬅️ 1ヶ月停止"/]
    end

    subgraph Reservation集約
        reservation2[/"📝 reservation2: Reservation
        ―――――――――――
        id: RSV-002
        status: 欠席 ⬅️ 予約済み→欠席"/]
    end

    reservation2 -.->|studentId| student2

    style student2 fill:#ffcdd2,stroke:#c62828,stroke-width:3px
    style reservation2 fill:#ffcdd2,stroke:#c62828,stroke-width:2px
```

**変更点**:
| オブジェクト | 属性 | 変更前 | 変更後 |
|-------------|------|--------|--------|
| reservation2 | status | 予約済み | 欠席 |
| student2 | penaltyPoint | 2 | 3 |
| student2 | suspendedUntil | null | 2025-02-15（1ヶ月後） |

---

## シナリオ5: チケット購入

生徒「田中三郎」が10枚プランのチケットを購入するシナリオ。

### 購入前

```mermaid
flowchart TB
    subgraph Student集約
        student3[/"🧑 student3: Student
        ―――――――――――
        id: STU-003
        name: 田中三郎"/]
    end

    subgraph Ticket集約
        ticket2[/"🎫 ticket2: Ticket
        ―――――――――――
        id: TKT-002
        studentId: STU-003
        plan: 5枚プラン
        remainingCount: 1
        expiresAt: 2025-02-01"/]
    end

    ticket2 -.->|studentId| student3
```

### 購入後

```mermaid
flowchart TB
    subgraph Student集約
        student3[/"🧑 student3: Student
        ―――――――――――
        id: STU-003
        name: 田中三郎"/]
    end

    subgraph Ticket集約
        ticket2[/"🎫 ticket2: Ticket（既存）
        ―――――――――――
        id: TKT-002
        remainingCount: 1
        expiresAt: 2025-02-01"/]

        ticket3[/"🎫 ticket3: Ticket（新規）
        ―――――――――――
        id: TKT-003
        studentId: STU-003
        plan: 10枚プラン
        remainingCount: 10
        purchasedAt: 2025-01-10
        expiresAt: 2025-07-10"/]
    end

    ticket2 -.->|studentId| student3
    ticket3 -.->|studentId| student3

    style ticket3 fill:#c8e6c9,stroke:#2e7d32,stroke-width:3px
```

**ポイント**: チケットはFIFO消費のため、ticket2（有効期限が近い）から先に消費される。

---

## 全体オブジェクト図（サンプルデータ）

システム全体のサンプルデータ構成。

```mermaid
flowchart TB
    subgraph Students[生徒]
        s1[/"STU-001: 山田太郎
        penalty: 0"/]
        s2[/"STU-002: 鈴木次郎
        penalty: 3 🚫"/]
        s3[/"STU-003: 田中三郎
        penalty: 0"/]
    end

    subgraph Instructors[講師]
        i1[/"INS-001: 佐藤花子
        [和食, 洋食]"/]
        i2[/"INS-002: 高橋一郎
        [中華, お菓子]"/]
    end

    subgraph Lessons[レッスン]
        l1[/"LES-001: 基本の和食
        和食 / 初級"/]
        l2[/"LES-002: 本格中華
        中華 / 中級"/]
    end

    subgraph Schedules[スケジュール]
        sch1[/"SCH-001: 1/15 10:00
        定員6 / 予約3"/]
        sch2[/"SCH-002: 1/20 14:00
        定員4 / 予約4 🈵"/]
    end

    subgraph Tickets[チケット]
        t1[/"TKT-001: 山田太郎
        残2枚 / 〜6/1"/]
        t2[/"TKT-002: 田中三郎
        残1枚 / 〜2/1"/]
        t3[/"TKT-003: 田中三郎
        残10枚 / 〜7/10"/]
    end

    subgraph Reservations[予約]
        r1[/"RSV-001: 山田→SCH-001
        予約済み"/]
        r2[/"RSV-002: 鈴木→SCH-001
        欠席"/]
        r3[/"RSV-003: 田中→SCH-002
        予約済み"/]
    end

    l1 --> sch1
    l2 --> sch2
    sch1 -.-> i1
    sch2 -.-> i2

    r1 -.-> s1
    r1 -.-> sch1
    r2 -.-> s2
    r2 -.-> sch1
    r3 -.-> s3
    r3 -.-> sch2

    t1 -.-> s1
    t2 -.-> s3
    t3 -.-> s3
```

## サンプルデータ一覧

### 生徒

| ID | 名前 | ペナルティ | 停止期限 |
|----|------|-----------|---------|
| STU-001 | 山田太郎 | 0 | - |
| STU-002 | 鈴木次郎 | 3 | 2025-02-15 |
| STU-003 | 田中三郎 | 0 | - |

### 講師

| ID | 名前 | 専門 |
|----|------|------|
| INS-001 | 佐藤花子 | 和食, 洋食 |
| INS-002 | 高橋一郎 | 中華, お菓子 |

### レッスン

| ID | タイトル | カテゴリ | 難易度 |
|----|---------|---------|--------|
| LES-001 | 基本の和食 | 和食 | 初級 |
| LES-002 | 本格中華 | 中華 | 中級 |

### スケジュール

| ID | レッスン | 開催日時 | 定員 | 予約数 | 講師 |
|----|---------|---------|------|--------|------|
| SCH-001 | LES-001 | 2025-01-15 10:00 | 6 | 3 | INS-001 |
| SCH-002 | LES-002 | 2025-01-20 14:00 | 4 | 4 | INS-002 |

### チケット

| ID | 生徒 | プラン | 残数 | 有効期限 |
|----|------|--------|------|---------|
| TKT-001 | STU-001 | 5枚 | 2 | 2025-06-01 |
| TKT-002 | STU-003 | 5枚 | 1 | 2025-02-01 |
| TKT-003 | STU-003 | 10枚 | 10 | 2025-07-10 |

### 予約

| ID | 生徒 | スケジュール | チケット | 状態 |
|----|------|-------------|---------|------|
| RSV-001 | STU-001 | SCH-001 | TKT-001 | 予約済み |
| RSV-002 | STU-002 | SCH-001 | - | 欠席 |
| RSV-003 | STU-003 | SCH-002 | TKT-002 | 予約済み |
