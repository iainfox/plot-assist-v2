import pandas as pd
import numpy as np

x = np.arange(0, 1000)
sin_col = np.sin(x / 100) * 400 + 400
cos_col = np.cos(x / 100) * 400 + 400
square_wave = 402 + 397 * ((-1) ** np.floor(x / 100))

df = pd.DataFrame({
    'sin': np.round(sin_col, 3),
    'linear': x,
    'cos': np.round(cos_col, 3),
    'square_wave': np.round(square_wave, 3)
})

df.to_csv("test.csv", index_label="idx")