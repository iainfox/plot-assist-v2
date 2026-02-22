import pandas

import numpy as np

x = np.arange(0, 1000)
sin_col = np.sin(x / 100) * 400 + 400
cos_col = np.cos(x / 100) * 400 + 400
square_wave = 402 + 397 * ((-1) ** np.floor(x / 100))

df = pandas.DataFrame({
    'sin': sin_col,
    'linear': x,
    'cos': cos_col,
    'square_wave': square_wave
})

df.to_csv("test.csv")