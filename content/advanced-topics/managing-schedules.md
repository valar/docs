# Scheduled invocations

Sometimes, you will need to trigger something in your service automatically, without any external input. Valar provides this functionality through a `cron`-like interface.

## Setting a schedule

To add a schedule for the `helloworld` service created in the *Getting Started* codelab, you will use the `valar cron set` command.

```bash
# To create a schedule that triggers every 10 minutes.
$ valar cron set every10 "*/10 * * * *"
# To create a schedule that triggers once an hour and requests /some-path.
$ valar cron set everyHour "0 * * * *" --path /some-path
# To create a schedule that triggers once a day and sends a payload.
$ valar cron set everyDay "0 0 * * *" --payload do-something
```

The schedule above will trigger an invocation of the `helloworld` service by sending a `POST /` HTTP request every 10 minutes.

### Adjusting the timespec

In case you're not satisfied with your invocation schedule, you may adjust the timespec using a variant of the set command. If a schedule has already been specified, all arguments except for the schedule name are considered *optional*.

```bash
# Force the schedule to only trigger once a day at noon.
$ valar cron set everyDay "0 12 * * *"
```

### Enabling & disabling the schedule

The set command can also be used to disable a schedule. This is useful for temporarily enabling or disabling a schedule, eliminating the need to re-specify timespec, path and payload when re-enabling it.

```bash
# Disable the schedule. This will prevent it from triggering.
$ valar cron set --disabled everyDay
```

### Viewing all schedules

To get a quick overview of the set of enabled & disabled schedules for a service, you can use the `list` subcommand.

```bash
$ valar cron list
NAME      TIMESPEC       PATH       STATUS
every10   */10 *  * * *  /          enabled
everyHour 0    *  * * *  /some-path enabled
everyDay  0    12 * * *  /          disabled
```

## Inspecting a schedule

The `cron` subsystem also supports inspecting a schedule for a more detailed view including the result of the last triggered run.

```bash
$ valar cron inspect everyDay
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

When a schedule is permanently not needed anymore, it can be removed and fully dropped from the `cron` subsystem. 
When executing this command, all details related to this schedule, including its invocation history, are pruned.

```bash
$ valar cron delete everyDay
```
