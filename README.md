# psm-dashboard

Dashboard code for displaying [PSM](http://projectpsm.org/) project status.

Like the PSM itself, the PSM Dashboard is [open source](LICENSE)
software.  The Dashboard displays PSM development status, showing
which features have been completed, which are in progress, and which
have yet to be started.

The code here combines information in the [PSM Features - RTM
Map](https://docs.google.com/spreadsheets/d/1avMeCIiayaCcx8fDzldo3KEiRHyM2qjjBuCXWKRwyao/edit?usp=sharing)
spreadsheet, the [PSM
requirements](https://github.com/SolutionGuidance/psm/tree/master/requirements]),
and the [PSM issue
tracker](https://github.com/SolutionGuidance/psm/issues/) to produce
progress charts that show both high-level and detailed views of the
PSM's feature progress.

* `burn-down.html`, `index.html`
  Browser entry points to the dashboard.
  TBD: It looks like `burn-down.html` is the real entry point
       and that `index.html` is obsolete or outdated, but it
       would be great to get confirmation or denial of that.

* `burn-down.js`, `dashboard.js`, `features-pie-chart.js`
  JavaScript code used by the dashboard pages.

* `refresh-dashboard`
   Script to orchestrate everything: gather and combine the
   features/RTM mapping, requirements, and issue labels so as to
   produce `dashboard-input.json`

* `features-info.json`
  The result of one run of `refresh-dashboard`.  This is a generated
  file and therefore in theory we shouldn't version it here.  But in
  practice: it's rather expensive to generate, so once we have a new
  version we like to keep it until the next time we regenerate.

* `get-inputs`
  Script that gathers data from various PSM project sources
  (high-level features list, requirements list, issue tracker) and
  turns it into JSON which is then used as input to the dashboard
  display code.

* `dashboard-data-sketch.txt`
  A description of the output format that `get-inputs` produces.

* `psm-reqs.el`, `psm_reqs.py`, `show-reqs`
  Helper code for handling PSM reqs.

* `reqs2any`
   Parse PSM reqs from a CSV file and display them in various ways.

* `non-hidden-RTM-rows.org`
  An initial export of PSM requirements to Org Mode format (done manually,
  I believe, rather than from the CSV files).  This export turned out
  to be missing some hidden rows; see the next entry about that.

* `hidden-RTM-rows.org`
  The remainder of the Org Mode export (see above).  Here's how you
  know that this file and non-hidden-RTM-rows.org have different reqs:

          $ grep -E "^\* psm-" hidden-RTM-rows.org | cut -c 3- > hidden-reqs
          $ grep -E "^\* psm-" non-hidden-RTM-rows.org | cut -c 3- > non-hidden-reqs
          $ sort hidden-reqs > h.tmp; mv h.tmp hidden-reqs
          $ sort non-hidden-reqs > n.tmp; mv n.tmp non-hidden-reqs
          $ comm -1 -2 hidden-reqs non-hidden-reqs
          $ diff -u hidden-reqs non-hidden-reqs
          $ rm hidden-reqs non-hidden-reqs

* `added-reqs.org`
  Requirements we created during the first issues/reqs sweep, which
  used only the non-hidden rows, as we didn't know about the hidden
  rows at the time.  Therefore, some of the newly created reqs in
  added-reqs.orq are redundant with existing reqs; there is more
  detail about this in the file.  Others are not redundant -- they
  represent genuinely new requirements that we came up with during
  our requirements sweep.  All of the added reqs are, I believe, also
  present in non-hidden-RTM-rows.org, since the added reqs were
  created during the initial issues/reqs sweep.

  What we should do with redundant new reqs now:

  Once we're sure we've identified every one of them, we should make
  sure none of them are attached to any issues, and then remove all
  the redundant reqs from any file that has them (RTM.xlsx in the PSM
  repository, added-reqs.org here, and *-RTM-rows.org here too just to
  be safe).

  What we should do with non-redundant new reqs now:

  They should stay, of course, but note that the removal of some of
  the redundant ones might lead to the downward renumbering of some
  non-redundant ones.

* `issues-2018-03-31.org`
  An export of all issues and their labels, up to issue 740, plus some
  information about which issues should get which req-related labels.

  The information in this file was converted to JSON and fed to
  ots-tools/github-tools/gh-sak, to put req labels on our issues.
  Those JSON files are still around on the PSM repository's archival
  rtm-issue-linking branch, but we haven't preserved them here.
