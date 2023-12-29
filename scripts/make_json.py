import json
import os

sheet_dict = dict()

while True:
    s_code = input('Input Sheet Code : ')
    if s_code == "q" or s_code == 'Q':
        break

    while True:
        txt = input('Input URL or Q to quit : ')
        if txt == "q" or txt == 'Q':
            break
        
        c_dict = dict()
        title = str()
        if "leetcode" not in txt:
            title = input('Input non-leetcode problem title : ')
        else:
            titles = txt.split("/")
            title = [part for part in titles if part]
            title = title[-1]
            
            title_words = title.split('-')
            title = ' '.join(word.capitalize() for word in title_words)
        c_dict["title"] = title
        c_dict[s_code] = 0
        if txt in sheet_dict:
            sheet_dict[txt][s_code] =  0
        else:
            sheet_dict[txt] = c_dict

path = os.path.dirname(__file__)
path = os.path.dirname(path)
path = os.path.join(path, "data", "sde_sheet.json")
with open(path, "w") as outfile:
    json.dump(sheet_dict, outfile, indent=4)

