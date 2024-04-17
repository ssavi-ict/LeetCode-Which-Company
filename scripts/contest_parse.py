import json
import os
import requests
import time

LEETCODE_ROOT = 'https://leetcode.com'
CONTEST_ROOT_URL = LEETCODE_ROOT + '/contest/'
CONTEST_API_ENDPOINT = CONTEST_ROOT_URL + 'api/info/'
CONTEST_SLUG = ['weekly-contest-', 'biweekly-contest-']
BASE_CONTEST_ID = [393, 128]
# BASE_CONTEST_EPOCH = [1713666600, 1714228200]
BASE_CONTEST_EPOCH = [1713061800, 1713018600]
DAY_DIFFERENCE = [7, 14]
CURRENT_EPOCH = int(time.time())


def rcv_api_response(url):
    info_json = dict()
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            json_response = response.json()  # Convert response to JSON format
            if 'error' in json_response:
                print("Error occurred:", json_response['error'])
            else:
                is_private = json_response["contest"]["is_private"]
                start_time = json_response["contest"]["start_time"]
                # print(is_private, CURRENT_EPOCH, start_time)
                if not is_private and CURRENT_EPOCH <= int(start_time):
                    info_json["title"] = json_response["contest"]["title"]
                    info_json["contest_duration"] = json_response["contest"]["duration"]
                    info_json["start_time"] = start_time
                else:
                    print("Invalid contest...")
        else:
            print(f"Failed to fetch data. Status code: {response.status_code}")
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
    return info_json


def evaluate_contest_info():
    valid_contests = {}

    for i in range(len(CONTEST_SLUG)):
        contest_type = CONTEST_SLUG[i]
        base_contest_id = BASE_CONTEST_ID[i]
        base_contest_epoch = BASE_CONTEST_EPOCH[i]
        week_divisor = DAY_DIFFERENCE[i] * 24 * 60 * 60
        epoch_diff = CURRENT_EPOCH - base_contest_epoch
        weeks_passed = epoch_diff // week_divisor

        if epoch_diff % week_divisor != 0:
            weeks_passed += 1
        probable_contest_id = base_contest_id + weeks_passed
        print(probable_contest_id)

        from_contest_id = probable_contest_id - 3
        to_contest_id = probable_contest_id + 3

        for contest in range(from_contest_id, to_contest_id):
            contest_slug = contest_type + str(contest)
            contest_url = CONTEST_API_ENDPOINT + contest_slug
            print("Checking information for ", contest_url)
            response = rcv_api_response(contest_url)
            is_empty = not bool(response)
            if not is_empty:
                print(response)
                valid_contests[contest_slug] = response
    return valid_contests


def store_valid_contests_in_json(contest_info_path):
    # contests = self.filter_valid_contests()
    contests = evaluate_contest_info()
    with open(contest_info_path, 'w') as file:
        json.dump(contests, file)
        print("Written into the JSON file...")


def create_a_contest_json(contest_info_path):
    if os.path.exists(contest_info_path):
        os.remove(contest_info_path)

    with open(contest_info_path, 'w') as file:
        json.dump({}, file)


if __name__ == '__main__':
    current_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(current_path, 'data')
    contest_info_json_path = os.path.join(data_path, 'contests.json')
    create_a_contest_json(contest_info_json_path)
    store_valid_contests_in_json(contest_info_json_path)
