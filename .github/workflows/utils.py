import jsonschema
from jsonschema import ValidationError
import json
import re
import json
import os

import requests


def BASE_URL():
    return 'https://api.github.com'


def request(method, url, data=None):
    headers = {
        'Accept': 'application/vnd.github.v3+json',
        'Authorization': f'token {os.getenv("GITHUB_TOKEN")}',
    }

    response = requests.request(
        method=method,
        url=f'{BASE_URL()}/{url}',
        headers=headers,
        json=data,
    )

    response.raise_for_status()

    return response.json()


def json_from_file(path):
    with open(path) as f:
        return json.load(f)


def create_comment(repo, pull_number, body):
    url = f'repos/{repo}/issues/{pull_number}/comments'
    data = {'body': body}
    request('POST', url, data)


def delete_comments(repo, pull_number):
    url = f'repos/{repo}/issues/{pull_number}/comments'
    comments = request('GET', url)
    for comment in comments:
        comment_url = f'repos/{repo}/issues/comments/{comment["id"]}'
        request('DELETE', comment_url)


def validate_file(json_schema, json_path_pattern, filename):
    if not re.match(json_path_pattern, filename):
        return []

    with open(filename) as f:
        data = json.load(f)

    with open(json_schema) as f:
        schema = json.load(f)

    errors = []

    try:
        jsonschema.validate(instance=data, schema=schema)
    except ValidationError as e:
        errors.append(e.message)

    return errors
