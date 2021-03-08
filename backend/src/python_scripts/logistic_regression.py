import pandas  as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
import pickle
from sklearn.utils import shuffle
import sys

# nume_fisier = "heart.csv"
# tabel = pd.read_csv(nume_fisier)
#
# variabile = list(tabel)
# variabile_predictor = variabile[:-1]
# variabila_tinta = variabile[len(variabile) - 1]
#
# x_nonstd = tabel[variabile_predictor].values
# y = tabel[variabila_tinta].values
#
# x_nonstd, y = shuffle(x_nonstd, y)
#
# #standardizare date
# scaler = StandardScaler()
# x_scaled = scaler.fit_transform(x_nonstd)

#regresie logistica
# lr = LogisticRegression()
# reg = lr.fit(x_scaled, y)

# to_predict = scaler.transform(np.array([56,1,0,130,283,1,0,103,1,1.6,0,0,3]).reshape(1,-1))


#denumiri fisiere import
filename_model = 'logistic_regression_model.sav'
filename_scaler = 'scaler.sav'

#serializare model si scaler
# pickle.dump(lr, open(filename_model, 'wb'))
# pickle.dump(scaler, open(filename_scaler, 'wb'))

#deserializare
loaded_model = pickle.load(open(filename_model, 'rb'))
loaded_scaler = pickle.load(open(filename_scaler, 'rb'))

to_predict = []
for i in range(13):
    to_predict.append(sys.argv[i + 1])

predicted = loaded_scaler.transform(np.array(to_predict).reshape(1, -1))

print(predicted)
sys.stdout.flush()
