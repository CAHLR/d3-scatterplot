import pandas as pd
data1 = pd.read_csv("questions4.csv", sep=',')
data2 = pd.read_csv("question_desc.csv", sep=',')

y = list(data1['course'])

# function to modify the course value of questions4.csv file to match it with
# description file. (there is extra space after ':' in questions4.csv file)
def f(st):
    k=0
    for i in range(len(st)):
        if(st[i] == ':'):
            k=1
            break
    if(k==1):
        return st[:i+1]+" "+st[i+1:] 
    else:
        return st

for j in range(len(y)):
        y[j] = f(y[j])
        if(y[j] == 'Intro 2:  Mindscapes'):
            y[j] = 'Intro 2:  Mindscape'

data1['Lesson'] = pd.Series(y, index = data1.index)
data1 = data1.rename(columns = {"subject" : "Slide"})

# inner join is applied to both the files
data = pd.merge(data1, data2, how="inner", on=["Slide", "Lesson"])

# only required columns are chosen after merging
data = data[["Slide", "Lesson", "Classification", "Lesson Flow", "Passive Type", "x", "y"]]

# fill "unknown" to missing values in "Passive Type"
data["Passive Type"].fillna("unknown", inplace=True)
data.to_csv("joined_data.csv", sep=',', headers=True, index=False)
