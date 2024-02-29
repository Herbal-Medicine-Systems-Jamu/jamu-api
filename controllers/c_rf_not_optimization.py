import sys, getopt, os
import numpy as np
import joblib

def main(argv):
    argument = ''
    usage = 'usage: script.py -f <sometext>'

    try:
        dir_path = os.path.dirname(os.path.realpath(__file__))
        argv = argv[0].split(",")

        idcompound = np.array([0]*7989)
        for i in argv :
            idcompound[int(i)] = 1

        idcompound = idcompound.reshape(1,-1)
        
        filenames = 'c_rf_not_optimization.pkl'
        loaded_modell = joblib.load(open(os.path.join(dir_path,filenames), 'rb'))
        hasil_prediksi = loaded_modell.predict(idcompound)
        print(hasil_prediksi)

    except getopt.GetoptError:
        print(usage)
        sys.exit(2)

if __name__ == "__main__":
    main(sys.argv[1:])