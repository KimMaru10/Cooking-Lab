# ドメインモデル図

DDDに基づいたドメインモデルの構造を示します。

## 全体ドメインモデル図

```mermaid
classDiagram
    direction TB

    %% ========== Lesson集約 ==========
    namespace Lesson集約 {
        class Lesson {
            <<AggregateRoot>>
            +LessonId id
            +Title title
            +Description description
            +Category category
            +Difficulty difficulty
            +List~Schedule~ schedules
            +addSchedule(schedule)
            +removeSchedule(scheduleId)
        }

        class Schedule {
            <<Entity>>
            +ScheduleId id
            +DateTime startAt
            +DateTime endAt
            +Capacity capacity
            +InstructorId instructorId
            +ScheduleStatus status
            +isFull() bool
            +canStart() bool
            +start()
        }

        class Category {
            <<ValueObject>>
            +String value
            和食
            洋食
            中華
            お菓子
        }

        class Difficulty {
            <<ValueObject>>
            +String value
            初級
            中級
            上級
        }

        class Capacity {
            <<ValueObject>>
            +int value
            +validate() 1~8名
        }

        class ScheduleStatus {
            <<ValueObject>>
            予約受付中
            進行中
            終了
            キャンセル
        }
    }

    Lesson "1" *-- "0..*" Schedule : contains
    Lesson *-- Category
    Lesson *-- Difficulty
    Schedule *-- Capacity
    Schedule *-- ScheduleStatus

    %% ========== Reservation集約 ==========
    namespace Reservation集約 {
        class Reservation {
            <<AggregateRoot>>
            +ReservationId id
            +StudentId studentId
            +ScheduleId scheduleId
            +TicketId ticketId
            +ReservationStatus status
            +DateTime reservedAt
            +cancel()
            +markAttended()
            +markAbsent()
        }

        class ReservationStatus {
            <<ValueObject>>
            予約済み
            キャンセル済み
            出席
            欠席
        }
    }

    Reservation *-- ReservationStatus

    %% ========== Student集約 ==========
    namespace Student集約 {
        class Student {
            <<AggregateRoot>>
            +StudentId id
            +Name name
            +Email email
            +PenaltyPoint penaltyPoint
            +DateTime? suspendedUntil
            +addPenalty()
            +canReserve() bool
            +isSuspended() bool
        }

        class PenaltyPoint {
            <<ValueObject>>
            +int value
            +isOverLimit() bool
            上限: 3点
        }
    }

    Student *-- PenaltyPoint

    %% ========== Ticket集約 ==========
    namespace Ticket集約 {
        class Ticket {
            <<AggregateRoot>>
            +TicketId id
            +StudentId studentId
            +TicketPlan plan
            +int remainingCount
            +DateTime purchasedAt
            +DateTime expiresAt
            +consume()
            +refund()
            +isExpired() bool
            +isAvailable() bool
        }

        class TicketPlan {
            <<ValueObject>>
            +int count
            +int price
            1枚プラン
            5枚プラン
            10枚プラン
        }
    }

    Ticket *-- TicketPlan

    %% ========== Instructor集約 ==========
    namespace Instructor集約 {
        class Instructor {
            <<AggregateRoot>>
            +InstructorId id
            +Name name
            +Email email
            +Specialties specialties
        }
    }

    %% ========== Staff集約 ==========
    namespace Staff集約 {
        class Staff {
            <<AggregateRoot>>
            +StaffId id
            +Name name
            +Email email
            +Role role
        }
    }

    %% ========== 集約間の関係（参照のみ） ==========
    Schedule ..> Instructor : instructorId
    Reservation ..> Student : studentId
    Reservation ..> Schedule : scheduleId
    Reservation ..> Ticket : ticketId
    Ticket ..> Student : studentId
```

## 集約の説明

### Lesson集約（レッスン）

レッスンとそのスケジュールを管理する集約。

```mermaid
classDiagram
    class Lesson {
        <<AggregateRoot>>
        -LessonId id
        -Title title
        -Description description
        -Category category
        -Difficulty difficulty
        -List~Schedule~ schedules
        +addSchedule(schedule)
        +removeSchedule(scheduleId)
        +updateInfo(title, description, category, difficulty)
    }

    class Schedule {
        <<Entity>>
        -ScheduleId id
        -DateTime startAt
        -DateTime endAt
        -Capacity capacity
        -InstructorId instructorId
        -ScheduleStatus status
        -int reservationCount
        +isFull() bool
        +canStart() bool
        +start()
        +complete()
        +incrementReservation()
        +decrementReservation()
    }

    Lesson "1" *-- "0..*" Schedule
```

| 要素 | 種類 | 説明 |
|------|------|------|
| Lesson | 集約ルート | レッスンの基本情報を保持 |
| Schedule | エンティティ | 開催日程・定員・講師を保持 |
| Category | 値オブジェクト | 和食/洋食/中華/お菓子 |
| Difficulty | 値オブジェクト | 初級/中級/上級 |
| Capacity | 値オブジェクト | 定員（1〜8名） |

### Reservation集約（予約）

生徒のレッスン予約を管理する集約。

```mermaid
classDiagram
    class Reservation {
        <<AggregateRoot>>
        -ReservationId id
        -StudentId studentId
        -ScheduleId scheduleId
        -TicketId ticketId
        -ReservationStatus status
        -DateTime reservedAt
        -DateTime? cancelledAt
        +cancel()
        +markAttended()
        +markAbsent()
        +canCancel() bool
    }
```

| 要素 | 種類 | 説明 |
|------|------|------|
| Reservation | 集約ルート | 予約情報と状態を保持 |
| ReservationStatus | 値オブジェクト | 予約済み/キャンセル済み/出席/欠席 |

**ビジネスルール**:
- 開催24時間前までキャンセル可能
- 同一スケジュールへの重複予約不可

### Student集約（生徒）

生徒情報とペナルティを管理する集約。

```mermaid
classDiagram
    class Student {
        <<AggregateRoot>>
        -StudentId id
        -Name name
        -Email email
        -PenaltyPoint penaltyPoint
        -DateTime? suspendedUntil
        +addPenalty()
        +resetPenalty()
        +suspend(until)
        +canReserve() bool
        +isSuspended() bool
    }

    class PenaltyPoint {
        <<ValueObject>>
        -int value
        +increment() PenaltyPoint
        +isOverLimit() bool
    }

    Student *-- PenaltyPoint
```

| 要素 | 種類 | 説明 |
|------|------|------|
| Student | 集約ルート | 生徒の基本情報を保持 |
| PenaltyPoint | 値オブジェクト | ペナルティポイント（上限3点） |

**ビジネスルール**:
- ペナルティ3点で1ヶ月間予約停止

### Ticket集約（チケット）

チケットの購入・消費を管理する集約。

```mermaid
classDiagram
    class Ticket {
        <<AggregateRoot>>
        -TicketId id
        -StudentId studentId
        -TicketPlan plan
        -int remainingCount
        -DateTime purchasedAt
        -DateTime expiresAt
        +consume()
        +refund()
        +isExpired() bool
        +isAvailable() bool
        +getRemainingDays() int
    }

    class TicketPlan {
        <<ValueObject>>
        -PlanType type
        -int count
        -int price
    }

    Ticket *-- TicketPlan
```

| 要素 | 種類 | 説明 |
|------|------|------|
| Ticket | 集約ルート | チケットの残数・有効期限を保持 |
| TicketPlan | 値オブジェクト | 1枚/5枚/10枚プラン |

**ビジネスルール**:
- 有効期限: 購入日から6ヶ月
- 消費順序: FIFO（有効期限が近いものから）

### Instructor集約（講師）

講師情報を管理する集約。

```mermaid
classDiagram
    class Instructor {
        <<AggregateRoot>>
        -InstructorId id
        -Name name
        -Email email
        -List~Category~ specialties
        +addSpecialty(category)
        +removeSpecialty(category)
    }
```

### Staff集約（運営スタッフ）

運営スタッフ情報を管理する集約。

```mermaid
classDiagram
    class Staff {
        <<AggregateRoot>>
        -StaffId id
        -Name name
        -Email email
        -Role role
    }
```

## 共有カーネル（Shared Kernel）

複数の集約で共有される値オブジェクト。

```mermaid
classDiagram
    class Id {
        <<ValueObject>>
        -String value
        +equals(other) bool
        +toString() String
    }

    class Email {
        <<ValueObject>>
        -String value
        +validate()
    }

    class Name {
        <<ValueObject>>
        -String firstName
        -String lastName
        +fullName() String
    }

    class DateTime {
        <<ValueObject>>
        -Date value
        +isBefore(other) bool
        +isAfter(other) bool
        +addMonths(n) DateTime
    }
```

## 集約間の関係

```mermaid
flowchart LR
    subgraph 集約
        Lesson[Lesson集約]
        Reservation[Reservation集約]
        Student[Student集約]
        Ticket[Ticket集約]
        Instructor[Instructor集約]
    end

    Reservation -.->|studentId| Student
    Reservation -.->|scheduleId| Lesson
    Reservation -.->|ticketId| Ticket
    Lesson -.->|instructorId| Instructor
    Ticket -.->|studentId| Student

    style Lesson fill:#e3f2fd
    style Reservation fill:#fff3e0
    style Student fill:#e8f5e9
    style Ticket fill:#fce4ec
    style Instructor fill:#f3e5f5
```

**注意**: 集約間はIDによる参照のみ。直接オブジェクト参照は行わない。

## ドメインサービス

集約をまたぐビジネスロジックはドメインサービスで実装。

| サービス | 責務 |
|---------|------|
| ReservationService | 予約作成時のチケット消費・定員チェック・重複チェック |
| TicketConsumptionService | FIFO順でのチケット選択・消費 |
| AttendanceService | 出欠記録・ペナルティ付与 |
