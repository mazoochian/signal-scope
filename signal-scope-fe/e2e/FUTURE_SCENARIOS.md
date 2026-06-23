# Future Test Scenarios — Unimplemented Features

These scenarios document expected behavior for features currently marked TODO.
Update assumptions when the feature is implemented and adjust selectors accordingly.

---

## Feature: Configuration — Approve & Push

**Status**: Not implemented (TODO in `app/configuration/page.tsx` — "Approve & push" button)  
**Assumption**: Clicking "Approve & push" sends the diff to the backend, which applies the config change to the target device. A success toast appears. The diff viewer is cleared or shows the next pending diff.

**Test scenarios**:
- Scenario: Approve button triggers config push | Given diff is shown, When I click "Approve & push", Then a loading state appears, Then a success notification shows "Config pushed to core-sw-01"
- Scenario: Push fails with error | Given diff is shown, When the backend returns 500, Then an error message appears inline
- Scenario: Diff clears after approval | Given approval succeeds, Then the diff panel shows "No pending changes" or loads next diff

---

## Feature: Configuration — Request Review

**Status**: Not implemented (TODO in `app/configuration/page.tsx`)  
**Assumption**: Opens a modal or sends a review request to a configured reviewer (Slack/email). Review request includes diff context.

**Test scenarios**:
- Scenario: Request review opens modal | Given diff is shown, When I click "Request review", Then a modal appears with reviewer selector and optional comment field
- Scenario: Review request submitted | Given modal is open with reviewer selected, When I click "Submit", Then the modal closes and a "Review requested" toast appears

---

## Feature: Configuration — Reject

**Status**: Not implemented (TODO in `app/configuration/page.tsx`)  
**Assumption**: Discards the current pending diff and logs a rejection with optional reason.

**Test scenarios**:
- Scenario: Reject with confirmation | Given diff is shown, When I click "Reject", Then a confirmation dialog appears asking for reason
- Scenario: Diff discarded after rejection | Given I confirm rejection, Then diff panel shows next pending change or "No pending changes"

---

## Feature: Configuration — Version History Browser

**Status**: Not implemented (TODO in `app/configuration/page.tsx` — "Version history" button)  
**Assumption**: Opens a panel or page listing past config versions for a selected device, with ability to diff any two versions.

**Test scenarios**:
- Scenario: Version history opens | Given I click "Version history", Then a side panel or modal appears with a list of past backup versions
- Scenario: Select two versions to diff | Given history panel is open, When I select version N and version N-1, Then a diff view shows the delta between them
- Scenario: Restore from version | Given a past version is selected, When I click "Restore", Then a confirmation appears before any push action

---

## Feature: Configuration — Backup All

**Status**: Not implemented (TODO in `app/configuration/page.tsx` — "Backup all" button)  
**Assumption**: Triggers SSH/NETCONF backup of all devices in the backup status list. Progress indicator shown.

**Test scenarios**:
- Scenario: Backup all triggers job | Given I click "Backup all", Then each device row shows a spinner/progress indicator
- Scenario: Backup completes | Given backup runs, Then each device row updates "last" time to "just now" and version count increments

---

## Feature: Configuration — Side-by-side Diff View

**Status**: Not implemented (TODO in `app/configuration/page.tsx`)  
**Assumption**: Toggling a "Side-by-side" view shows old config on the left, new config on the right, with removed lines highlighted red on left and added lines green on right.

**Test scenarios**:
- Scenario: Toggle side-by-side | Given diff is shown in unified view, When I click "Side-by-side", Then layout switches to two-column with old/new headers
- Scenario: Sync scrolling | Given side-by-side view, When I scroll one pane, Then the other pane scrolls in sync

---

## Feature: Reports — Run Now

**Status**: Not implemented (TODO in `app/reports/page.tsx` — "Run now" buttons on each card)  
**Assumption**: Triggers report generation for the selected template. A download initiates or a "generating" state is shown while the report is built server-side.

**Test scenarios**:
- Scenario: Run now triggers generation | Given I click "Run now" on "Executive NOC Summary", Then the button shows "Generating…" and is disabled
- Scenario: Download initiates | Given generation completes, Then a file download begins (PDF for that template)
- Scenario: Error handling | Given backend fails, Then an error toast appears and the button returns to "Run now"

---

## Feature: Reports — Edit Template

**Status**: Not implemented (TODO in `app/reports/page.tsx` — "Edit" button on each card)  
**Assumption**: Opens a form to edit report name, description, frequency, recipients, and output format.

**Test scenarios**:
- Scenario: Edit opens form | Given I click "Edit" on a report card, Then a modal appears with pre-filled fields for that report
- Scenario: Save changes | Given I change frequency from "Weekly" to "Daily" and save, Then the card reflects the new frequency
- Scenario: Cancel discards changes | Given I make changes and click "Cancel", Then no changes are saved

---

## Feature: Reports — Recipients Management

**Status**: Not implemented (TODO in `app/reports/page.tsx` — "Recipients" button)  
**Assumption**: Opens a panel to manage email/Slack recipients for a report template.

**Test scenarios**:
- Scenario: Recipients panel opens | Given I click "Recipients" on a card, Then a modal shows current recipient list
- Scenario: Add recipient | Given I type an email and click "Add", Then the recipient appears in the list
- Scenario: Remove recipient | Given I click the remove button on a recipient, Then it is removed from the list

---

## Feature: Alerts — Acknowledge

**Status**: Not implemented (TODO in `app/alerts/page.tsx` — "Acknowledge" button)  
**Assumption**: Marks selected alert(s) as acknowledged. Row gets "ACK" chip inline. PATCH to `/api/alerts/:id/acknowledge`.

**Test scenarios**:
- Scenario: Acknowledge single alert | Given I select an alert row, When I click "Acknowledge", Then the row shows "ACK" chip
- Scenario: Acknowledge clears from active list | Given policy hides acknowledged alerts, Then the row disappears from the table

---

## Feature: Alerts — Suppress

**Status**: Not implemented (TODO in `app/alerts/page.tsx` — "Suppress" button)  
**Assumption**: Silences future alerts matching the same rule for a configurable duration.

**Test scenarios**:
- Scenario: Suppress opens duration picker | Given I select an alert and click "Suppress", Then a dropdown or modal appears with duration options (1h/4h/24h/indefinite)
- Scenario: Suppressed alert disappears | Given I suppress for 1h, Then the alert is removed from the active list and appears in a "suppressed" view

---

## Feature: Alerts — Open Runbook

**Status**: Not implemented (TODO in `app/alerts/page.tsx` — "Open runbook" button)  
**Assumption**: Opens a side panel or new tab with the runbook document relevant to the selected alert's rule.

**Test scenarios**:
- Scenario: Runbook panel opens | Given I select an alert and click "Open runbook", Then a right panel appears with runbook steps for that rule
- Scenario: No runbook available | Given the rule has no runbook, Then a message "No runbook configured for this rule" is shown

---

## Feature: Devices — Row Click Drill-down

**Status**: Not implemented (subtitle says "Click a row to drill into device detail")  
**Assumption**: Clicking a device row navigates to `/devices/:id` with a dedicated device detail page.

**Test scenarios**:
- Scenario: Row click navigates | Given device table is shown, When I click a row, Then URL changes to `/devices/core-sw-01` (or similar)
- Scenario: Detail page shows device info | Given I'm on a device detail page, Then I see expanded metrics, interface list, config snippet, and alert history for that device

---

## Feature: Devices — Search/Filter

**Status**: Not implemented (filter input visible but not wired)  
**Assumption**: Typing in the search input filters table rows by name, IP, MAC, or vendor.

**Test scenarios**:
- Scenario: Filter by name | Given I type "edge-rtr" in the filter input, Then only rows with "edge-rtr" in the name are shown
- Scenario: Filter by IP | Given I type "10.0.1", Then only rows with matching IPs are shown
- Scenario: Clear filter | Given a filter is active, When I clear the input, Then all rows are shown

---

## Feature: Topology — Node Click Detail Panel

**Status**: Not implemented (detail panel is hardcoded to core-sw-01)  
**Assumption**: Clicking a topology node updates the detail panel to show that node's metrics.

**Test scenarios**:
- Scenario: Click node updates panel | Given I click the "edge-rtr-nyc-01" node, Then the detail panel header changes to "edge-rtr-nyc-01" and shows its current metrics
- Scenario: Click WAN cloud node | Given I click the WAN node, Then the panel shows WAN circuit summary

---

## Feature: Topology — Zoom/Pan

**Status**: Not implemented (toolbar buttons present but not wired)  
**Assumption**: Zoom+/Zoom- scale the SVG viewBox. Reset resets to default. Pan via mouse drag.

**Test scenarios**:
- Scenario: Zoom in | Given I click Zoom+, Then the SVG scale increases and nodes appear larger
- Scenario: Zoom out | Given I click Zoom-, Then the SVG scale decreases
- Scenario: Reset | Given I've zoomed in, When I click Reset, Then viewBox returns to `1320 540`
- Scenario: Pan via drag | Given I mousedown on the SVG and drag, Then the SVG pan offset changes

---

## Feature: Interfaces — Search/Filter

**Status**: Not implemented (filter input visible but not wired)  
**Assumption**: Typing filters the interface table rows.

**Test scenarios**:
- Scenario: Filter by port name | Given I type "Gi1/0", Then only rows with matching port names are shown

---

## Feature: Discovery — Run Discovery

**Status**: Not implemented ("Run discovery" button present but not wired)  
**Assumption**: Triggers a new discovery scan for a selected subnet range. A new job appears in the active jobs list.

**Test scenarios**:
- Scenario: Run discovery triggers job | Given I click "Run discovery", Then a modal appears for subnet/range input
- Scenario: New job appears | Given I submit a valid subnet, Then a new job row appears in "Active Jobs" with 0% progress
- Scenario: Job progresses | Given a job is running, Then progress bar increments over time and "Found" count updates
