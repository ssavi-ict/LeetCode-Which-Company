import json
import os
from distutils.util import strtobool

import jq

from utils import (BASE, create_comment, delete_comments, json_from_file,
                   request, validate_file)

json_schema = os.getenv('INPUT_JSON_SCHEMA')
json_path_pattern = os.getenv('INPUT_JSON_PATH_PATTERN')
send_comment = strtobool(os.getenv('INPUT_SEND_COMMENT'))
clear_comments = strtobool(os.getenv('INPUT_CLEAR_COMMENTS'))

event_path = os.getenv('GITHUB_EVENT_PATH')
repo = os.getenv('GITHUB_REPOSITORY')

PR_FILES = BASE + '/repos/{repo}/pulls/{pull_number}/files'

event = json_from_file(event_path)
pull_number = jq.compile('.pull_request.number').input(event).first()

errors = []
pr_files_url = PR_FILES.format(repo=repo, pull_number=pull_number)
pr_files = request('get', pr_files_url)

for pr_file in pr_files:
    filename = pr_file['filename']
    is_valid, validation_errors = validate_file(json_schema, json_path_pattern, filename)

    if not is_valid:
        errors.append({
            'path': filename,
            'errors': validation_errors
        })

if clear_comments:
    delete_comments(repo, pull_number)

if errors:
    if send_comment:
        create_comment(repo, pull_number, errors)

    for error in errors:
        print(f"Validation failed for {error['path']}:")
        for validation_error in error['errors']:
            print(f"- {validation_error}")

    raise Exception('JSON validation failed')
else:
    print("JSON validation succeeded!")

