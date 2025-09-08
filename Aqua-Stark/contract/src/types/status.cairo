#[derive(Serde, Copy, Drop, Introspect, PartialEq)]
pub enum Status {
    NotStarted,
    InProgress,
    Completed,
    Failed,
}

pub impl StatusIntoFelt252 of Into<Status, felt252> {
    fn into(self: Status) -> felt252 {
        match self {
            Status::NotStarted => 0,
            Status::InProgress => 1,
            Status::Completed => 2,
            Status::Failed => 3,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::{Status, StatusIntoFelt252};

    #[test]
    fn test_mission_status_into_felt252() {
        let not_started = Status::NotStarted;
        let in_progress = Status::InProgress;
        let completed = Status::Completed;
        let failed = Status::Failed;

        assert_eq!(not_started.into(), 0, "NotStarted should convert to 0");
        assert_eq!(in_progress.into(), 1, "InProgress should convert to 1");
        assert_eq!(completed.into(), 2, "Completed should convert to 2");
        assert_eq!(failed.into(), 3, "Failed should convert to 3");
    }
}
