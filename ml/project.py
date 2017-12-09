import pandas as pd
import xgboost as xgb
import gc

print('Loading data ...')

# read the original csv file
train = pd.read_csv('kc_house_data.csv')
dateOrigin = pd.read_csv('date_origin.csv')

# extract the specific features
print('Creating training set ...')
df_cur = dateOrigin[['id', 'date_new']]
df_oneYear = dateOrigin[['id', 'oneYear']]
df_threeYear = dateOrigin[['id', 'threeYear']]
df_fiveYear = dateOrigin[['id', 'fiveYear']]

# merge two dataframe
merged = train.merge(df_cur, how='left', on='id')

# drop the unrelated features
df_train = merged.drop(['price', 'date', 'yr_renovated', 'lat', 'long', 'sqft_living15', 'sqft_lot15'], axis=1)

x_train = df_train
y_train = merged['price'].values

train_columns = df_train.columns

# check the default cell in matrix
for c in x_train.dtypes[x_train.dtypes == object].index.values:
    x_train[c] = (x_train[c] == True)

# delete the unnecessary dataframe
del train, merged, dateOrigin, df_cur; gc.collect()

# split the train data matrix into training data and validation data
split = 14000
x_train, y_train, x_valid, y_valid = x_train[:split], y_train[:split], x_train[split:], y_train[split:]

print('Building DMatrix...')

# put the dataframe into xgboost storing types
d_train = xgb.DMatrix(x_train, label=y_train)
d_valid = xgb.DMatrix(x_valid, label=y_valid)

print(x_train.shape, x_valid.shape, y_train.shape, y_valid.shape)
del x_train, x_valid; gc.collect()

print('Training ...')

# set the parameters
params = {}
params['eta'] = 0.01
params['objective'] = 'reg:linear'
params['eval_metric'] = 'mae'
params['min_child_weight'] = 20
params['colsample_bytree'] = 0.2
params['max_depth'] = 12
params['lambda'] = 0.3
params['alpha'] = 0.6
params['silent'] = 1

# initial the watchlist
watchlist = [(d_train, 'train'), (d_valid, 'valid')]
clf = xgb.train(params, d_train, 10000, watchlist, early_stopping_rounds=100, verbose_eval=10)

del d_train, d_valid

# update the year into three matrix
print('Building test set ...')
test1 = df_train.merge(df_oneYear, how='left', on='id')
test1['date_new'] = test1['oneYear']
test1 = test1.drop('oneYear', axis=1)
test3 = df_train.merge(df_threeYear, how='left', on='id')
test3['date_new'] = test3['threeYear']
test3 = test3.drop('threeYear', axis=1)
test5 = df_train.merge(df_fiveYear, how='left', on='id')
test5['date_new'] = test5['fiveYear']
test5 = test5.drop('fiveYear', axis=1)

for c in test1.dtypes[test1.dtypes == object].index.values:
    test1[c] = (test1[c] == True)

for c in test3.dtypes[test3.dtypes == object].index.values:
    test3[c] = (test3[c] == True)

for c in test5.dtypes[test5.dtypes == object].index.values:
    test5[c] = (test5[c] == True)

del df_train, df_oneYear, df_threeYear, df_fiveYear; gc.collect()

# put the dataframe into xgboost storing types
d_test1 = xgb.DMatrix(test1)
d_test3 = xgb.DMatrix(test3)
d_test5 = xgb.DMatrix(test5)

del test1, test3, test5; gc.collect()

# predict the test data
print('Predicting on test ...')
p_test1 = clf.predict(d_test1)
p_test3 = clf.predict(d_test3)
p_test5 = clf.predict(d_test5)

del d_test1, d_test3, d_test5; gc.collect()

# read the csv framework
res1 = pd.read_csv('prediction_sample.csv')
res3 = pd.read_csv('prediction_sample.csv')
res5 = pd.read_csv('prediction_sample.csv')

# extract the price
print(res1.shape, p_test1.shape, p_test3.shape, p_test5.shape)
n = len(res1)
res1['price'] = p_test1[:n]
res3['price'] = p_test3[:n]
res5['price'] = p_test5[:n]

print('Writing csv ...')
res1.to_csv('oneYear.csv')
res3.to_csv('threeYear.csv')
res5.to_csv('fiveYear.csv')

