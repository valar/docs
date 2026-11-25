# Scheduled invocations

Use `valar cron` to call a service on a cron schedule, with no external request needed.

## Setting a schedule

Add schedules to the `helloworld` service from [Creating a new service](getting-started/service-setup.md) with `valar cron set`:

```bash
# Trigger every 10 minutes
valar cron set every10 "*/10 * * * *"

# Trigger once an hour at /some-path
valar cron set everyHour "0 * * * *" --path /some-path

# Trigger once a day with a payload
valar cron set everyDay "0 0 * * *" --payload do-something
```

Each run sends an HTTP `POST` request to the path (default `/`) with any `--payload` you set. Timespecs use UTC, so `0 12 * * *` runs at 12:00 UTC. A new schedule first fires at its next matching time, not when you create it.

### Adjusting the timespec

When updating an existing schedule with `valar cron set`, only the schedule name is required. Omitted options keep their current values.

```bash
# Change everyDay to run once a day at 12:00 UTC
valar cron set everyDay "0 12 * * *"
```

### Enabling & disabling the schedule

Pass `--disabled` to stop a schedule from running without losing its timespec, path, or payload. When you re-enable the schedule, you do not have to pass those options again.

```bash
valar cron set --disabled everyDay
```

### Viewing all schedules

List all enabled and disabled schedules for the service with `valar cron list`:

```bash
valar cron list
```

```text
NAME      TIMESPEC       PATH       STATUS
every10   */10 *  * * *  /          enabled
everyHour 0    *  * * *  /some-path enabled
everyDay  0    12 * * *  /          disabled
```

## Inspecting a schedule

View a schedule's full configuration and the result of its last run with `valar cron inspect`:

```bash
valar cron inspect everyDay
```

```text
Name:      everyDay
Timespec:  0 12 * * *
Path:      /
Payload:   do-something
Status:    disabled
Last Run:
  Start:   2024-07-15 21:36:39.311204908 +0000 UTC
  End:     2024-07-15 21:36:39.780299232 +0000 UTC
  Status:  done
```

## Deleting a schedule

Delete a schedule permanently with `valar cron delete`. This removes the schedule and its invocation history.

```bash
valar cron delete everyDay
```

To manage schedules over HTTP or trigger a schedule manually, see [Schedules](api/schedules.md).
