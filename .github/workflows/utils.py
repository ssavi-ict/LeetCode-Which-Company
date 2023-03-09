import jsonschema
from jsonschema import ValidationError
import json
import re

def validate_file(json_schema, json_path_pattern, filename):
    if not re.match(json_path_pattern, filename):
        return False, []

    with open(filename) as f:
        data = json.load(f)

    with open(json_schema) as f:
        schema = json.load(f)

    try:
        jsonschema.validate(instance=data, schema=schema)
        return True, []
    except ValidationError as e:
        return False, [e.message]
