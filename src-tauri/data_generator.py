import pandas as pd
import numpy as np

scale = 10000

x = np.arange(0, scale)
sin_col = np.sin(x / scale) * scale + scale
cos_col = np.cos(x / scale) * scale + scale
square_wave = np.floor(np.sin(x))*(scale-5)+scale

df = pd.DataFrame({
    'sin': np.round(sin_col, 3),
    'linear': x,
    'cos': np.round(cos_col, 3),
    'square_wave': np.round(square_wave, 3)
})

df.to_csv("./test_data_high.csv", index_label="idx")