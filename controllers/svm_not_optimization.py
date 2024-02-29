# import time
# def dummy() :
#     out = ''
#     for i in range(0,10) :
#         out += str(i + 1) + ", "
#         time.sleep(0.1)
#     print (out)

# if __name__ =='__main__' :
#     dummy = dummy()

#!/usr/bin/python
import sys, getopt, time, os
import numpy as np
import pandas as pd

def main(argv):
    argument = ''
    usage = 'usage: script.py -f <sometext>'
    
    # parse incoming arguments
    try:
        dir_path = os.path.dirname(os.path.realpath(__file__))
        argv = argv[0].split(",")
        idplant = np.zeros((1,465),np.int16)
        for i in argv :
            idplant[0,int(i)-1] = 1

        col = [i for i in range(1,466)]

        lol = pd.DataFrame(idplant, columns= col)
        lol.drop(columns=[213,232],inplace=True)
        lol = np.array(lol)
        # save the model to disk
        import pickle
        filenames = 'svm_not_optimization.sav'

        # load the model from disk
        loaded_modell = pickle.load(open(os.path.join(dir_path,filenames), 'rb'))

        pred = loaded_modell.predict(lol)

        print(pred)
    except getopt.GetoptError:
        print(usage)
        sys.exit(2)

if __name__ == "__main__":
    main(sys.argv[1:])