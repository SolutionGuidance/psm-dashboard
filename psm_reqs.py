#!/usr/bin/env python3
# -*- coding: utf-8 -*-
#
# Ingest PSM requirements from CSV files and make them available in Python.
#
# Copyright (C) 2018 Open Tech Strategies, LLC
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

__doc__ = """Module for working with PSM requirements."""

import csv
import os
import re
from io import StringIO
from warnings import warn
try:
    from xlsx2csv import Xlsx2csv
except ImportError as e:
    # You need xlsx2csv.  Do 'pip3 install xlsx2csv' or get it
    # from https://github.com/dilshod/xlsx2csv. 
    #
    # Just for reference, some other possibilities for XLSX-to-CSV
    # conversion were:
    # 
    #   - github.com/staale/py-xlsx
    #   - github.com/leegao/pyXLSX
    #   - https://bitbucket.org/ericgazoni/openpyxl/ 
    # 
    # (For that last one, note that BitBucket now apparently requires
    # you to log in to access even public projects, so use the clone
    # repository at https://github.com/ericgazoni/openpyxl instead.)
    raise e

_req_id_re = re.compile("psm-([A-Z][A-Z])-([0-9.]+)")

class PSMRequirement():
    """Class representing one requirement."""
    def __init__(self,
                 family,
                 #                     # ----------------------------
                 #                     #       CSV header name
                 #                     # ----------------------------
                 req_id,               # "Requirement ID Number"
                 category,             # "Requirement Category"
                 description,          # "Requirement Statement"
                 priority,             # "Priority"
                 rank,                 # "Rank"
                 source,               # "Source"
                 source_doc,           # "Source Document"
                 release,              # "Release"
                 design_ref,           # "Design Reference"
                 acceptance_test_ref,  # "Acceptance Test Reference"
                 comment,              # "Comment"
                 *ignored              # (many trailing commas in some rows)
                 ):
        """FAMILY is a two-letter string indicating the requirements
        family, for example "FR", "IA", etc.  Every other parameter
        corresponds self-explanatorily to a CSV field."""
        self.family              = family
        self.req_id              = req_id
        self.category            = category
        self.description         = description
        self.priority            = priority
        self.rank                = rank
        self.source              = source
        self.source_doc          = source_doc
        self.release             = release
        self.design_ref          = design_ref
        self.acceptance_test_ref = acceptance_test_ref
        self.comment             = comment
        # Sanity check the req family.
        m = _req_id_re.match(self.req_id)
        if m is None:
            warn("WARNING: No requirement family found for \"%s\"" % self.req_id)
        elif m.group(1) != family:
            warn("WARNING: family \"%s\" does not match req \"%s\"" % (family, self.req_id))

    def __str__(self):
        # We don't include self.family because it's implicit in self.req_id.
        return """\
        Requirement ID Number:     "%s"
        Requirement Category:      "%s"
        Requirement Statement:     "%s"
        Priority:                  "%s"
        Rank:                      "%s"
        Source:                    "%s"
        Source Document:           "%s"
        Release:                   "%s"
        Design Reference:          "%s"
        Acceptance Test Reference: "%s"
        Comment:                   "%s"\n""" \
            % (self.req_id.replace('"', '\\"'),
               self.category.replace('"', '\\"'),
               self.description.replace('"', '\\"'),
               self.priority.replace('"', '\\"'),
               self.rank.replace('"', '\\"'),
               self.source.replace('"', '\\"'),
               self.source_doc.replace('"', '\\"'),
               self.release.replace('"', '\\"'),
               self.design_ref.replace('"', '\\"'),
               self.acceptance_test_ref.replace('"', '\\"'),
               self.comment.replace('"', '\\"'))


class PSMRequirementException(Exception):
    "Exception raised if something is wrong about a requirement."
    pass


class PSMRequirementFamilyException(Exception):
    "Exception raised if something is wrong about a requirement family."
    pass

def family_from_header(hdr):
    """Return a two-letter reqs family from family header HDR.
    If HDR does not indicate a reqs family, return None."""
    hdr_lower = hdr.lower()
    if re.search("func reqs", hdr_lower):
        return "FR"
    elif re.search("intermediary . interface", hdr_lower):
        return "II"
    elif re.search("standards and conditions", hdr_lower):
        return "SC"
    elif re.search("information architecture", hdr_lower):
        return "IA"
    elif re.search("integration and utility", hdr_lower):
        return "IU"
    elif re.search("access and delivery", hdr_lower):
        return "AD"
    elif re.search("software quality", hdr_lower):
        return "SQ"
    elif re.search("performance", hdr_lower):
        # This is a bit of a mystery.  This section doesn't appear in
        # RTM.xlsx (at least when viewed in LibreOffice Calc), but it
        # does appear in the CSV exported from RTM.xlsx (via xlsx2csv),
        # as a section starting with "-------- 8 - Performance".  But
        # that section has no req IDs in the first column, although in
        # many of its rows it *does* have the text in the second
        # column that appears to describe performance requirements.
        #
        # For now, we return None, but it would be good to figure out
        # if this mystery section represents requirements we ought to
        # be including in the RTM etc.
        return None
    elif re.search("pharmacy \(mmis\)", hdr_lower):
        return "PH"
    elif re.search("selections", hdr_lower):
        # Skip this non-reqs section explicitly.
        return None
    else:
        # Any other family header is unexpected, so warn about it.
        warn("WARNING: unexpected family header in CSV:")
        warn("         \"%s\"" % hdr)


def get_reqs(xlsx_file):
    """Return a dictionary of PSMRequirements based on XSLX_FILE.
    Return a dict mapping PSM req IDs to PSMRequirement instances."""
    reqs = {}
    families_seen = set()

    if not os.path.exists(xlsx_file):
        raise ValueError(
            "ERROR: can't find {}\n"
            "You must set the 'psm_reqs' parameter in 'psm-dashboard-config.json' "
            "to point to the requirements/RTM.xlsx spreadsheet that lives in "
            "the PSM tree.".format(xlsx_file)
        )

    csv_fh = StringIO()
    Xlsx2csv(xlsx_file).convert(csv_fh, sheetid=0)
    csv_fh.seek(0)

    csv_reader = csv.reader(csv_fh)
    current_family = None # two-letter req family code, e.g, "FR", etc
    current_category = None
    for row in csv_reader:
        if (len(row) == 1
            and row[0].startswith("-------- ")): # family row
            current_family = family_from_header(row[0])
            if current_family in families_seen:
                raise PSMRequirementFamilyException(
                    "ERROR: encountered family '%s' more than once" 
                    % current_family)
            elif current_family is not None:
                families_seen.add(current_family)
        elif (len(row) > 1 
                and row[0] == "" 
                and row[1] != ""): # category row
            if current_family is not None:
                current_category = current_family + " " + row[1]
            else:
                current_category = None
        elif (len(row) >= 11
                and current_family is not None
                and row[0] != ""
                and _req_id_re.match(row[0]) is not None): # req row
            if current_family is None:
                warn("WARNING: got req \"%s \" while no family active"
                        % row[0])
            if current_category is not None:
                row[1] = current_category
            else:
                warn("WARNING: requirement '%s' has no category" 
                        % (row[0]))
            req = PSMRequirement(current_family, *row)
            if req.req_id in reqs:
                # Can't happen, but let's be extra careful.
                raise PSMRequirementException(
                    "ERROR: encountered req '%s' more than once" 
                    % req.req_id)
            reqs[req.req_id] = req
        elif (len(row) >= 11
                and row[0]  == 'Requirement ID Number'
                and row[1]  == 'Requirement Category'
                and row[2]  == 'Requirement Statement'
                and row[3]  == 'Priority'
                and row[4]  == 'Rank'
                and row[5]  == 'Source'
                and row[6]  == 'Source Document'
                and row[7]  == 'Release'
                and row[8]  == 'Design Reference'
                and row[9]  == 'Acceptance Test Reference'
                and row[10] == 'Comment'):
            pass # skip CSV header rows
        elif current_family is not None:
            warn("WARNING: not really sure what this row is:")
            warn("         %s" % row)
    return reqs
