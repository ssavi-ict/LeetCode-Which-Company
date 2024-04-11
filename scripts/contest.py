import json
import os.path
import time
import requests
from bs4 import BeautifulSoup
from config import CONFIG


class CONTEST(object):
    def __init__(self, contest_info_path):
        self.contest_info_path = contest_info_path
        self.header = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }

    # noinspection PyMethodMayBeStatic
    def get_all_urls(self):
        time.sleep(2)
        # response = requests.get(api_url, headers=headers)
        reqs = requests.get(url=CONFIG.CONTEST_ROOT_URL, headers=self.header)
        time.sleep(2)
        b_soup = BeautifulSoup(reqs.text, 'html.parser')
        time.sleep(2)
        all_urls = []
        for href in b_soup.find_all('a'):
            all_urls.append(href.get('href'))
        return all_urls

    # noinspection PyMethodMayBeStatic
    def filter_contest_url(self):
        all_urls = self.get_all_urls()
        contest_urls = []
        for url in all_urls:
            for tag in CONFIG.CONTEST_FILTERING_TAG:
                if url and tag in url:
                    url = url.split("/")[-1]
                    contest_urls.append(url)
        contest_urls = list(dict.fromkeys(contest_urls))
        return contest_urls

    def filter_valid_contests(self):
        contest_slugs = self.filter_contest_url()
        print('Found Contest Slugs Are - ')
        print(contest_slugs)
        valid_contests = {}

        for slug in contest_slugs:
            formed_url = CONFIG.CONTEST_API_ENDPOINT + slug
            response = requests.get(formed_url, headers=self.header)
            response_json = response.json()
            is_private = response_json["contest"]["is_private"]
            contest_start_time = response_json["contest"]["start_time"]
            contest_title = response_json["contest"]["title"]
            if is_private or int(time.time()) > int(contest_start_time):
                print("[ " + str(is_private) + " ]", contest_title, ' is private ... ')
                continue
            contest_duration = response_json["contest"]["duration"]
            print("Contest Info : ", contest_title, contest_start_time, contest_duration, is_private)
            contest_info = {
                "title": contest_title, "start_time": contest_start_time, "contest_duration": contest_duration
            }
            valid_contests[slug] = contest_info
        print('Valid Contests Are - ', valid_contests)
        return valid_contests

    # noinspection PyMethodMayBeStatic
    def store_valid_contests_in_json(self):
        contests = self.filter_valid_contests()
        self.create_a_contest_json()
        with open(self.contest_info_path, 'w') as file:
            json.dump(contests, file)

    # noinspection PyMethodMayBeStatic
    def create_a_contest_json(self):
        if os.path.exists(self.contest_info_path):
            os.remove(self.contest_info_path)

        with open(self.contest_info_path, 'w') as file:
            json.dump({}, file)


if __name__ == '__main__':
    current_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(current_path, 'data')
    contest_info_json_path = os.path.join(data_path, 'contests.json')
    contest = CONTEST(contest_info_path=contest_info_json_path)
    contest.store_valid_contests_in_json()

# all_url = ['/', '/explore/', '/problemset/all/', '/contest/', '/discuss/', '/', None, '/contest/weekly-contest-350', '/contest/biweekly-contest-107', '/business/contact/', '/contest/weekly-contest-291', '/contest/weekly-contest-290', '/contest/biweekly-contest-85', '/contest/weekly-contest-349', None, '/contest/biweekly-contest-106', None, '/contest/weekly-contest-348', None, '/contest/weekly-contest-347', None, '/contest/biweekly-contest-105', None, '/contest/weekly-contest-346', None, '/contest/weekly-contest-345', None, '/contest/biweekly-contest-104', None, '/contest/weekly-contest-344', None, '/contest/weekly-contest-343', None, '/neal_wu', 'https://leetcode.cn/u/Heltion', 'https://leetcode.cn/u/JOHNKRAM', '/numb3r5', 'https://leetcode.cn/u/int65536', 'https://leetcode.cn/u/arignote', '/hank55663', '/xiaowuc1', '/qeetcode', '/AntonRaichuk', '/contest/globalranking', '/support/', '/jobs/', '/bugbounty/', '/interview/', '/student/', '/terms/', '/privacy/', '/region/']

