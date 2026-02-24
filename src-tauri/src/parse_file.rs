use std::{collections::HashMap, env};

struct FileData {
    names: Vec<String>,
    data: HashMap<String, Vec<f32>>,
    idx: Vec<String>,
}

impl FileData {
    fn new() -> Self {
        let file_path = env::args().last().unwrap_or_default();
        if !std::path::Path::new(&file_path).exists() {
            panic!("File path does not exist: {}", file_path);
        }

        let file = match std::fs::File::open(&file_path) {
            Ok(f) => f,
            Err(e) => panic!("Failed to open file: {}", e),
        };
        use std::io::{self, BufRead};

        let mut reader = io::BufReader::new(file);

        let mut first_line = String::new();
        if let Err(e) = reader.read_line(&mut first_line) {
            panic!("Failed to read first line: {}", e);
        }

        let names: Vec<String> = first_line
            .trim_end()
            .split(',')
            .map(|s| s.to_string())
            .collect();

        let mut data: HashMap<String, Vec<f32>> = Default::default();
        let mut idx: Vec<String> = Vec::new();

        for line in reader.lines().flatten() {
            let row: Vec<String> = line.split(',').map(|s| s.to_string()).collect();
            idx.push(row[0].clone());

            for (i, v) in row.iter().enumerate().skip(1) {
                let name = &names[i];
                let value: f32 = match v.parse() {
                    Ok(val) => val,
                    Err(e) => {
                        eprintln!(
                            "Failed to parse value '{}' as f32 in column '{}': {}",
                            v, name, e
                        );
                        continue;
                    }
                };
                data.entry(name.clone())
                    .or_insert_with(Vec::new)
                    .push(value);
            }
        }

        FileData {
            names: names[1..].to_vec(),
            data,
            idx,
        }
    }
}
