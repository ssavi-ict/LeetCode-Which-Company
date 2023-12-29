import json

with open("C:\\Users\\Avik Sarkar\\Documents\\GitRepo\\LeetCode-Which-Company\\chrome\\ext_data\\sde_sheet.json", "r") as file:
    json_dict = json.load(file)

striver = dict()
neetcode = dict()
blind75 = dict()

for k1 in json_dict:
    name = str()
    s = 0
    n = 0
    b = 0
    for k2 in json_dict[k1]:
        if k2 == 'title':
            name = json_dict[k1][k2]
        elif k2 == 'striver':
            s = 1
        elif k2 == 'neetcode':
            n = 1
        elif k2 == 'blind75':
            b = 1

    if s == 1:
        striver[k1] = name
    if n == 1:
        neetcode[k1] = name
    if b == 1:
        blind75[k1] = name

cdict = {
    'striver': striver,
    'neetcode': neetcode,
    'blind75': blind75
}

print(cdict)

with open("C:\\Users\\Avik Sarkar\\Documents\\GitRepo\\LeetCode-Which-Company\\chrome\\ext_data\\sheets.json", "w") as file:
    json.dump(cdict, file, indent=4)
