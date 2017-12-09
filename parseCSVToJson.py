import csv
import json
import sys


def parse(fileloc):
    header = []
    dict = {}
    with open(fileloc, 'rb') as f:
        reader = csv.reader(f)
        flag = True;

        out_file = open("updated.json", 'w')
        for row in reader:
            if flag:
                flag = False
                for str in row:
                    header.append(str)
                continue
            for i in range(len(row)):
                dict[header[i]] = row[i]
            json.dump(dict, out_file, indent=9)
            dict = {}
        out_file.close()


if __name__ == "__main__":
    fileloc = sys.argv[1]
    parse(fileloc)
