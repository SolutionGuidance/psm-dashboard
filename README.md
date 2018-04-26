# psm-dashboard

Dashboard code for displaying [PSM](http://projectpsm.org/) project status.

Like the PSM itself, this dashboard is [open source](LICENSE) software.

* `get-inputs`
  Script that gathers data from various PSM project sources
  (high-level features list, requirements list, issue tracker) and
  turns it into JSON which is then used as input to the dashboard
  display code.

* `sample-input.json`
  Sample input for the dashboard display code (i.e., output from a
  single run of `get-inputs`).
